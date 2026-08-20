package ai.ivyschool.catalog.domain;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

/** Backs STU-04 (enroll) and TCH-03 (roster). Payment gating is Sprint 4 —
 *  every enrollment created in Phase 1 Sprint 3 is treated as free/trial. */
@Entity
@Table(name = "enrollments")
public class Enrollment {

    @Id
    @GeneratedValue
    private UUID id;

    // Eager for the same reason as Course.lessons: DTO mapping happens outside
    // the service's transaction (open-in-view is off), so lazy here throws
    // LazyInitializationException on every read.
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(name = "student_id", nullable = false)
    private UUID studentId;

    @Column(name = "enrolled_at", nullable = false, updatable = false)
    private Instant enrolledAt = Instant.now();

    protected Enrollment() {
    }

    public Enrollment(Course course, UUID studentId) {
        this.course = course;
        this.studentId = studentId;
    }

    public UUID getId() {
        return id;
    }

    public Course getCourse() {
        return course;
    }

    public UUID getStudentId() {
        return studentId;
    }

    public Instant getEnrolledAt() {
        return enrolledAt;
    }
}
