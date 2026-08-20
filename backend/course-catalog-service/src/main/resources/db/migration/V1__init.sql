CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE courses (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id   UUID NOT NULL,
    tenant_id    UUID,
    title        TEXT NOT NULL,
    description  TEXT NOT NULL DEFAULT '',
    grade_label  TEXT NOT NULL DEFAULT '',
    provider     TEXT NOT NULL DEFAULT '',
    status       TEXT NOT NULL DEFAULT 'DRAFT',
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_courses_teacher_id ON courses(teacher_id);
CREATE INDEX idx_courses_status ON courses(status);

CREATE TABLE lessons (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id    UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title        TEXT NOT NULL,
    content_type TEXT NOT NULL,
    text_content TEXT,
    media_url    TEXT,
    sort_order   INT NOT NULL DEFAULT 0,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_lessons_course_id ON lessons(course_id);

-- Mirrors identity-service's audit_log — see the comment there on why this
-- lives per-service for now instead of a shared Audit & Compliance service.
CREATE TABLE audit_log (
    id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    occurred_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    actor_id     UUID,
    tenant_id    UUID,
    action       TEXT NOT NULL,
    resource     TEXT NOT NULL,
    metadata     JSONB
);
CREATE INDEX idx_audit_log_actor_id ON audit_log(actor_id);
