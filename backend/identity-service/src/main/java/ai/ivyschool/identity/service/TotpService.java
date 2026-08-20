package ai.ivyschool.identity.service;

import dev.samstevens.totp.code.CodeVerifier;
import dev.samstevens.totp.code.DefaultCodeGenerator;
import dev.samstevens.totp.code.DefaultCodeVerifier;
import dev.samstevens.totp.qr.QrData;
import dev.samstevens.totp.secret.DefaultSecretGenerator;
import dev.samstevens.totp.secret.SecretGenerator;
import dev.samstevens.totp.time.SystemTimeProvider;
import org.springframework.stereotype.Service;

/** TOTP (RFC 6238) enrollment and verification for MFA (§7.1, story PLT-02). */
@Service
public class TotpService {

    private static final String ISSUER = "IvySchool.ai";

    private final SecretGenerator secretGenerator = new DefaultSecretGenerator();
    private final CodeVerifier codeVerifier =
            new DefaultCodeVerifier(new DefaultCodeGenerator(), new SystemTimeProvider());

    public String generateSecret() {
        return secretGenerator.generate();
    }

    public String buildOtpAuthUri(String email, String base32Secret) {
        QrData data = new QrData.Builder()
                .label(email)
                .secret(base32Secret)
                .issuer(ISSUER)
                .algorithm(dev.samstevens.totp.code.HashingAlgorithm.SHA1)
                .digits(6)
                .period(30)
                .build();
        return data.getUri();
    }

    public boolean verifyCode(String base32Secret, String code) {
        return codeVerifier.isValidCode(base32Secret, code);
    }
}
