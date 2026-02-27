-- Approval status table (1:1 with student)

CREATE TABLE IF NOT EXISTS approval_status (
  approval_id UUID PRIMARY KEY,
  student_id UUID NOT NULL,
  vpaa_approved BOOLEAN NOT NULL DEFAULT FALSE,
  vpaa_approved_at TIMESTAMPTZ,
  final_approved BOOLEAN NOT NULL DEFAULT FALSE,
  final_approved_at TIMESTAMPTZ,
  approval_status approval_status_enum NOT NULL,
  remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_approval_status_student
    FOREIGN KEY (student_id)
    REFERENCES student(student_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT uq_approval_status_student UNIQUE (student_id),
  CHECK (
    (vpaa_approved = FALSE AND vpaa_approved_at IS NULL)
    OR (vpaa_approved = TRUE AND vpaa_approved_at IS NOT NULL)
  ),
  CHECK (
    (final_approved = FALSE AND final_approved_at IS NULL)
    OR (final_approved = TRUE AND final_approved_at IS NOT NULL)
  )
);

