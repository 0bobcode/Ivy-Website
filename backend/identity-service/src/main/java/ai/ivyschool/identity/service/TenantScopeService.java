package ai.ivyschool.identity.service;

import ai.ivyschool.identity.domain.RoleBinding;
import ai.ivyschool.identity.exception.ApiException;
import ai.ivyschool.identity.repository.RoleBindingRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * Row-level tenant scoping for SCHOOL_ADMIN actions (SAD-01/02/09): a
 * platform ADMIN can manage any tenant, but a SCHOOL_ADMIN may only manage
 * the one tenant their own SCHOOL_ADMIN role binding points at.
 */
@Service
public class TenantScopeService {

    private final RoleBindingRepository roleBindingRepository;

    public TenantScopeService(RoleBindingRepository roleBindingRepository) {
        this.roleBindingRepository = roleBindingRepository;
    }

    /** Throws 403 unless the actor is a platform admin or the SCHOOL_ADMIN of {@code tenantId}. */
    public void assertCanManageTenant(UUID actorId, UUID tenantId, boolean actorIsPlatformAdmin) {
        if (actorIsPlatformAdmin) {
            return;
        }
        boolean managesTenant = roleBindingRepository.findByUserIdAndRole_Name(actorId, "SCHOOL_ADMIN").stream()
                .map(RoleBinding::getTenant)
                .filter(java.util.Objects::nonNull)
                .anyMatch(tenant -> tenant.getId().equals(tenantId));
        if (!managesTenant) {
            throw new ApiException(HttpStatus.FORBIDDEN, "TENANT_ACCESS_DENIED",
                    "You do not manage this school.");
        }
    }

    /** The single tenant a SCHOOL_ADMIN manages, or empty for a platform admin with no binding. */
    public UUID requireOwnTenant(UUID actorId) {
        return roleBindingRepository.findByUserIdAndRole_Name(actorId, "SCHOOL_ADMIN").stream()
                .map(RoleBinding::getTenant)
                .filter(java.util.Objects::nonNull)
                .map(tenant -> tenant.getId())
                .findFirst()
                .orElseThrow(() -> new ApiException(HttpStatus.FORBIDDEN, "NOT_A_SCHOOL_ADMIN",
                        "This account is not a school admin for any school."));
    }
}
