package ai.ivyschool.identity.security;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

/** Hashes opaque bearer tokens (refresh / password-reset) before they touch the DB. */
public final class TokenHasher {

    private TokenHasher() {
    }

    public static String sha256Base64(String value) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(value.getBytes());
            return Base64.getEncoder().encodeToString(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }
}
