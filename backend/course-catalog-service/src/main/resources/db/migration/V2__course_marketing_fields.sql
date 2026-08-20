-- Supports the richer course-card UI: a hero image, a scarcity/availability
-- signal, and a short feature checklist. All nullable — existing courses
-- (and any created without these fields) still work, just render sparser.
ALTER TABLE courses
    ADD COLUMN image_url  TEXT,
    ADD COLUMN seats_left INT,
    ADD COLUMN features   TEXT[] NOT NULL DEFAULT '{}';
