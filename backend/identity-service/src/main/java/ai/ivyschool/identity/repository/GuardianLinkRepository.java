package ai.ivyschool.identity.repository;

import ai.ivyschool.identity.domain.GuardianLink;
import ai.ivyschool.identity.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface GuardianLinkRepository extends JpaRepository<GuardianLink, UUID> {
    List<GuardianLink> findByParent(User parent);

    Optional<GuardianLink> findByParentAndStudent(User parent, User student);
}
