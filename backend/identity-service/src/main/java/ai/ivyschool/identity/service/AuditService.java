package ai.ivyschool.identity.service;

import ai.ivyschool.identity.domain.AuditLog;
import ai.ivyschool.identity.repository.AuditLogRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

/** Writes immutable audit events for sensitive actions (§3.5 @Auditable, story ADM-07). */
@Service
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public AuditService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public void record(UUID actorId, UUID tenantId, String action, String resource) {
        auditLogRepository.save(new AuditLog(actorId, tenantId, action, resource, null));
    }
}
