-- Schtubbs: Initial Schema

-- Customers
CREATE TABLE customers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  email           TEXT UNIQUE NOT NULL,
  company         TEXT,
  phone           TEXT,
  stripe_customer_id TEXT UNIQUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_stripe ON customers(stripe_customer_id);

-- Contact Submissions
CREATE TABLE contact_submissions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT,
  subject    TEXT,
  message    TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings
CREATE TABLE bookings (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT,
  company    TEXT,
  service    TEXT NOT NULL,
  date       TEXT NOT NULL,
  time       TEXT NOT NULL,
  message    TEXT,
  status     TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_date ON bookings(date);

-- Payments
CREATE TABLE payments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id TEXT,
  customer_email    TEXT,
  amount            INT DEFAULT 0,
  description       TEXT,
  status            TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'invoiced', 'active', 'cancelled', 'failed')),
  mode              TEXT DEFAULT 'payment' CHECK (mode IN ('payment', 'subscription')),
  created_at        TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_customer ON payments(customer_email);

-- Auto-update trigger
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_customers_updated BEFORE UPDATE ON customers
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS Policies
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage customers" ON customers FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit contact" ON contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage contact" ON contact_submissions FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can book" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage bookings" ON bookings FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage payments" ON payments FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
