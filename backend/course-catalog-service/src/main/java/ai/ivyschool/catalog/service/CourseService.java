package ai.ivyschool.catalog.service;

import ai.ivyschool.catalog.domain.Course;
import ai.ivyschool.catalog.domain.CourseStatus;
import ai.ivyschool.catalog.domain.Enrollment;
import ai.ivyschool.catalog.domain.Lesson;
import ai.ivyschool.catalog.domain.LessonContentType;
import ai.ivyschool.catalog.exception.ApiException;
import ai.ivyschool.catalog.repository.CourseRepository;
import ai.ivyschool.catalog.repository.EnrollmentRepository;
import ai.ivyschool.catalog.web.dto.CourseDtos.CreateCourseRequest;
import ai.ivyschool.catalog.web.dto.CourseDtos.RosterEntry;
import ai.ivyschool.catalog.web.dto.CourseDtos.UpdateCourseRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

/** Backs stories STU-01/GST-01 (browse), TCH-01 (author), TCH-02 (publish). */
@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final MediaStorage mediaStorage;
    private final AuditService auditService;
    private final IdentityClient identityClient;

    public CourseService(CourseRepository courseRepository, EnrollmentRepository enrollmentRepository,
                          MediaStorage mediaStorage, AuditService auditService, IdentityClient identityClient) {
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.mediaStorage = mediaStorage;
        this.auditService = auditService;
        this.identityClient = identityClient;
    }

    @Transactional(readOnly = true)
    public List<Course> browsePublished(String grade, String provider) {
        return courseRepository.findByStatusOrderByCreatedAtDesc(CourseStatus.PUBLISHED).stream()
                .filter(c -> grade == null || grade.isBlank() || c.getGradeLabel().equalsIgnoreCase(grade))
                .filter(c -> provider == null || provider.isBlank() || c.getProvider().equalsIgnoreCase(provider))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<Course> myCourses(UUID teacherId) {
        return courseRepository.findByTeacherIdOrderByCreatedAtDesc(teacherId);
    }

    /** Admin oversight view (ADM-05) — every course regardless of owner or status. */
    @Transactional(readOnly = true)
    public List<Course> all() {
        return courseRepository.findAll();
    }

    /** Published courses are visible to anyone; drafts only to their owning teacher. */
    @Transactional(readOnly = true)
    public Course view(UUID courseId, UUID viewerId) {
        Course course = courseRepository.findById(courseId).orElseThrow(ApiException::courseNotFound);
        if (course.getStatus() != CourseStatus.PUBLISHED && !course.isOwnedBy(viewerId)) {
            throw ApiException.courseNotFound();
        }
        return course;
    }

    @Transactional
    public Course create(UUID teacherId, CreateCourseRequest request) {
        Course course = new Course(teacherId, request.title());
        applyMetadata(course, request.description(), request.gradeLabel(), request.provider(),
                request.imageUrl(), request.seatsLeft(), request.features());
        courseRepository.save(course);
        auditService.record(teacherId, null, "COURSE_CREATED", "course:" + course.getId());
        return course;
    }

    @Transactional
    public Course update(UUID courseId, UUID teacherId, UpdateCourseRequest request) {
        Course course = ownedCourse(courseId, teacherId);
        course.setTitle(request.title());
        applyMetadata(course, request.description(), request.gradeLabel(), request.provider(),
                request.imageUrl(), request.seatsLeft(), request.features());
        return course;
    }

    @Transactional
    public Course publish(UUID courseId, UUID teacherId) {
        Course course = ownedCourse(courseId, teacherId);
        course.publish();
        auditService.record(teacherId, null, "COURSE_PUBLISHED", "course:" + course.getId());
        return course;
    }

    @Transactional
    public Course unpublish(UUID courseId, UUID teacherId) {
        Course course = ownedCourse(courseId, teacherId);
        course.unpublish();
        auditService.record(teacherId, null, "COURSE_UNPUBLISHED", "course:" + course.getId());
        return course;
    }

    @Transactional
    public Lesson addTextLesson(UUID courseId, UUID teacherId, String title, String textContent) {
        Course course = ownedCourse(courseId, teacherId);
        Lesson lesson = new Lesson(course, title, LessonContentType.TEXT, course.getLessons().size());
        lesson.setTextContent(textContent);
        course.getLessons().add(lesson);
        auditService.record(teacherId, null, "LESSON_ADDED", "course:" + courseId);
        return lesson;
    }

    @Transactional
    public Lesson addMediaLesson(UUID courseId, UUID teacherId, String title, MultipartFile file) {
        Course course = ownedCourse(courseId, teacherId);
        String url = mediaStorage.store(file);
        boolean isVideo = file.getContentType() != null && file.getContentType().startsWith("video");
        Lesson lesson = new Lesson(course, title, isVideo ? LessonContentType.VIDEO : LessonContentType.FILE,
                course.getLessons().size());
        lesson.setMediaUrl(url);
        course.getLessons().add(lesson);
        auditService.record(teacherId, null, "LESSON_ADDED", "course:" + courseId);
        return lesson;
    }

    /** STU-04 — one-click enroll. Payment gating is deferred to Sprint 4 (PHASE_1_PLAN.md §4). */
    @Transactional
    public Enrollment enroll(UUID courseId, UUID studentId) {
        Course course = courseRepository.findById(courseId).orElseThrow(ApiException::courseNotFound);
        if (course.getStatus() != CourseStatus.PUBLISHED) {
            throw ApiException.courseNotFound();
        }
        Enrollment existing = enrollmentRepository.findByCourseIdAndStudentId(courseId, studentId).orElse(null);
        if (existing != null) {
            return existing;
        }
        Enrollment enrollment = new Enrollment(course, studentId);
        enrollmentRepository.save(enrollment);
        auditService.record(studentId, null, "COURSE_ENROLLED", "course:" + courseId);
        return enrollment;
    }

    @Transactional(readOnly = true)
    public List<Course> myEnrolledCourses(UUID studentId) {
        return enrollmentRepository.findByStudentIdOrderByEnrolledAtDesc(studentId).stream()
                .map(Enrollment::getCourse)
                .toList();
    }

    /** TCH-03 — roster scoped to courses this teacher owns, with emails resolved from identity-service. */
    @Transactional(readOnly = true)
    public List<RosterEntry> roster(UUID courseId, UUID teacherId, String bearerToken) {
        ownedCourse(courseId, teacherId);
        List<Enrollment> enrollments = enrollmentRepository.findByCourseIdOrderByEnrolledAtAsc(courseId);
        var emails = identityClient.resolveEmails(enrollments.stream().map(Enrollment::getStudentId).toList(),
                bearerToken);
        return enrollments.stream()
                .map(e -> new RosterEntry(e.getStudentId(), emails.get(e.getStudentId()), e.getEnrolledAt()))
                .toList();
    }

    private Course ownedCourse(UUID courseId, UUID teacherId) {
        Course course = courseRepository.findById(courseId).orElseThrow(ApiException::courseNotFound);
        if (!course.isOwnedBy(teacherId)) {
            throw ApiException.notCourseOwner();
        }
        return course;
    }

    private void applyMetadata(Course course, String description, String gradeLabel, String provider,
                                String imageUrl, Integer seatsLeft, java.util.List<String> features) {
        if (description != null) course.setDescription(description);
        if (gradeLabel != null) course.setGradeLabel(gradeLabel);
        if (provider != null) course.setProvider(provider);
        if (imageUrl != null) course.setImageUrl(imageUrl);
        if (seatsLeft != null) course.setSeatsLeft(seatsLeft);
        if (features != null) course.setFeatures(features);
    }
}
