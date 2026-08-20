package ai.ivyschool.identity.service;

import ai.ivyschool.identity.domain.MfaFactor;
import ai.ivyschool.identity.domain.MfaFactorType;
import ai.ivyschool.identity.domain.User;
import ai.ivyschool.identity.exception.ApiException;
import ai.ivyschool.identity.repository.MfaFactorRepository;
import ai.ivyschool.identity.repository.UserRepository;
import ai.ivyschool.identity.web.dto.AuthDtos.MfaEnrollResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.util.UUID;

/** TOTP enrollment/verification flow behind story PLT-02. */
@Service
public class MfaService {

    private final UserRepository userRepository;
    private final MfaFactorRepository mfaFactorRepository;
    private final TotpService totpService;
    private final EncryptionService encryptionService;
    private final AuditService auditService;

    public MfaService(UserRepository userRepository, MfaFactorRepository mfaFactorRepository,
                       TotpService totpService, EncryptionService encryptionService, AuditService auditService) {
        this.userRepository = userRepository;
        this.mfaFactorRepository = mfaFactorRepository;
        this.totpService = totpService;
        this.encryptionService = encryptionService;
        this.auditService = auditService;
    }

    @Transactional
    public MfaEnrollResponse startEnrollment(UUID userId) {
        User user = requireUser(userId);
        if (user.isMfaEnabled()) {
            throw ApiException.mfaAlreadyEnabled();
        }
        // Replace any prior unverified attempt rather than accumulating dead rows.
        mfaFactorRepository.findByUserAndFactorType(user, MfaFactorType.TOTP)
                .filter(f -> !f.isVerified())
                .ifPresent(mfaFactorRepository::delete);

        String secret = totpService.generateSecret();
        byte[] encrypted = encryptionService.encrypt(secret.getBytes(StandardCharsets.UTF_8));
        mfaFactorRepository.save(new MfaFactor(user, MfaFactorType.TOTP, encrypted));

        String otpAuthUri = totpService.buildOtpAuthUri(user.getEmail(), secret);
        return new MfaEnrollResponse(secret, otpAuthUri);
    }

    @Transactional
    public void confirmEnrollment(UUID userId, String code) {
        User user = requireUser(userId);
        MfaFactor factor = mfaFactorRepository.findByUserAndFactorType(user, MfaFactorType.TOTP)
                .filter(f -> !f.isVerified())
                .orElseThrow(ApiException::mfaNotEnrolled);

        String secret = new String(encryptionService.decrypt(factor.getSecretEncrypted()), StandardCharsets.UTF_8);
        if (!totpService.verifyCode(secret, code)) {
            throw ApiException.invalidMfaCode();
        }

        factor.markVerified();
        user.setMfaEnabled(true);
        auditService.record(userId, null, "MFA_ENABLED", "user:" + userId);
    }

    private User requireUser(UUID userId) {
        return userRepository.findById(userId).orElseThrow(ApiException::invalidCredentials);
    }
}
