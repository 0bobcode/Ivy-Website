package ai.ivyschool.identity.web.dto;

import java.util.List;
import java.util.UUID;

public final class UserDtos {

    private UserDtos() {
    }

    public record MeResponse(UUID id, String email, boolean mfaEnabled, List<String> roles) {
    }

    public record UserSummary(UUID id, String email) {
    }
}
