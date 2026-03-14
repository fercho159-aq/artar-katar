import { Pool } from '@neondatabase/serverless';
import { config } from 'dotenv';

config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  const client = await pool.connect();
  try {
    await client.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_email VARCHAR(255) DEFAULT NULL");
    console.log('Columna shipping_email agregada exitosamente a la tabla orders.');
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(console.error);
