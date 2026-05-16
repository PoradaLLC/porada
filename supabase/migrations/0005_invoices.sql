-- Schtubbs: Invoices issued by admins, paid by customers via Stripe Checkout

CREATE TABLE invoices (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_email    TEXT NOT NULL,
  customer_name     TEXT,
  description       TEXT NOT NULL,
  amount_cents      INT  NOT NULL CHECK (amount_cents > 0),
  currency          TEXT NOT NULL DEFAULT 'usd',
  status            TEXT NOT NULL DEFAULT 'open'
                    CHECK (status IN ('open', 'paid', 'cancelled', 'expired')),
  stripe_session_id TEXT,
  paid_at           TIMESTAMPTZ,
  created_by        UUID,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_invoices_status         ON invoices(status);
CREATE INDEX idx_invoices_customer       ON invoices(customer_email);
CREATE INDEX idx_invoices_stripe_session ON invoices(stripe_session_id);

CREATE TRIGGER trg_invoices_updated BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage invoices" ON invoices
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Owner can read own invoice" ON invoices
  FOR SELECT USING (
    auth.jwt() ->> 'email' IS NOT NULL
    AND lower(auth.jwt() ->> 'email') = lower(customer_email)
  );
