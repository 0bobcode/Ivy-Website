package ai.ivyschool.identity.service;

import ai.ivyschool.identity.domain.GuardianLink;
import ai.ivyschool.identity.domain.User;
import ai.ivyschool.identity.exception.ApiException;
import ai.ivyschool.identity.repository.GuardianLinkRepository;
import ai.ivyschool.identity.repository.RoleBindingRepository;
import ai.ivyschool.identity.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/** Backs PAR-01 (link) and PAR-02 (explicit consent, revocable). */
@Service
public class GuardianLinkService {

    private final GuardianLinkRepository guardianLinkRepository;
    private final UserRepository userRepository;
    private final RoleBindingRepository roleBindingRepository;
    private final AuditService auditService;

    public GuardianLinkService(GuardianLinkRepository guardianLinkRepository, UserRepository userRepository,
                                RoleBindingRepository roleBindingRepository, AuditService auditService) {
        this.guardianLinkRepository = guardianLinkRepository;
        this.userRepository = userRepository;
        this.roleBindingRepository = roleBindingRepository;
        this.auditService = auditService;
    }

    @Transactional
    public GuardianLink requestLink(UUID parentId, String studentEmail) {
        User parent = userRepository.findById(parentId).orElseThrow(ApiException::invalidCredentials);
        User student = userRepository.findByEmail(studentEmail.toLowerCase(java.util.Locale.ROOT))
                .orElseThrow(ApiException::studentNotFound);

        boolean isStudent = roleBindingRepository.findByUserIdAndRole_Name(student.getId(), "STUDENT")
                .stream().findAny().isPresent();
        if (!isStudent) {
            throw ApiException.studentNotFound();
        }

        GuardianLink link = guardianLinkRepository.findByParentAndStudent(parent, student)
                .orElseGet(() -> guardianLinkRepository.save(new GuardianLink(parent, student)));
        auditService.record(parentId, null, "GUARDIAN_LINK_REQUESTED", "user:" + student.getId());
        return link;
    }

    @Transactional(readOnly = true)
    public List<GuardianLink> mine(UUID parentId) {
        User parent = userRepository.findById(parentId).orElseThrow(ApiException::invalidCredentials);
        return guardianLinkRepository.findByParent(parent);
    }

    @Transactional
    public GuardianLink grantConsent(UUID parentId, UUID linkId) {
        GuardianLink link = ownedLink(parentId, linkId);
        link.confirmConsent();
        auditService.record(parentId, null, "PARENT_CONSENT_GRANTED", "user:" + link.getStudent().getId());
        return link;
    }

    @Transactional
    public GuardianLink revokeConsent(UUID parentId, UUID linkId) {
        GuardianLink link = ownedLink(parentId, linkId);
        link.revoke();
        auditService.record(parentId, null, "PARENT_CONSENT_REVOKED", "user:" + link.getStudent().getId());
        return link;
    }

    private GuardianLink ownedLink(UUID parentId, UUID linkId) {
        GuardianLink link = guardianLinkRepository.findById(linkId).orElseThrow(ApiException::guardianLinkNotFound);
        if (!link.isOwnedByParent(parentId)) {
            throw ApiException.notLinkOwner();
        }
        return link;
    }
}
