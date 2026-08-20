package ai.ivyschool.catalog.web;

import ai.ivyschool.catalog.domain.Course;
import ai.ivyschool.catalog.exception.ApiException;
import ai.ivyschool.catalog.service.CourseService;
import ai.ivyschool.catalog.web.dto.CourseDtos.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    /** Public catalog browsing — story STU-01 / GST-01. No auth required. */
    @GetMapping
    public List<CourseSummary> browse(@RequestParam(required = false) String grade,
                                       @RequestParam(required = false) String provider) {
        return courseService.browsePublished(grade, provider).stream().map(CourseSummary::from).toList();
    }

    /** Teacher's own courses, any status — powers the "My Courses" authoring view. */
    @GetMapping("/mine")
    @PreAuthorize("hasRole('TEACHER')")
    public List<CourseSummary> mine(Authentication authentication) {
        return courseService.myCourses(userId(authentication)).stream().map(CourseSummary::from).toList();
    }

    /** Admin oversight (ADM-05) — every course, any owner, any status. */
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<CourseSummary> all() {
        return courseService.all().stream().map(CourseSummary::from).toList();
    }

    @GetMapping("/{id}")
    public CourseDetail view(@PathVariable UUID id, Authentication authentication) {
        return CourseDetail.from(courseService.view(id, optionalUserId(authentication)));
    }

    @PostMapping
    @PreAuthorize("hasRole('TEACHER')")
    @ResponseStatus(HttpStatus.CREATED)
    public CourseDetail create(Authentication authentication, @Valid @RequestBody CreateCourseRequest request) {
        Course course = courseService.create(userId(authentication), request);
        return CourseDetail.from(course);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('TEACHER')")
    public CourseDetail update(@PathVariable UUID id, Authentication authentication,
                                @Valid @RequestBody UpdateCourseRequest request) {
        return CourseDetail.from(courseService.update(id, userId(authentication), request));
    }

    @PostMapping("/{id}/publish")
    @PreAuthorize("hasRole('TEACHER')")
    public CourseDetail publish(@PathVariable UUID id, Authentication authentication) {
        return CourseDetail.from(courseService.publish(id, userId(authentication)));
    }

    @PostMapping("/{id}/unpublish")
    @PreAuthorize("hasRole('TEACHER')")
    public CourseDetail unpublish(@PathVariable UUID id, Authentication authentication) {
        return CourseDetail.from(courseService.unpublish(id, userId(authentication)));
    }

    @PostMapping("/{id}/lessons")
    @PreAuthorize("hasRole('TEACHER')")
    @ResponseStatus(HttpStatus.CREATED)
    public LessonSummary addTextLesson(@PathVariable UUID id, Authentication authentication,
                                        @Valid @RequestBody CreateLessonRequest request) {
        if (!"TEXT".equalsIgnoreCase(request.contentType())) {
            throw new ApiException(org.springframework.http.HttpStatus.BAD_REQUEST, "USE_UPLOAD_ENDPOINT",
                    "Video/file lessons are added via /lessons/upload, not this endpoint.");
        }
        return LessonSummary.from(
                courseService.addTextLesson(id, userId(authentication), request.title(), request.textContent()));
    }

    @PostMapping(path = "/{id}/lessons/upload", consumes = "multipart/form-data")
    @PreAuthorize("hasRole('TEACHER')")
    @ResponseStatus(HttpStatus.CREATED)
    public LessonSummary addMediaLesson(@PathVariable UUID id, Authentication authentication,
                                         @RequestParam String title, @RequestParam MultipartFile file) {
        return LessonSummary.from(courseService.addMediaLesson(id, userId(authentication), title, file));
    }

    /** STU-04 — one-click enroll (free/trial only; payment gating is Sprint 4). */
    @PostMapping("/{id}/enroll")
    @PreAuthorize("hasRole('STUDENT')")
    public java.util.Map<String, Object> enroll(@PathVariable UUID id, Authentication authentication) {
        var enrollment = courseService.enroll(id, userId(authentication));
        return java.util.Map.of("courseId", id, "enrolledAt", enrollment.getEnrolledAt());
    }

    /** A student's own enrolled courses — proves STU-04 end-to-end and backs "My Courses". */
    @GetMapping("/enrolled/mine")
    @PreAuthorize("hasRole('STUDENT')")
    public List<CourseSummary> myEnrollments(Authentication authentication) {
        return courseService.myEnrolledCourses(userId(authentication)).stream().map(CourseSummary::from).toList();
    }

    /** TCH-03 — roster scoped to a course this teacher owns. */
    @GetMapping("/{id}/roster")
    @PreAuthorize("hasRole('TEACHER')")
    public List<RosterEntry> roster(@PathVariable UUID id, Authentication authentication,
                                     @RequestHeader("Authorization") String authorizationHeader) {
        String bearerToken = authorizationHeader.replaceFirst("(?i)^Bearer\\s+", "");
        return courseService.roster(id, userId(authentication), bearerToken);
    }

    private UUID userId(Authentication authentication) {
        return (UUID) authentication.getPrincipal();
    }

    /** Anonymous requests carry a String "anonymousUser" principal, not our UUID. */
    private UUID optionalUserId(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof UUID id)) {
            return null;
        }
        return id;
    }
}
