package ai.ivyschool.identity.repository;

import ai.ivyschool.identity.domain.RoleBinding;
import ai.ivyschool.identity.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RoleBindingRepository extends JpaRepository<RoleBinding, UUID> {
    List<RoleBinding> findByUser(User user);

    List<RoleBinding> findByTenantId(UUID tenantId);

    Optional<RoleBinding> findByUserIdAndRole_NameAndTenantId(UUID userId, String roleName, UUID tenantId);

    List<RoleBinding> findByUserIdAndRole_Name(UUID userId, String roleName);
}
