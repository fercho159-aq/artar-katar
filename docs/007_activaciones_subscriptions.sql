-- ============================================
-- MIGRACIÓN 007: PROGRAMA DE ACTIVACIONES DIARIAS
-- Adds multi-program subscriptions + audio catalog
-- ============================================

BEGIN;

-- 1) Plans table: 4 duration tiers for activaciones diarias (future-proof for other programs)
CREATE TABLE IF NOT EXISTS subscription_plans (
  id SERIAL PRIMARY KEY,
  plan_sku VARCHAR(50) UNIQUE NOT NULL,
  program VARCHAR(50) NOT NULL,
  name VARCHAR(200) NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  duration_days INT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2) Extend existing subscriptions table
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS program VARCHAR(50) DEFAULT 'meditaciones',
  ADD COLUMN IF NOT EXISTS plan_sku VARCHAR(50),
  ADD COLUMN IF NOT EXISTS last_payment_reference VARCHAR(255);

-- FK to plans (nullable for legacy sub_001 rows)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'fk_subscriptions_plan_sku'
  ) THEN
    ALTER TABLE subscriptions
      ADD CONSTRAINT fk_subscriptions_plan_sku
      FOREIGN KEY (plan_sku) REFERENCES subscription_plans(plan_sku);
  END IF;
END $$;

-- Enforce: one active subscription per (user, program)
CREATE UNIQUE INDEX IF NOT EXISTS idx_sub_user_program_active
  ON subscriptions(user_id, program)
  WHERE status = 'Activa';

-- 3) Activaciones audio catalog
CREATE TABLE IF NOT EXISTS activaciones (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  duration_seconds INT,
  audio_filename VARCHAR(200) NOT NULL,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4) Audit log + webhook idempotency
CREATE TABLE IF NOT EXISTS subscription_events (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  subscription_id INT REFERENCES subscriptions(id),
  plan_sku VARCHAR(50),
  payment_reference VARCHAR(255) UNIQUE,
  event_type VARCHAR(50),
  days_added INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5) Seed the 4 plans
INSERT INTO subscription_plans (plan_sku, program, name, price, duration_days) VALUES
  ('ACT-1D','activaciones_diarias','Prueba 1 día',    90,   1),
  ('ACT-1M','activaciones_diarias','1 mes',          390,  30),
  ('ACT-3M','activaciones_diarias','3 meses',        990,  90),
  ('ACT-6M','activaciones_diarias','6 meses',       1690, 180)
ON CONFLICT (plan_sku) DO NOTHING;

COMMIT;
