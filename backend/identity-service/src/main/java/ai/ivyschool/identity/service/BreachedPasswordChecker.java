package ai.ivyschool.identity.service;

import ai.ivyschool.identity.config.AppProperties;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

/**
 * Checks a password against the Have I Been Pwned breach corpus using the
 * k-anonymity range API (§7.1, story PLT-01): only the first 5 hex characters of
 * the password's SHA-1 hash ever leave this service, so the real password —
 * and even its full hash — is never sent anywhere.
 */
@Service
public class BreachedPasswordChecker {

    private static final String RANGE_API = "https://api.pwnedpasswords.com/range/";

    private final AppProperties properties;
    private final RestClient restClient = RestClient.create();

    public BreachedPasswordChecker(AppProperties properties) {
        this.properties = properties;
    }

    public boolean isBreached(String password) {
        if (!properties.passwordBreachCheck().enabled()) {
            return false;
        }
        String sha1 = sha1Hex(password);
        String prefix = sha1.substring(0, 5);
        String suffix = sha1.substring(5);
        try {
            String body = restClient.get()
                    .uri(RANGE_API + prefix)
                    .retrieve()
                    .body(String.class);
            if (body == null) {
                return false;
            }
            return body.lines().anyMatch(line -> line.startsWith(suffix));
        } catch (Exception e) {
            // Fail open: an unreachable HIBP must never block signup/reset.
            return false;
        }
    }

    private static String sha1Hex(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-1");
            byte[] hash = digest.digest(value.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().withUpperCase().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }
}
