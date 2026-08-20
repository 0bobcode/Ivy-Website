package ai.ivyschool.catalog.service;

import ai.ivyschool.catalog.config.AppProperties;
import ai.ivyschool.catalog.exception.ApiException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

/**
 * Local-disk stand-in for S3 + CloudFront (ARCHITECTURE.md §6). Every lesson
 * media URL this returns is a plain HTTP path served straight off this
 * service's disk — swapping in real pre-signed S3 upload/playback later only
 * touches this class, not any caller.
 */
@Service
public class MediaStorage {

    private final Path uploadDir;
    private final String baseUrl;

    public MediaStorage(AppProperties properties) throws IOException {
        this.uploadDir = Path.of(properties.media().uploadDir()).toAbsolutePath().normalize();
        this.baseUrl = properties.media().baseUrl();
        Files.createDirectories(uploadDir);
    }

    public String store(MultipartFile file) {
        if (file.isEmpty()) {
            throw ApiException.emptyUpload();
        }
        String extension = "";
        String original = file.getOriginalFilename();
        if (original != null && original.contains(".")) {
            extension = original.substring(original.lastIndexOf('.'));
        }
        String filename = UUID.randomUUID() + extension;
        try {
            Files.copy(file.getInputStream(), uploadDir.resolve(filename), StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new IllegalStateException("Failed to store upload", e);
        }
        return baseUrl + "/" + filename;
    }

    public Path resolve(String filename) {
        return uploadDir.resolve(filename).normalize();
    }

    public Path root() {
        return uploadDir;
    }
}
