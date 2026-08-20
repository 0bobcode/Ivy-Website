package ai.ivyschool.catalog.repository;

import ai.ivyschool.catalog.domain.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EnrollmentRepository extends JpaRepository<Enrollment, UUID> {
    Optional<Enrollment> findByCourseIdAndStudentId(UUID courseId, UUID studentId);

    List<Enrollment> findByStudentIdOrderByEnrolledAtDesc(UUID studentId);

    List<Enrollment> findByCourseIdOrderByEnrolledAtAsc(UUID courseId);
}
