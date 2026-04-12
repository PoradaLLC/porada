-- Schtubbs: Lead Queue

CREATE TABLE leads (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name   TEXT NOT NULL,
  contact_email   TEXT,
  phone           TEXT,
  current_website TEXT,
  summary         TEXT NOT NULL,
  status          TEXT DEFAULT 'new' CHECK (status IN ('new', 'pitched', 'converted', 'dismissed')),
  pitch_email     TEXT,
  pitched_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created ON leads(created_at);

CREATE TRIGGER trg_leads_updated BEFORE UPDATE ON leads
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage leads" ON leads FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');
