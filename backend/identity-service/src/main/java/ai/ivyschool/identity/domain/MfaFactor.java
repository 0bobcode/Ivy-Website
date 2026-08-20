package ai.ivyschool.identity.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "mfa_factors")
public class MfaFactor {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "factor_type", nullable = false)
    private MfaFactorType factorType;

    // Envelope-encrypted TOTP secret (see EncryptionService). Never logged, never
    // returned in an API response after enrollment.
    @Column(name = "secret_encrypted", nullable = false)
    private byte[] secretEncrypted;

    @Column(name = "verified_at")
    private Instant verifiedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    protected MfaFactor() {
    }

    public MfaFactor(User user, MfaFactorType factorType, byte[] secretEncrypted) {
        this.user = user;
        this.factorType = factorType;
        this.secretEncrypted = secretEncrypted;
    }

    public UUID getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public MfaFactorType getFactorType() {
        return factorType;
    }

    public byte[] getSecretEncrypted() {
        return secretEncrypted;
    }

    public Instant getVerifiedAt() {
        return verifiedAt;
    }

    public boolean isVerified() {
        return verifiedAt != null;
    }

    public void markVerified() {
        this.verifiedAt = Instant.now();
    }
}
