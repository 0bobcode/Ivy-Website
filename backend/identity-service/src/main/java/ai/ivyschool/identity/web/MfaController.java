package ai.ivyschool.identity.web;

import ai.ivyschool.identity.service.MfaService;
import ai.ivyschool.identity.web.dto.AuthDtos.MfaEnrollResponse;
import ai.ivyschool.identity.web.dto.AuthDtos.MfaVerifyRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth/mfa")
public class MfaController {

    private final MfaService mfaService;

    public MfaController(MfaService mfaService) {
        this.mfaService = mfaService;
    }

    @PostMapping("/enroll")
    public MfaEnrollResponse startEnrollment(Authentication authentication) {
        return mfaService.startEnrollment(currentUserId(authentication));
    }

    @PostMapping("/confirm")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void confirmEnrollment(Authentication authentication, @Valid @RequestBody MfaVerifyRequest request) {
        mfaService.confirmEnrollment(currentUserId(authentication), request.code());
    }

    private UUID currentUserId(Authentication authentication) {
        return (UUID) authentication.getPrincipal();
    }
}
