import { Pool } from '@neondatabase/serverless';
import { config } from 'dotenv';

config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "UPDATE products SET image_url = $1 WHERE product_sku = 'wshop_009' RETURNING id, product_sku, image_url",
      ['/images/talleres/taller_arcturianas.jpeg']
    );
    console.log(`Filas actualizadas: ${result.rowCount}`);
    console.log(result.rows);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
