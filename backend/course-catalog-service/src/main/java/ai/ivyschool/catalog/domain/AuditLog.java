package ai.ivyschool.catalog.domain;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "audit_log")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "occurred_at", nullable = false)
    private Instant occurredAt = Instant.now();

    @Column(name = "actor_id")
    private UUID actorId;

    @Column(name = "tenant_id")
    private UUID tenantId;

    @Column(nullable = false)
    private String action;

    @Column(nullable = false)
    private String resource;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private String metadata;

    protected AuditLog() {
    }

    public AuditLog(UUID actorId, UUID tenantId, String action, String resource, String metadata) {
        this.actorId = actorId;
        this.tenantId = tenantId;
        this.action = action;
        this.resource = resource;
        this.metadata = metadata;
    }
}
