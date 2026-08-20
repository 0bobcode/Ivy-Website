package ai.ivyschool.identity.web.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class AuthDtos {

    private AuthDtos() {
    }

    public record SignupRequest(
            @NotBlank @Email String email,
            @NotBlank @Size(min = 12, message = "Password must be at least 12 characters") String password,
            String captchaToken) {
    }

    public record LoginRequest(
            @NotBlank @Email String email,
            @NotBlank String password,
            String mfaCode) {
    }

    public record RefreshRequest(@NotBlank String refreshToken) {
    }

    public record TokenResponse(String accessToken, String refreshToken, long expiresInSeconds) {
    }

    public record MfaEnrollResponse(String secret, String otpAuthUri) {
    }

    public record MfaVerifyRequest(@NotBlank String code) {
    }

    public record PasswordResetRequest(@NotBlank @Email String email) {
    }

    public record PasswordResetCompleteRequest(
            @NotBlank String token,
            @NotBlank @Size(min = 12, message = "Password must be at least 12 characters") String newPassword) {
    }
}
