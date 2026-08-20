package ai.ivyschool.catalog.web;

import ai.ivyschool.catalog.service.MediaStorage;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;

/**
 * Serves locally-stored lesson media (§ MediaStorage). Stands in for
 * CloudFront + S3 signed URLs until that pipeline exists.
 */
@RestController
public class MediaController {

    private final MediaStorage mediaStorage;

    public MediaController(MediaStorage mediaStorage) {
        this.mediaStorage = mediaStorage;
    }

    @GetMapping("/media/{filename}")
    public ResponseEntity<Resource> serve(@PathVariable String filename) throws MalformedURLException {
        Path path = mediaStorage.resolve(filename);
        if (!path.startsWith(mediaStorage.root()) || !Files.isRegularFile(path)) {
            return ResponseEntity.notFound().build();
        }
        Resource resource = new UrlResource(path.toUri());
        String contentType = probeContentType(path);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, contentType)
                .header(HttpHeaders.CACHE_CONTROL, "public, max-age=3600")
                .body(resource);
    }

    private String probeContentType(Path path) {
        try {
            String type = Files.probeContentType(path);
            return type != null ? type : "application/octet-stream";
        } catch (Exception e) {
            return "application/octet-stream";
        }
    }
}
