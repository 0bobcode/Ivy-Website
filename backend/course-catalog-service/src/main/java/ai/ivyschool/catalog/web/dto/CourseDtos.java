package ai.ivyschool.catalog.web.dto;

import ai.ivyschool.catalog.domain.Course;
import ai.ivyschool.catalog.domain.CourseStatus;
import ai.ivyschool.catalog.domain.Lesson;
import ai.ivyschool.catalog.domain.LessonContentType;
import jakarta.validation.constraints.NotBlank;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public final class CourseDtos {

    private CourseDtos() {
    }

    public record CreateCourseRequest(
            @NotBlank String title,
            String description,
            String gradeLabel,
            String provider,
            String imageUrl,
            Integer seatsLeft,
            List<String> features) {
    }

    public record UpdateCourseRequest(
            @NotBlank String title,
            String description,
            String gradeLabel,
            String provider,
            String imageUrl,
            Integer seatsLeft,
            List<String> features) {
    }

    public record CreateLessonRequest(
            @NotBlank String title,
            @NotBlank String contentType,
            String textContent) {
    }

    public record CourseSummary(
            UUID id, String title, String description, String gradeLabel,
            String provider, CourseStatus status, int lessonCount, Instant createdAt,
            String imageUrl, Integer seatsLeft, List<String> features) {

        public static CourseSummary from(Course c) {
            return new CourseSummary(c.getId(), c.getTitle(), c.getDescription(), c.getGradeLabel(),
                    c.getProvider(), c.getStatus(), c.getLessons().size(), c.getCreatedAt(),
                    c.getImageUrl(), c.getSeatsLeft(), c.getFeatures());
        }
    }

    public record RosterEntry(UUID studentId, String email, Instant enrolledAt) {
    }

    public record LessonSummary(UUID id, String title, LessonContentType contentType, String textContent,
                                  String mediaUrl, int sortOrder) {
        public static LessonSummary from(Lesson l) {
            return new LessonSummary(l.getId(), l.getTitle(), l.getContentType(), l.getTextContent(),
                    l.getMediaUrl(), l.getSortOrder());
        }
    }

    public record CourseDetail(
            UUID id, UUID teacherId, String title, String description, String gradeLabel,
            String provider, CourseStatus status, List<LessonSummary> lessons, Instant createdAt,
            String imageUrl, Integer seatsLeft, List<String> features) {

        public static CourseDetail from(Course c) {
            return new CourseDetail(c.getId(), c.getTeacherId(), c.getTitle(), c.getDescription(),
                    c.getGradeLabel(), c.getProvider(), c.getStatus(),
                    c.getLessons().stream().map(LessonSummary::from).toList(), c.getCreatedAt(),
                    c.getImageUrl(), c.getSeatsLeft(), c.getFeatures());
        }
    }
}
