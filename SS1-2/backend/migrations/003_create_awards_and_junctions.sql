-- Award-related tables: award and student_award

CREATE TABLE IF NOT EXISTS award (
  award_id UUID PRIMARY KEY,
  program_id UUID NOT NULL,
  award_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (length(trim(award_name)) > 0),
  CONSTRAINT fk_award_program
    FOREIGN KEY (program_id)
    REFERENCES program(program_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT uq_award_program_name UNIQUE (program_id, award_name)
);

CREATE TABLE IF NOT EXISTS student_award (
  student_award_id UUID PRIMARY KEY,
  student_id UUID NOT NULL,
  award_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_student_award_student
    FOREIGN KEY (student_id)
    REFERENCES student(student_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_student_award_award
    FOREIGN KEY (award_id)
    REFERENCES award(award_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT uq_student_award UNIQUE (student_id, award_id)
);

