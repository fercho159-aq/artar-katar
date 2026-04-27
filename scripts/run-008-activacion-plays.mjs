import 'dotenv/config';
import { Pool } from '@neondatabase/serverless';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sqlPath = resolve(__dirname, '../docs/008_activacion_plays.sql');
const sql = readFileSync(sqlPath, 'utf8');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const client = await pool.connect();
try {
  await client.query(sql);
  const check = await client.query(
    `SELECT to_regclass('activacion_plays') AS table_name`
  );
  console.log('Migration applied. table_name =', check.rows[0].table_name);
  const idx = await client.query(
    `SELECT indexname FROM pg_indexes WHERE tablename = 'activacion_plays' ORDER BY indexname`
  );
  console.log('Indexes:', idx.rows.map(r => r.indexname));
} catch (e) {
  console.error('FAILED:', e.message);
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}
