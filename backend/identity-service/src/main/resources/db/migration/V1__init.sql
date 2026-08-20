CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE tenants (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       TEXT NOT NULL,
    status     TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Emails are lower-cased by the application before every write/lookup (see
-- User entity); the functional unique index below enforces case-insensitive
-- uniqueness at the DB layer too, without depending on the citext extension.
CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email         TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    status        TEXT NOT NULL DEFAULT 'active',
    mfa_enabled   BOOLEAN NOT NULL DEFAULT false,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX idx_users_email_lower ON users (lower(email));

CREATE TABLE mfa_factors (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    factor_type      TEXT NOT NULL,
    secret_encrypted BYTEA NOT NULL,
    verified_at      TIMESTAMPTZ,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_mfa_factors_user_id ON mfa_factors(user_id);

CREATE TABLE roles (
    id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL
);

INSERT INTO roles (name) VALUES
    ('ADMIN'), ('STUDENT'), ('TEACHER'), ('SCHOOL_ADMIN'), ('PARENT'),
    ('COURSE_PROVIDER'), ('SALES'), ('MARKETING'), ('SCHOOL_STAFF');

-- tenant_id is NULL for platform-wide roles (e.g. Admin), so it can't be part of a
-- PRIMARY KEY (SQL forbids NULLs there). A surrogate id + a NULLS-NOT-DISTINCT unique
-- constraint gives the same "one binding per user/role/tenant" guarantee instead.
CREATE TABLE role_bindings (
    id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id   UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    UNIQUE NULLS NOT DISTINCT (user_id, role_id, tenant_id)
);
CREATE INDEX idx_role_bindings_user_id ON role_bindings(user_id);

CREATE TABLE refresh_tokens (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);

CREATE TABLE password_reset_tokens (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at    TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);

-- Append-only audit trail for auth-sensitive actions (ADM-07). A platform-wide
-- Audit & Compliance service can absorb this table later; scoping it here for
-- Phase 1 avoids standing up a whole extra service before there's a second
-- consumer of audit events.
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
CREATE INDEX idx_audit_log_occurred_at ON audit_log(occurred_at);
