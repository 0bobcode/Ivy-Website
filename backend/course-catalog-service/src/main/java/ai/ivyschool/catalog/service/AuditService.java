package ai.ivyschool.catalog.service;

import ai.ivyschool.catalog.domain.AuditLog;
import ai.ivyschool.catalog.repository.AuditLogRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

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
