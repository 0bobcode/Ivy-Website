package ai.ivyschool.identity.service;

import ai.ivyschool.identity.config.AppProperties;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.ByteBuffer;
import java.security.SecureRandom;
import java.util.Base64;

/**
 * AES-256-GCM envelope encryption for at-rest secrets (MFA TOTP seeds, per
 * ARCHITECTURE.md §5.4). The master key is externalized config, never source
 * (§7.5); in production this key itself is generated/rotated by KMS and injected
 * as an env var, not stored in a config file.
 */
@Service
public class EncryptionService {

    private static final int IV_LENGTH_BYTES = 12;
    private static final int TAG_LENGTH_BITS = 128;

    private final SecretKeySpec masterKey;
    private final SecureRandom secureRandom = new SecureRandom();

    public EncryptionService(AppProperties properties) {
        byte[] keyBytes = Base64.getDecoder().decode(properties.encryption().masterKey());
        if (keyBytes.length != 32) {
            throw new IllegalStateException("app.encryption.master-key must decode to 32 bytes (AES-256)");
        }
        this.masterKey = new SecretKeySpec(keyBytes, "AES");
    }

    public byte[] encrypt(byte[] plaintext) {
        try {
            byte[] iv = new byte[IV_LENGTH_BYTES];
            secureRandom.nextBytes(iv);
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            cipher.init(Cipher.ENCRYPT_MODE, masterKey, new GCMParameterSpec(TAG_LENGTH_BITS, iv));
            byte[] ciphertext = cipher.doFinal(plaintext);
            return ByteBuffer.allocate(iv.length + ciphertext.length).put(iv).put(ciphertext).array();
        } catch (Exception e) {
            throw new IllegalStateException("Encryption failed", e);
        }
    }

    public byte[] decrypt(byte[] ivAndCiphertext) {
        try {
            ByteBuffer buffer = ByteBuffer.wrap(ivAndCiphertext);
            byte[] iv = new byte[IV_LENGTH_BYTES];
            buffer.get(iv);
            byte[] ciphertext = new byte[buffer.remaining()];
            buffer.get(ciphertext);
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            cipher.init(Cipher.DECRYPT_MODE, masterKey, new GCMParameterSpec(TAG_LENGTH_BITS, iv));
            return cipher.doFinal(ciphertext);
        } catch (Exception e) {
            throw new IllegalStateException("Decryption failed", e);
        }
    }
}
