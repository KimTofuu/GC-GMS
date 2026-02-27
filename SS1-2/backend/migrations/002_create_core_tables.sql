-- Core tables: department, program, student, user_account

CREATE TABLE IF NOT EXISTS department (
  department_id UUID PRIMARY KEY,
  department_name VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (length(trim(department_name)) > 0)
);

CREATE TABLE IF NOT EXISTS program (
  program_id UUID PRIMARY KEY,
  department_id UUID NOT NULL,
  program_name VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (length(trim(program_name)) > 0),
  CONSTRAINT fk_program_department
    FOREIGN KEY (department_id)
    REFERENCES department(department_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS student (
  student_id UUID PRIMARY KEY,
  program_id UUID NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100),
  email VARCHAR(255) NOT NULL UNIQUE,
  student_number VARCHAR(9) NOT NULL UNIQUE,
  enrollment_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (length(trim(first_name)) > 0),
  CHECK (length(trim(last_name)) > 0),
  CHECK (student_number ~ '^[0-9]{9}$'),
  CONSTRAINT fk_student_program
    FOREIGN KEY (program_id)
    REFERENCES program(program_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS user_account (
  user_id UUID PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role user_role_enum NOT NULL,
  status account_status_enum NOT NULL DEFAULT 'INACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at TIMESTAMPTZ,
  CHECK (length(trim(username)) > 0),
  CHECK (length(password_hash) > 0)
);

