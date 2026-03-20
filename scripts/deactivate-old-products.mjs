import { Pool } from '@neondatabase/serverless';
import { config } from 'dotenv';

config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Old SKUs that are now replaced by the new puls_10XX products
const oldSkus = [
  'puls_abundancia',
  'puls_adn_millonario',
  'puls_adn_millonario_jade',
  'puls_einstein',
  'kit_sexualidad_parejas',
  'puls_kundalini_hombre',
  'puls_kundalini_mujer',
  'puls_dones_proposito',
  'anclas_proteccion',
  'anclas_proteccion_set4',
  'puls_proteccion',
  'puls_proteccion_extra_fuerte',
  'puls_sanadores_cosmicos',
];

async function main() {
  const client = await pool.connect();
  try {
    for (const sku of oldSkus) {
      const result = await client.query(
        'UPDATE products SET is_active = FALSE WHERE product_sku = $1 RETURNING name',
        [sku]
      );
      if (result.rows.length > 0) {
        console.log(`Deactivated: ${result.rows[0].name} (${sku})`);
      } else {
        console.log(`Not found: ${sku}`);
      }
    }

    // Verify remaining active products
    const active = await client.query(
      "SELECT id, product_sku, name, category, price FROM products WHERE type = 'PHYSICAL_GOOD' AND is_active = TRUE ORDER BY category, product_sku"
    );
    console.log('\n=== Remaining Active Products ===');
    for (const row of active.rows) {
      console.log(`  [${row.category}] ${row.name} - $${row.price} MXN`);
    }
    console.log(`\nTotal: ${active.rows.length} products`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(console.error);
