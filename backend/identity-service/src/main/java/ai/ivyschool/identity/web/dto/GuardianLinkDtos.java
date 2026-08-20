package ai.ivyschool.identity.web.dto;

import ai.ivyschool.identity.domain.GuardianLink;
import jakarta.validation.constraints.NotBlank;

import java.time.Instant;
import java.util.UUID;

public final class GuardianLinkDtos {

    private GuardianLinkDtos() {
    }

    public record LinkChildRequest(@NotBlank String studentEmail) {
    }

    public record GuardianLinkSummary(UUID id, UUID studentId, String studentEmail, String status,
                                       Instant requestedAt, Instant consentGivenAt) {
        public static GuardianLinkSummary from(GuardianLink link) {
            return new GuardianLinkSummary(link.getId(), link.getStudent().getId(), link.getStudent().getEmail(),
                    link.getStatus().name(), link.getRequestedAt(), link.getConsentGivenAt());
        }
    }
}
