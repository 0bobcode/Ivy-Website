package ai.ivyschool.identity.exception;

import org.springframework.http.HttpStatus;

public class ApiException extends RuntimeException {

    private final HttpStatus status;
    private final String code;

    public ApiException(HttpStatus status, String code, String message) {
        super(message);
        this.status = status;
        this.code = code;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public String getCode() {
        return code;
    }

    public static ApiException emailAlreadyRegistered() {
        return new ApiException(HttpStatus.CONFLICT, "EMAIL_ALREADY_REGISTERED",
                "An account with this email already exists.");
    }

    public static ApiException breachedPassword() {
        return new ApiException(HttpStatus.BAD_REQUEST, "PASSWORD_BREACHED",
                "This password has appeared in a known data breach. Please choose another.");
    }

    public static ApiException captchaFailed() {
        return new ApiException(HttpStatus.BAD_REQUEST, "CAPTCHA_FAILED", "CAPTCHA verification failed.");
    }

    public static ApiException invalidCredentials() {
        return new ApiException(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS", "Invalid email or password.");
    }

    public static ApiException mfaCodeRequired() {
        return new ApiException(HttpStatus.UNAUTHORIZED, "MFA_CODE_REQUIRED",
                "A valid MFA code is required to complete login.");
    }

    public static ApiException invalidMfaCode() {
        return new ApiException(HttpStatus.UNAUTHORIZED, "INVALID_MFA_CODE", "The MFA code is invalid or expired.");
    }

    public static ApiException mfaAlreadyEnabled() {
        return new ApiException(HttpStatus.CONFLICT, "MFA_ALREADY_ENABLED", "MFA is already enabled for this account.");
    }

    public static ApiException mfaNotEnrolled() {
        return new ApiException(HttpStatus.BAD_REQUEST, "MFA_NOT_ENROLLED", "No pending MFA enrollment found.");
    }

    public static ApiException invalidOrExpiredToken(String what) {
        return new ApiException(HttpStatus.UNAUTHORIZED, "INVALID_OR_EXPIRED_TOKEN",
                "This " + what + " is invalid or has expired.");
    }

    public static ApiException accountSuspended() {
        return new ApiException(HttpStatus.FORBIDDEN, "ACCOUNT_SUSPENDED", "This account is suspended.");
    }

    public static ApiException tenantNotFound() {
        return new ApiException(HttpStatus.NOT_FOUND, "TENANT_NOT_FOUND", "School not found.");
    }

    public static ApiException userNotInTenant() {
        return new ApiException(HttpStatus.NOT_FOUND, "USER_NOT_IN_TENANT", "That user is not a member of this school.");
    }

    public static ApiException studentNotFound() {
        return new ApiException(HttpStatus.NOT_FOUND, "STUDENT_NOT_FOUND",
                "No student account found with that email.");
    }

    public static ApiException guardianLinkNotFound() {
        return new ApiException(HttpStatus.NOT_FOUND, "GUARDIAN_LINK_NOT_FOUND", "Guardian link not found.");
    }

    public static ApiException notLinkOwner() {
        return new ApiException(HttpStatus.FORBIDDEN, "NOT_LINK_OWNER", "This guardian link does not belong to you.");
    }
}
