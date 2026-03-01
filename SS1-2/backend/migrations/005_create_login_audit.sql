-- Login audit table linked to user_account

CREATE TABLE IF NOT EXISTS login_audit (
  audit_id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  login_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  success BOOLEAN NOT NULL,
  ip_address VARCHAR(255),
  user_agent TEXT,
  CONSTRAINT fk_login_audit_user
    FOREIGN KEY (user_id)
    REFERENCES user_account(user_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_login_audit_user_id ON login_audit (user_id);
CREATE INDEX IF NOT EXISTS idx_login_audit_login_at ON login_audit (login_at);

