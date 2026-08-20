package ai.ivyschool.identity.domain;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

/** Backs PAR-01 (link) and PAR-02 (COPPA-style consent) — see V2 migration comment. */
@Entity
@Table(name = "guardian_links")
public class GuardianLink {

    @Id
    @GeneratedValue
    private UUID id;

    // Eager: DTO mapping happens outside the service's transaction
    // (open-in-view is off), so lazy here throws LazyInitializationException
    // on every read — same fix as Course.lessons in course-catalog-service.
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "parent_id", nullable = false)
    private User parent;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GuardianLinkStatus status = GuardianLinkStatus.PENDING_CONSENT;

    @Column(name = "requested_at", nullable = false, updatable = false)
    private Instant requestedAt = Instant.now();

    @Column(name = "consent_given_at")
    private Instant consentGivenAt;

    protected GuardianLink() {
    }

    public GuardianLink(User parent, User student) {
        this.parent = parent;
        this.student = student;
    }

    public UUID getId() {
        return id;
    }

    public User getParent() {
        return parent;
    }

    public User getStudent() {
        return student;
    }

    public GuardianLinkStatus getStatus() {
        return status;
    }

    public Instant getRequestedAt() {
        return requestedAt;
    }

    public Instant getConsentGivenAt() {
        return consentGivenAt;
    }

    public void confirmConsent() {
        this.status = GuardianLinkStatus.CONFIRMED;
        this.consentGivenAt = Instant.now();
    }

    public void revoke() {
        this.status = GuardianLinkStatus.REVOKED;
    }

    public boolean isOwnedByParent(UUID parentId) {
        return parent.getId().equals(parentId);
    }
}
