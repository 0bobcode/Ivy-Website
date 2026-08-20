package ai.ivyschool.identity.repository;

import ai.ivyschool.identity.domain.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
}
