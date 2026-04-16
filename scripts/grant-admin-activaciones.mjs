import 'dotenv/config';
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const EMAIL = 'admin@test.com';
const PROGRAM = 'activaciones_diarias';
const PLAN = 'ACT-6M';
const DAYS = 3650;

const client = await pool.connect();
try {
  await client.query('BEGIN');

  const u = await client.query('SELECT id FROM users WHERE email = $1', [EMAIL]);
  if (u.rows.length === 0) {
    throw new Error(`User ${EMAIL} not found in users table. Sign up first.`);
  }
  const userId = u.rows[0].id;

  const existing = await client.query(
    `SELECT id FROM subscriptions WHERE user_id = $1 AND program = $2 AND status = 'Activa' LIMIT 1`,
    [userId, PROGRAM]
  );

  const ref = `admin-grant-${Date.now()}`;
  let subId, action;

  if (existing.rows.length > 0) {
    subId = existing.rows[0].id;
    await client.query(
      `UPDATE subscriptions
         SET end_date = NOW() + ($1 || ' days')::INTERVAL,
             plan_sku = $2,
             last_payment_reference = $3
       WHERE id = $4`,
      [DAYS, PLAN, ref, subId]
    );
    action = 'extended';
  } else {
    const ins = await client.query(
      `INSERT INTO subscriptions
         (user_id, status, start_date, end_date, program, plan_sku, last_payment_reference)
       VALUES ($1, 'Activa', NOW(), NOW() + ($2 || ' days')::INTERVAL, $3, $4, $5)
       RETURNING id`,
      [userId, DAYS, PROGRAM, PLAN, ref]
    );
    subId = ins.rows[0].id;
    action = 'created';
  }

  await client.query(
    `INSERT INTO subscription_events (user_id, subscription_id, plan_sku, payment_reference, event_type, days_added)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [userId, subId, PLAN, ref, `admin_grant_${action}`, DAYS]
  );

  await client.query('COMMIT');

  const verify = await client.query(
    `SELECT s.program, s.status, s.plan_sku,
            to_char(s.start_date, 'YYYY-MM-DD') start_date,
            to_char(s.end_date, 'YYYY-MM-DD') end_date,
            CEIL(EXTRACT(EPOCH FROM (s.end_date - NOW())) / 86400)::INT days_remaining
     FROM subscriptions s WHERE s.id = $1`,
    [subId]
  );
  console.log(`${action.toUpperCase()} subscription for ${EMAIL}:`);
  console.log(verify.rows[0]);
} catch (e) {
  await client.query('ROLLBACK');
  console.error('FAILED:', e.message);
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}
