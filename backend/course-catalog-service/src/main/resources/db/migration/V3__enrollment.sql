-- STU-04 (enroll) / TCH-03 (roster). student_id is a raw UUID, not a FK — the
-- student's User record lives in identity-service's own database, not this
-- one (database-per-service, ARCHITECTURE.md §3.2).
CREATE TABLE enrollments (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id    UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    student_id   UUID NOT NULL,
    enrolled_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (course_id, student_id)
);
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX idx_enrollments_student_id ON enrollments(student_id);
