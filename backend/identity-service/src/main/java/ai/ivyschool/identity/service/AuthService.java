package ai.ivyschool.identity.service;

import ai.ivyschool.identity.config.AppProperties;
import ai.ivyschool.identity.domain.MfaFactor;
import ai.ivyschool.identity.domain.MfaFactorType;
import ai.ivyschool.identity.domain.RefreshToken;
import ai.ivyschool.identity.domain.RoleBinding;
import ai.ivyschool.identity.domain.User;
import ai.ivyschool.identity.domain.UserStatus;
import ai.ivyschool.identity.exception.ApiException;
import ai.ivyschool.identity.repository.MfaFactorRepository;
import ai.ivyschool.identity.repository.RefreshTokenRepository;
import ai.ivyschool.identity.repository.RoleBindingRepository;
import ai.ivyschool.identity.repository.RoleRepository;
import ai.ivyschool.identity.repository.UserRepository;
import ai.ivyschool.identity.security.JwtService;
import ai.ivyschool.identity.security.TokenHasher;
import ai.ivyschool.identity.web.dto.AuthDtos.LoginRequest;
import ai.ivyschool.identity.web.dto.AuthDtos.SignupRequest;
import ai.ivyschool.identity.web.dto.AuthDtos.TokenResponse;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final MfaFactorRepository mfaFactorRepository;
    private final RoleBindingRepository roleBindingRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final TotpService totpService;
    private final CaptchaVerifier captchaVerifier;
    private final BreachedPasswordChecker breachedPasswordChecker;
    private final JwtService jwtService;
    private final AuditService auditService;
    private final AppProperties properties;
    private final EncryptionService encryptionService;
    private final RoleRepository roleRepository;
    private final SecureRandom secureRandom = new SecureRandom();

    public AuthService(UserRepository userRepository, MfaFactorRepository mfaFactorRepository,
                        RoleBindingRepository roleBindingRepository, RefreshTokenRepository refreshTokenRepository,
                        PasswordEncoder passwordEncoder, TotpService totpService, CaptchaVerifier captchaVerifier,
                        BreachedPasswordChecker breachedPasswordChecker, JwtService jwtService,
                        AuditService auditService, AppProperties properties, EncryptionService encryptionService,
                        RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.mfaFactorRepository = mfaFactorRepository;
        this.roleBindingRepository = roleBindingRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.totpService = totpService;
        this.captchaVerifier = captchaVerifier;
        this.breachedPasswordChecker = breachedPasswordChecker;
        this.jwtService = jwtService;
        this.auditService = auditService;
        this.properties = properties;
        this.encryptionService = encryptionService;
        this.roleRepository = roleRepository;
    }

    @Transactional
    public User signup(SignupRequest request) {
        if (!captchaVerifier.verify(request.captchaToken())) {
            throw ApiException.captchaFailed();
        }
        if (breachedPasswordChecker.isBreached(request.password())) {
            throw ApiException.breachedPassword();
        }
        if (userRepository.existsByEmail(request.email().toLowerCase(java.util.Locale.ROOT))) {
            throw ApiException.emailAlreadyRegistered();
        }
        User user = new User(request.email(), passwordEncoder.encode(request.password()));
        userRepository.save(user);

        // Self-serve signup is the Student/Guest-to-Student path (story STU-04's
        // prerequisite). Every other persona is provisioned through an invite or
        // admin action (ADM-01, SAD-02, ...) that binds a different role instead.
        roleRepository.findByName("STUDENT")
                .ifPresent(role -> roleBindingRepository.save(new RoleBinding(user, role, null)));

        auditService.record(user.getId(), null, "USER_SIGNED_UP", "user:" + user.getId());
        // Email verification and welcome messaging are handled by the Messaging &
        // Notification service (ARCHITECTURE.md §3.2) — not yet stood up, so the
        // account is active immediately for Phase 1. Revisit before general launch.
        return user;
    }

    @Transactional
    public TokenResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email().toLowerCase(java.util.Locale.ROOT))
                .orElseThrow(ApiException::invalidCredentials);

        if (user.getStatus() == UserStatus.SUSPENDED) {
            throw ApiException.accountSuspended();
        }
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw ApiException.invalidCredentials();
        }

        if (user.isMfaEnabled()) {
            Optional<MfaFactor> factor = mfaFactorRepository.findByUserAndFactorType(user, MfaFactorType.TOTP)
                    .filter(MfaFactor::isVerified);
            if (factor.isEmpty()) {
                throw ApiException.invalidCredentials();
            }
            if (request.mfaCode() == null || request.mfaCode().isBlank()) {
                throw ApiException.mfaCodeRequired();
            }
            String secret = decryptSecret(factor.get());
            if (!totpService.verifyCode(secret, request.mfaCode())) {
                throw ApiException.invalidMfaCode();
            }
        }

        auditService.record(user.getId(), null, "USER_LOGGED_IN", "user:" + user.getId());
        return issueTokens(user);
    }

    @Transactional
    public TokenResponse refresh(String rawRefreshToken) {
        RefreshToken stored = refreshTokenRepository.findByTokenHash(TokenHasher.sha256Base64(rawRefreshToken))
                .filter(RefreshToken::isActive)
                .orElseThrow(() -> ApiException.invalidOrExpiredToken("refresh token"));
        stored.revoke(); // rotate: one-time-use refresh tokens
        return issueTokens(stored.getUser());
    }

    @Transactional
    public void logout(String rawRefreshToken) {
        refreshTokenRepository.findByTokenHash(TokenHasher.sha256Base64(rawRefreshToken)).ifPresent(RefreshToken::revoke);
    }

    private TokenResponse issueTokens(User user) {
        List<String> roles = roleBindingRepository.findByUser(user).stream()
                .map(binding -> binding.getRole().getName())
                .distinct()
                .toList();

        String accessToken = jwtService.issueAccessToken(user.getId(), user.getEmail(), roles);

        String rawRefreshToken = generateOpaqueToken();
        Instant expiresAt = Instant.now().plus(properties.jwt().refreshTokenTtl());
        refreshTokenRepository.save(new RefreshToken(user, TokenHasher.sha256Base64(rawRefreshToken), expiresAt));

        return new TokenResponse(accessToken, rawRefreshToken, properties.jwt().accessTokenTtl().toSeconds());
    }

    private String decryptSecret(MfaFactor factor) {
        return new String(encryptionService.decrypt(factor.getSecretEncrypted()));
    }

    private String generateOpaqueToken() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
