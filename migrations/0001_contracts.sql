-- Ohana Events online contracts (D1 / SQLite)
CREATE TABLE contracts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  public_id TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('draft', 'sent', 'client_signed', 'completed', 'void')),
  locale TEXT NOT NULL DEFAULT 'en' CHECK (locale IN ('en', 'es')),
  legal_version INTEGER NOT NULL DEFAULT 1,
  payload_json TEXT NOT NULL,
  client_signature_data_url TEXT,
  owner_signature_data_url TEXT,
  client_signed_at INTEGER,
  owner_signed_at INTEGER,
  client_ip TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX idx_contracts_public_id ON contracts (public_id);
CREATE INDEX idx_contracts_status ON contracts (status);
CREATE INDEX idx_contracts_created_at ON contracts (created_at);
