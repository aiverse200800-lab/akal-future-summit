CREATE TABLE IF NOT EXISTS registrations (
  id TEXT PRIMARY KEY,
  student_name TEXT NOT NULL,
  school_name TEXT NOT NULL,
  grade TEXT NOT NULL,
  city TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  school_board TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  accompanied INTEGER NOT NULL DEFAULT 0,
  consent INTEGER NOT NULL DEFAULT 0,
  payment_proof_path TEXT,
  proof_status TEXT NOT NULL DEFAULT 'none',
  registration_ref TEXT UNIQUE,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_ref ON registrations(registration_ref);
