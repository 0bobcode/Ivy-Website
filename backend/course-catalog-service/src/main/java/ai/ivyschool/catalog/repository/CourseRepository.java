package ai.ivyschool.catalog.repository;

import ai.ivyschool.catalog.domain.Course;
import ai.ivyschool.catalog.domain.CourseStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CourseRepository extends JpaRepository<Course, UUID> {
    List<Course> findByStatusOrderByCreatedAtDesc(CourseStatus status);

    List<Course> findByTeacherIdOrderByCreatedAtDesc(UUID teacherId);
}
