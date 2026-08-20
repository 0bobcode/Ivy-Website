package ai.ivyschool.catalog.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.NestedConfigurationProperty;

@ConfigurationProperties(prefix = "app")
public record AppProperties(
        @NestedConfigurationProperty Jwt jwt,
        @NestedConfigurationProperty Media media,
        @NestedConfigurationProperty Identity identity) {

    public record Jwt(String signingKey) {
    }

    public record Media(String uploadDir, String baseUrl) {
    }

    public record Identity(String baseUrl) {
    }
}
