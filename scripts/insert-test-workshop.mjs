import { Pool } from '@neondatabase/serverless';
import { config } from 'dotenv';

config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  const client = await pool.connect();
  try {
    // Check if test workshop already exists
    const existing = await client.query(
      "SELECT id, is_active FROM products WHERE product_sku = 'wshop_test_001'"
    );

    if (existing.rows.length > 0) {
      // Activate it if it exists
      await client.query(
        "UPDATE products SET is_active = TRUE, price = 1.00, workshop_status = 'Abierto' WHERE product_sku = 'wshop_test_001'"
      );
      console.log(`Taller de prueba activado (ID: ${existing.rows[0].id})`);
    } else {
      // Insert new test workshop
      const result = await client.query(`
        INSERT INTO products (product_sku, type, name, short_description, description, price, workshop_date, workshop_status, is_active, image_url)
        VALUES (
          'wshop_test_001',
          'WORKSHOP',
          '🧪 Taller de Prueba',
          'Producto de prueba para verificar pagos - $1 MXN',
          'Este es un taller de prueba para verificar que el sistema de pagos funcione correctamente. No es un taller real.',
          1.00,
          'Producto de prueba',
          'Abierto',
          TRUE,
          NULL
        )
        RETURNING id
      `);
      console.log(`Taller de prueba creado (ID: ${result.rows[0].id})`);
    }
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(console.error);
