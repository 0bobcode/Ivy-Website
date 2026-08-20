package ai.ivyschool.identity.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.NestedConfigurationProperty;

import java.time.Duration;

@ConfigurationProperties(prefix = "app")
public record AppProperties(
        @NestedConfigurationProperty Jwt jwt,
        @NestedConfigurationProperty Encryption encryption,
        @NestedConfigurationProperty Captcha captcha,
        @NestedConfigurationProperty PasswordBreachCheck passwordBreachCheck) {

    public record Jwt(String signingKey, Duration accessTokenTtl, Duration refreshTokenTtl) {
    }

    public record Encryption(String masterKey) {
    }

    public record Captcha(boolean enabled, String secret) {
    }

    public record PasswordBreachCheck(boolean enabled) {
    }
}
