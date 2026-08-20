package ai.ivyschool.identity.service;

import ai.ivyschool.identity.domain.RoleBinding;
import ai.ivyschool.identity.domain.Tenant;
import ai.ivyschool.identity.domain.User;
import ai.ivyschool.identity.domain.UserStatus;
import ai.ivyschool.identity.exception.ApiException;
import ai.ivyschool.identity.repository.RoleBindingRepository;
import ai.ivyschool.identity.repository.RoleRepository;
import ai.ivyschool.identity.repository.TenantRepository;
import ai.ivyschool.identity.repository.UserRepository;
import ai.ivyschool.identity.web.dto.TenantDtos.InviteTeacherResponse;
import ai.ivyschool.identity.web.dto.TenantDtos.TenantMemberSummary;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

/** Backs ADM-01 (create), SAD-01 (profile), SAD-02 (invite teachers), SAD-09 (deactivate). */
@Service
public class TenantService {

    private final TenantRepository tenantRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RoleBindingRepository roleBindingRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetService passwordResetService;
    private final TenantScopeService tenantScopeService;
    private final AuditService auditService;
    private final SecureRandom secureRandom = new SecureRandom();

    public TenantService(TenantRepository tenantRepository, UserRepository userRepository,
                          RoleRepository roleRepository, RoleBindingRepository roleBindingRepository,
                          PasswordEncoder passwordEncoder, PasswordResetService passwordResetService,
                          TenantScopeService tenantScopeService, AuditService auditService) {
        this.tenantRepository = tenantRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.roleBindingRepository = roleBindingRepository;
        this.passwordEncoder = passwordEncoder;
        this.passwordResetService = passwordResetService;
        this.tenantScopeService = tenantScopeService;
        this.auditService = auditService;
    }

    @Transactional(readOnly = true)
    public List<Tenant> list() {
        return tenantRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Tenant get(UUID tenantId) {
        return tenantRepository.findById(tenantId).orElseThrow(ApiException::tenantNotFound);
    }

    @Transactional(readOnly = true)
    public Tenant myTenant(UUID actorId) {
        return get(tenantScopeService.requireOwnTenant(actorId));
    }

    @Transactional
    public Tenant create(UUID actorId, String name) {
        Tenant tenant = new Tenant(name);
        tenantRepository.save(tenant);
        auditService.record(actorId, tenant.getId(), "TENANT_CREATED", "tenant:" + tenant.getId());
        return tenant;
    }

    /** SAD-01 — school profile/branding, editable by the school's own admin or a platform admin. */
    @Transactional
    public Tenant update(UUID actorId, UUID tenantId, boolean actorIsPlatformAdmin,
                          String name, String logoUrl, String description) {
        tenantScopeService.assertCanManageTenant(actorId, tenantId, actorIsPlatformAdmin);
        Tenant tenant = get(tenantId);
        tenant.setName(name);
        tenant.setLogoUrl(logoUrl);
        tenant.setDescription(description);
        auditService.record(actorId, tenantId, "TENANT_PROFILE_UPDATED", "tenant:" + tenantId);
        return tenant;
    }

    /** SAD-02 — invite (or re-bind) a teacher into this school. */
    @Transactional
    public InviteTeacherResponse inviteTeacher(UUID actorId, UUID tenantId, boolean actorIsPlatformAdmin,
                                                String email) {
        tenantScopeService.assertCanManageTenant(actorId, tenantId, actorIsPlatformAdmin);
        Tenant tenant = get(tenantId);
        String normalizedEmail = email.toLowerCase(java.util.Locale.ROOT);

        boolean newAccount = false;
        User user = userRepository.findByEmail(normalizedEmail).orElse(null);
        if (user == null) {
            user = new User(normalizedEmail, passwordEncoder.encode(randomPlaceholderPassword()));
            userRepository.save(user);
            newAccount = true;
        }

        var teacherRole = roleRepository.findByName("TEACHER").orElseThrow();
        boolean alreadyBound = roleBindingRepository.findByUser(user).stream()
                .anyMatch(b -> b.getRole().getId().equals(teacherRole.getId())
                        && b.getTenant() != null && b.getTenant().getId().equals(tenantId));
        if (!alreadyBound) {
            roleBindingRepository.save(new RoleBinding(user, teacherRole, tenant));
        }

        String devResetToken = newAccount ? passwordResetService.requestReset(normalizedEmail).orElse(null) : null;
        auditService.record(actorId, tenantId, "TEACHER_INVITED", "user:" + user.getId());
        return new InviteTeacherResponse(user.getId(), user.getEmail(), newAccount, devResetToken);
    }

    /** SAD-02/09 — everyone with a role binding in this school, for management/deactivation UIs. */
    @Transactional(readOnly = true)
    public List<TenantMemberSummary> members(UUID actorId, UUID tenantId, boolean actorIsPlatformAdmin) {
        tenantScopeService.assertCanManageTenant(actorId, tenantId, actorIsPlatformAdmin);
        var bindings = roleBindingRepository.findByTenantId(tenantId);
        var byUser = new java.util.LinkedHashMap<UUID, List<String>>();
        var users = new java.util.LinkedHashMap<UUID, User>();
        for (RoleBinding b : bindings) {
            byUser.computeIfAbsent(b.getUser().getId(), k -> new java.util.ArrayList<>()).add(b.getRole().getName());
            users.put(b.getUser().getId(), b.getUser());
        }
        return byUser.entrySet().stream()
                .map(e -> new TenantMemberSummary(e.getKey(), users.get(e.getKey()).getEmail(),
                        users.get(e.getKey()).getStatus().name(), e.getValue()))
                .toList();
    }

    /** SAD-09 — suspend/reinstate a member of this school. */
    @Transactional
    public TenantMemberSummary updateMemberStatus(UUID actorId, UUID tenantId, boolean actorIsPlatformAdmin,
                                                    UUID targetUserId, UserStatus newStatus) {
        tenantScopeService.assertCanManageTenant(actorId, tenantId, actorIsPlatformAdmin);
        boolean belongsToTenant = roleBindingRepository.findByTenantId(tenantId).stream()
                .anyMatch(b -> b.getUser().getId().equals(targetUserId));
        if (!belongsToTenant) {
            throw ApiException.userNotInTenant();
        }
        User user = userRepository.findById(targetUserId).orElseThrow(ApiException::invalidCredentials);
        user.setStatus(newStatus);
        auditService.record(actorId, tenantId, "USER_STATUS_CHANGED:" + newStatus, "user:" + targetUserId);
        var roles = roleBindingRepository.findByUser(user).stream().map(b -> b.getRole().getName()).distinct().toList();
        return new TenantMemberSummary(user.getId(), user.getEmail(), user.getStatus().name(), roles);
    }

    private String randomPlaceholderPassword() {
        byte[] bytes = new byte[24];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
