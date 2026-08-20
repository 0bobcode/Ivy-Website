package ai.ivyschool.catalog.repository;

import ai.ivyschool.catalog.domain.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
}
