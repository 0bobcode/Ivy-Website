package ai.ivyschool.identity.web;

import ai.ivyschool.identity.service.AuthService;
import ai.ivyschool.identity.service.PasswordResetService;
import ai.ivyschool.identity.web.dto.AuthDtos.LoginRequest;
import ai.ivyschool.identity.web.dto.AuthDtos.PasswordResetCompleteRequest;
import ai.ivyschool.identity.web.dto.AuthDtos.PasswordResetRequest;
import ai.ivyschool.identity.web.dto.AuthDtos.RefreshRequest;
import ai.ivyschool.identity.web.dto.AuthDtos.SignupRequest;
import ai.ivyschool.identity.web.dto.AuthDtos.TokenResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;
    private final PasswordResetService passwordResetService;

    // Dev-only: the Messaging & Notification service that would email this
    // link doesn't exist yet (ARCHITECTURE.md §3.2), so with this flag on the
    // raw token rides along in the response instead of vanishing into a void.
    // MUST be false (the default) anywhere real traffic can reach this API —
    // it defeats the "never reveal account existence" guarantee otherwise.
    @Value("${app.password-reset.expose-token-in-response:false}")
    private boolean exposeResetTokenInResponse;

    public AuthController(AuthService authService, PasswordResetService passwordResetService) {
        this.authService = authService;
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public void signup(@Valid @RequestBody SignupRequest request) {
        authService.signup(request);
    }

    @PostMapping("/login")
    public TokenResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/refresh")
    public TokenResponse refresh(@Valid @RequestBody RefreshRequest request) {
        return authService.refresh(request.refreshToken());
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(@Valid @RequestBody RefreshRequest request) {
        authService.logout(request.refreshToken());
    }

    @PostMapping("/password-reset/request")
    public ResponseEntity<?> requestPasswordReset(@Valid @RequestBody PasswordResetRequest request) {
        var rawToken = passwordResetService.requestReset(request.email());
        if (exposeResetTokenInResponse) {
            return ResponseEntity.accepted().body(Map.of("devResetToken", rawToken.orElse("")));
        }
        // Production path: response is identical whether or not the email
        // exists, so this endpoint can't be used to enumerate accounts.
        return ResponseEntity.accepted().build();
    }

    @PostMapping("/password-reset/complete")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void completePasswordReset(@Valid @RequestBody PasswordResetCompleteRequest request) {
        passwordResetService.completeReset(request.token(), request.newPassword());
    }
}
