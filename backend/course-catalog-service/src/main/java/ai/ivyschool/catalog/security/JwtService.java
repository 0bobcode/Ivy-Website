package ai.ivyschool.catalog.security;

import ai.ivyschool.catalog.config.AppProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Verify-only counterpart of identity-service's JwtService — this service
 * never issues tokens, only checks ones identity-service already signed.
 *
 * TODO(fast-follow): extract this + JwtAuthenticationFilter into a shared
 * ivy-security-starter module now that a second service needs them
 * (ARCHITECTURE.md §4.2) instead of hand-duplicating ~80 lines. Deferred
 * for this sprint to avoid restructuring identity-service mid-flight.
 */
@Service
public class JwtService {

    private final SecretKey signingKey;

    public JwtService(AppProperties properties) {
        byte[] keyBytes = Base64.getDecoder().decode(properties.jwt().signingKey());
        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
    }

    public Optional<AccessTokenClaims> parseAccessToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(signingKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            UUID userId = UUID.fromString(claims.getSubject());
            String email = claims.get("email", String.class);
            @SuppressWarnings("unchecked")
            List<String> roles = claims.get("roles", List.class);
            return Optional.of(new AccessTokenClaims(userId, email, roles));
        } catch (JwtException | IllegalArgumentException e) {
            return Optional.empty();
        }
    }

    public record AccessTokenClaims(UUID userId, String email, List<String> roles) {
    }
}
