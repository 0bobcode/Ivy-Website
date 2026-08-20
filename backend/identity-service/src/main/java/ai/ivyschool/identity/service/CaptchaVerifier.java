package ai.ivyschool.identity.service;

import ai.ivyschool.identity.config.AppProperties;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

/**
 * Verifies a reCAPTCHA token server-side (§7.1, story PLT-01) by calling Google's
 * siteverify endpoint. Disabled by default in dev/test via app.captcha.enabled — a
 * real site/secret key pair must be provisioned via Secrets Manager before this is
 * turned on in any environment that faces real traffic (§7.5).
 */
@Service
public class CaptchaVerifier {

    private static final String VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

    private final AppProperties properties;
    private final RestClient restClient = RestClient.create();

    public CaptchaVerifier(AppProperties properties) {
        this.properties = properties;
    }

    public boolean verify(String captchaToken) {
        if (!properties.captcha().enabled()) {
            return true;
        }
        if (captchaToken == null || captchaToken.isBlank()) {
            return false;
        }
        try {
            MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
            form.add("secret", properties.captcha().secret());
            form.add("response", captchaToken);
            CaptchaResponse response = restClient.post()
                    .uri(VERIFY_URL)
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(form)
                    .retrieve()
                    .body(CaptchaResponse.class);
            return response != null && response.success();
        } catch (Exception e) {
            return false;
        }
    }

    private record CaptchaResponse(boolean success) {
    }
}
