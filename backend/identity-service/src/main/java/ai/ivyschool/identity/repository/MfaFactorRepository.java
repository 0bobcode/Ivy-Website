package ai.ivyschool.identity.repository;

import ai.ivyschool.identity.domain.MfaFactor;
import ai.ivyschool.identity.domain.MfaFactorType;
import ai.ivyschool.identity.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MfaFactorRepository extends JpaRepository<MfaFactor, UUID> {
    List<MfaFactor> findByUser(User user);

    Optional<MfaFactor> findByUserAndFactorType(User user, MfaFactorType factorType);
}
