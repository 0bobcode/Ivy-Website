package ai.ivyschool.identity.web.dto;

import ai.ivyschool.identity.domain.Tenant;
import jakarta.validation.constraints.NotBlank;

import java.time.Instant;
import java.util.UUID;

public final class TenantDtos {

    private TenantDtos() {
    }

    public record CreateTenantRequest(@NotBlank String name) {
    }

    public record UpdateTenantRequest(@NotBlank String name, String logoUrl, String description) {
    }

    public record InviteTeacherRequest(@NotBlank String email) {
    }

    public record InviteTeacherResponse(UUID userId, String email, boolean newAccount, String devResetToken) {
    }

    public record TenantMemberSummary(UUID userId, String email, String status, java.util.List<String> roles) {
    }

    public record UpdateMemberStatusRequest(@NotBlank String status) {
    }

    public record TenantSummary(UUID id, String name, String status, String logoUrl, String description,
                                 Instant createdAt) {
        public static TenantSummary from(Tenant t) {
            return new TenantSummary(t.getId(), t.getName(), t.getStatus(), t.getLogoUrl(), t.getDescription(),
                    t.getCreatedAt());
        }
    }
}
