-- Grant admin@test.com full access to "Activaciones Diarias" program.
-- Creates or extends an Activa subscription for 10 years (3650 days).

BEGIN;

WITH admin_user AS (
  SELECT id FROM users WHERE email = 'admin@test.com' LIMIT 1
),
upsert AS (
  INSERT INTO subscriptions
    (user_id, status, start_date, end_date, program, plan_sku, last_payment_reference)
  SELECT
    admin_user.id,
    'Activa',
    NOW(),
    NOW() + INTERVAL '3650 days',
    'activaciones_diarias',
    'ACT-6M',
    'admin-grant-' || to_char(NOW(), 'YYYYMMDDHH24MISS')
  FROM admin_user
  ON CONFLICT (user_id, program) WHERE status = 'Activa'
  DO UPDATE SET
    end_date = NOW() + INTERVAL '3650 days',
    plan_sku = 'ACT-6M',
    last_payment_reference = EXCLUDED.last_payment_reference
  RETURNING id, user_id
)
INSERT INTO subscription_events
  (user_id, subscription_id, plan_sku, payment_reference, event_type, days_added)
SELECT user_id, id, 'ACT-6M', 'admin-grant-' || to_char(NOW(), 'YYYYMMDDHH24MISS'), 'admin_grant', 3650
FROM upsert;

COMMIT;

-- Verify
SELECT u.email, s.program, s.status, s.start_date, s.end_date, s.plan_sku
FROM subscriptions s
JOIN users u ON u.id = s.user_id
WHERE u.email = 'admin@test.com' AND s.program = 'activaciones_diarias';
