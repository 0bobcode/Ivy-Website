package ai.ivyschool.catalog.repository;

import ai.ivyschool.catalog.domain.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface LessonRepository extends JpaRepository<Lesson, UUID> {
}
