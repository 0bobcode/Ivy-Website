package ai.ivyschool.identity.web;

import ai.ivyschool.identity.domain.UserStatus;
import ai.ivyschool.identity.service.TenantService;
import ai.ivyschool.identity.web.dto.TenantDtos.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/** ADM-01 (create/list), SAD-01 (profile), SAD-02 (invite teachers), SAD-09 (deactivate). */
@RestController
@RequestMapping("/api/v1/tenants")
public class TenantController {

    private final TenantService tenantService;

    public TenantController(TenantService tenantService) {
        this.tenantService = tenantService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<TenantSummary> list() {
        return tenantService.list().stream().map(TenantSummary::from).toList();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public TenantSummary create(Authentication authentication, @Valid @RequestBody CreateTenantRequest request) {
        return TenantSummary.from(tenantService.create(userId(authentication), request.name()));
    }

    /** A school admin's own school — the profile-editing surface for SAD-01. */
    @GetMapping("/mine")
    @PreAuthorize("hasRole('SCHOOL_ADMIN')")
    public TenantSummary mine(Authentication authentication) {
        return TenantSummary.from(tenantService.myTenant(userId(authentication)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SCHOOL_ADMIN')")
    public TenantSummary update(@PathVariable UUID id, Authentication authentication,
                                 @Valid @RequestBody UpdateTenantRequest request) {
        return TenantSummary.from(tenantService.update(userId(authentication), id, isPlatformAdmin(authentication),
                request.name(), request.logoUrl(), request.description()));
    }

    @PostMapping("/{id}/invite-teacher")
    @PreAuthorize("hasAnyRole('ADMIN', 'SCHOOL_ADMIN')")
    public InviteTeacherResponse inviteTeacher(@PathVariable UUID id, Authentication authentication,
                                                @Valid @RequestBody InviteTeacherRequest request) {
        return tenantService.inviteTeacher(userId(authentication), id, isPlatformAdmin(authentication), request.email());
    }

    @GetMapping("/{id}/members")
    @PreAuthorize("hasAnyRole('ADMIN', 'SCHOOL_ADMIN')")
    public List<TenantMemberSummary> members(@PathVariable UUID id, Authentication authentication) {
        return tenantService.members(userId(authentication), id, isPlatformAdmin(authentication));
    }

    @PatchMapping("/{id}/members/{userId}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'SCHOOL_ADMIN')")
    public TenantMemberSummary updateMemberStatus(@PathVariable UUID id, @PathVariable("userId") UUID targetUserId,
                                                    Authentication authentication,
                                                    @Valid @RequestBody UpdateMemberStatusRequest request) {
        UserStatus status = UserStatus.valueOf(request.status());
        return tenantService.updateMemberStatus(userId(authentication), id, isPlatformAdmin(authentication),
                targetUserId, status);
    }

    private UUID userId(Authentication authentication) {
        return (UUID) authentication.getPrincipal();
    }

    private boolean isPlatformAdmin(Authentication authentication) {
        return authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
    }
}
