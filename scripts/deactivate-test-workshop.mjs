import { Pool } from '@neondatabase/serverless';
import { config } from 'dotenv';

config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "UPDATE products SET is_active = FALSE WHERE product_sku = 'wshop_test_001' RETURNING id, name"
    );
    if (result.rows.length > 0) {
      console.log(`Taller de prueba desactivado: "${result.rows[0].name}" (ID: ${result.rows[0].id})`);
    } else {
      console.log('No se encontró el taller de prueba.');
    }
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(console.error);
