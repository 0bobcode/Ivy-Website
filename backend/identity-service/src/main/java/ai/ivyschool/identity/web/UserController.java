package ai.ivyschool.identity.web;

import ai.ivyschool.identity.domain.User;
import ai.ivyschool.identity.exception.ApiException;
import ai.ivyschool.identity.repository.RoleBindingRepository;
import ai.ivyschool.identity.repository.UserRepository;
import ai.ivyschool.identity.web.dto.UserDtos.MeResponse;
import ai.ivyschool.identity.web.dto.UserDtos.UserSummary;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserRepository userRepository;
    private final RoleBindingRepository roleBindingRepository;

    public UserController(UserRepository userRepository, RoleBindingRepository roleBindingRepository) {
        this.userRepository = userRepository;
        this.roleBindingRepository = roleBindingRepository;
    }

    @GetMapping("/me")
    public MeResponse me(Authentication authentication) {
        UUID userId = (UUID) authentication.getPrincipal();
        User user = userRepository.findById(userId).orElseThrow(ApiException::invalidCredentials);
        var roles = roleBindingRepository.findByUser(user).stream()
                .map(binding -> binding.getRole().getName())
                .distinct()
                .toList();
        return new MeResponse(user.getId(), user.getEmail(), user.isMfaEnabled(), roles);
    }

    /**
     * Minimal cross-service lookup so course-catalog-service can resolve
     * student emails for a teacher's roster (TCH-03) without a shared DB.
     * Any authenticated caller may resolve ids to email — no other PII exposed.
     */
    @GetMapping("/summary")
    public List<UserSummary> summary(@RequestParam List<UUID> ids) {
        return userRepository.findAllById(ids).stream()
                .map(u -> new UserSummary(u.getId(), u.getEmail()))
                .toList();
    }
}
