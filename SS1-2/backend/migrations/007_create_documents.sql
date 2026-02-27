-- Document-related tables for temporary checklist support

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'document_status_enum') THEN
    CREATE TYPE document_status_enum AS ENUM (
      'PENDING',
      'SUBMITTED',
      'APPROVED',
      'REJECTED'
    );
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS document_type (
  document_type_id UUID PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_required BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (length(trim(code)) > 0),
  CHECK (length(trim(name)) > 0)
);

CREATE TABLE IF NOT EXISTS student_document (
  student_document_id UUID PRIMARY KEY,
  student_id UUID NOT NULL,
  document_type_id UUID NOT NULL,
  status document_status_enum NOT NULL DEFAULT 'PENDING',
  file_url TEXT,
  submitted_at TIMESTAMPTZ,
  verified_at TIMESTAMPTZ,
  remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_student_document_student
    FOREIGN KEY (student_id)
    REFERENCES student(student_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_student_document_document_type
    FOREIGN KEY (document_type_id)
    REFERENCES document_type(document_type_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT uq_student_document UNIQUE (student_id, document_type_id)
);

-- Seed the initial required documents
-- Assumes gen_random_uuid() is available (Supabase default).

INSERT INTO document_type (document_type_id, code, name, description, is_required)
VALUES
  (gen_random_uuid(), 'BIRTH_CERT', 'Birth Certificate', 'Student birth certificate', TRUE),
  (gen_random_uuid(), 'APP_FOR_GRAD', 'Application for Graduation', 'Signed application for graduation', TRUE),
  (gen_random_uuid(), 'OVERALL_PROSPECTUS', 'Overall Prospectus', 'Official overall prospectus', TRUE)
ON CONFLICT (code) DO NOTHING;

