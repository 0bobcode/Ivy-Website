package ai.ivyschool.catalog.service;

import ai.ivyschool.catalog.config.AppProperties;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Resolves student emails for a teacher's roster (TCH-03) by calling
 * identity-service's batch summary endpoint, forwarding the caller's own
 * bearer token — no shared DB access across services (ARCHITECTURE.md §3.2).
 */
@Service
public class IdentityClient {

    private final RestClient restClient;

    public IdentityClient(AppProperties properties) {
        this.restClient = RestClient.builder().baseUrl(properties.identity().baseUrl()).build();
    }

    public Map<UUID, String> resolveEmails(List<UUID> userIds, String bearerToken) {
        if (userIds.isEmpty()) {
            return Map.of();
        }
        String idsParam = userIds.stream().map(UUID::toString).collect(Collectors.joining(","));
        try {
            UserSummary[] results = restClient.get()
                    .uri(uriBuilder -> uriBuilder.path("/api/v1/users/summary").queryParam("ids", idsParam).build())
                    .header("Authorization", "Bearer " + bearerToken)
                    .retrieve()
                    .body(UserSummary[].class);
            return results == null ? Map.of()
                    : java.util.Arrays.stream(results).collect(Collectors.toMap(UserSummary::id, UserSummary::email));
        } catch (Exception e) {
            // Roster should still render (with ids instead of emails) if identity-service
            // is briefly unreachable, rather than failing the whole request.
            return Map.of();
        }
    }

    private record UserSummary(UUID id, String email) {
    }
}
