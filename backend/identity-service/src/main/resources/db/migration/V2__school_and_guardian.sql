-- SAD-01: school profile/branding fields on the tenant a school admin manages.
ALTER TABLE tenants
    ADD COLUMN logo_url   TEXT,
    ADD COLUMN description TEXT;

-- PAR-01/PAR-02: parent<->student linking with an explicit COPPA-style consent
-- step. Every link starts unconfirmed; a parent must actively grant consent
-- before it counts as active. No birthdate field exists yet in Phase 1, so
-- every minor is treated conservatively as consent-required rather than
-- branching on an actual age check — revisit once DOB collection ships.
CREATE TABLE guardian_links (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    student_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status            TEXT NOT NULL DEFAULT 'PENDING_CONSENT',
    requested_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    consent_given_at  TIMESTAMPTZ,
    UNIQUE (parent_id, student_id)
);
CREATE INDEX idx_guardian_links_parent_id ON guardian_links(parent_id);
CREATE INDEX idx_guardian_links_student_id ON guardian_links(student_id);
