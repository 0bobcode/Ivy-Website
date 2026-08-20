package ai.ivyschool.identity.service;

import ai.ivyschool.identity.domain.PasswordResetToken;
import ai.ivyschool.identity.domain.User;
import ai.ivyschool.identity.exception.ApiException;
import ai.ivyschool.identity.repository.PasswordResetTokenRepository;
import ai.ivyschool.identity.repository.UserRepository;
import ai.ivyschool.identity.security.TokenHasher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.Optional;

/** Self-service password reset (§7.1, story PLT-03): single-use, 15-minute link. */
@Service
public class PasswordResetService {

    private static final Duration TOKEN_TTL = Duration.ofMinutes(15);

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final BreachedPasswordChecker breachedPasswordChecker;
    private final AuditService auditService;
    private final SecureRandom secureRandom = new SecureRandom();

    public PasswordResetService(UserRepository userRepository, PasswordResetTokenRepository tokenRepository,
                                 PasswordEncoder passwordEncoder, BreachedPasswordChecker breachedPasswordChecker,
                                 AuditService auditService) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.breachedPasswordChecker = breachedPasswordChecker;
        this.auditService = auditService;
    }

    /**
     * Always succeeds from the caller's point of view, whether or not the email
     * exists — never reveal account existence through this endpoint. Returns the
     * raw token only so the (not-yet-built) Messaging service can email it;
     * nothing else should ever log or persist the raw value.
     */
    @Transactional
    public Optional<String> requestReset(String email) {
        Optional<User> user = userRepository.findByEmail(email.toLowerCase(java.util.Locale.ROOT));
        if (user.isEmpty()) {
            return Optional.empty();
        }
        String rawToken = generateOpaqueToken();
        Instant expiresAt = Instant.now().plus(TOKEN_TTL);
        tokenRepository.save(new PasswordResetToken(user.get(), TokenHasher.sha256Base64(rawToken), expiresAt));
        auditService.record(user.get().getId(), null, "PASSWORD_RESET_REQUESTED", "user:" + user.get().getId());
        return Optional.of(rawToken);
    }

    @Transactional
    public void completeReset(String rawToken, String newPassword) {
        PasswordResetToken token = tokenRepository.findByTokenHash(TokenHasher.sha256Base64(rawToken))
                .filter(PasswordResetToken::isUsable)
                .orElseThrow(() -> ApiException.invalidOrExpiredToken("reset link"));

        if (breachedPasswordChecker.isBreached(newPassword)) {
            throw ApiException.breachedPassword();
        }

        User user = token.getUser();
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        token.markUsed();
        auditService.record(user.getId(), null, "PASSWORD_RESET_COMPLETED", "user:" + user.getId());
    }

    private String generateOpaqueToken() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
