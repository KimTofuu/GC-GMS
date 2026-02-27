--- Student lookup by email and student_number
CREATE INDEX IF NOT EXISTS idx_student_email ON student (email);
CREATE INDEX IF NOT EXISTS idx_student_student_number ON student (student_number);

-- Approval status by status value
CREATE INDEX IF NOT EXISTS idx_approval_status_status ON approval_status (approval_status);

-- Award lookup by program and name
CREATE INDEX IF NOT EXISTS idx_award_program_id ON award (program_id);

