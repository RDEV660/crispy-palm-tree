-- Ohana Events contracts — PostgreSQL (Vercel Postgres, Neon, Supabase, etc.)
CREATE TABLE IF NOT EXISTS contracts (
  id SERIAL PRIMARY KEY,
  public_id TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('draft', 'sent', 'client_signed', 'completed', 'void')),
  locale TEXT NOT NULL DEFAULT 'en' CHECK (locale IN ('en', 'es')),
  legal_version INTEGER NOT NULL DEFAULT 1,
  payload_json TEXT NOT NULL,
  client_signature_data_url TEXT,
  owner_signature_data_url TEXT,
  client_signed_at BIGINT,
  owner_signed_at BIGINT,
  client_ip TEXT,
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_contracts_public_id ON contracts (public_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts (status);
CREATE INDEX IF NOT EXISTS idx_contracts_created_at ON contracts (created_at);
