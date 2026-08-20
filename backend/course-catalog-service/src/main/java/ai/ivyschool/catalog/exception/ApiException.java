package ai.ivyschool.catalog.exception;

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

    public static ApiException courseNotFound() {
        return new ApiException(HttpStatus.NOT_FOUND, "COURSE_NOT_FOUND", "Course not found.");
    }

    public static ApiException notCourseOwner() {
        return new ApiException(HttpStatus.FORBIDDEN, "NOT_COURSE_OWNER",
                "Only the teacher who owns this course can do that.");
    }

    public static ApiException coursePublishedElsewhere() {
        return new ApiException(HttpStatus.NOT_FOUND, "COURSE_NOT_FOUND", "Course not found.");
    }

    public static ApiException emptyUpload() {
        return new ApiException(HttpStatus.BAD_REQUEST, "EMPTY_UPLOAD", "The uploaded file is empty.");
    }
}
