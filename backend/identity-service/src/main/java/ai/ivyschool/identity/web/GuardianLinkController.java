package ai.ivyschool.identity.web;

import ai.ivyschool.identity.service.GuardianLinkService;
import ai.ivyschool.identity.web.dto.GuardianLinkDtos.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/** PAR-01 (link) / PAR-02 (consent) — parent-only, own links only. */
@RestController
@RequestMapping("/api/v1/guardian-links")
@PreAuthorize("hasRole('PARENT')")
public class GuardianLinkController {

    private final GuardianLinkService guardianLinkService;

    public GuardianLinkController(GuardianLinkService guardianLinkService) {
        this.guardianLinkService = guardianLinkService;
    }

    @GetMapping("/mine")
    public List<GuardianLinkSummary> mine(Authentication authentication) {
        return guardianLinkService.mine(userId(authentication)).stream().map(GuardianLinkSummary::from).toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public GuardianLinkSummary link(Authentication authentication, @Valid @RequestBody LinkChildRequest request) {
        return GuardianLinkSummary.from(guardianLinkService.requestLink(userId(authentication), request.studentEmail()));
    }

    @PostMapping("/{id}/consent")
    public GuardianLinkSummary grantConsent(@PathVariable UUID id, Authentication authentication) {
        return GuardianLinkSummary.from(guardianLinkService.grantConsent(userId(authentication), id));
    }

    @PostMapping("/{id}/revoke")
    public GuardianLinkSummary revoke(@PathVariable UUID id, Authentication authentication) {
        return GuardianLinkSummary.from(guardianLinkService.revokeConsent(userId(authentication), id));
    }

    private UUID userId(Authentication authentication) {
        return (UUID) authentication.getPrincipal();
    }
}
