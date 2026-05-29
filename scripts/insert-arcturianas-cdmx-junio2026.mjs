import { Pool } from '@neondatabase/serverless';
import { config } from 'dotenv';

config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const SKU = 'wshop_arcturianas_cdmx_junio2026';

const NAME = 'EXPERIMENTA LAS CÁMARAS CUÁNTICAS ARCTURIANAS';

const SHORT_DESCRIPTION =
  'Taller presencial en CDMX con Frank Alexander / Astar Katar. Sábado 13 de junio, 10–14 hrs, en Mandala Centro de Arte Decorativo, Col. del Valle Sur. Preparación vibracional y acceso en cuerpos sutiles a la nave arcturiana.';

const WORKSHOP_DATE = 'CDMX · Sábado 13 de junio, 10–14 hrs';

const IMAGE_URL = '/images/talleres/taller_arcturianas_cdmx_junio2026.jpeg';

const DESCRIPTION = `Taller Presencial con Frank Alexander / Astar Katar — en CDMX, sábado 13 de junio.

En el portal interdimensional de Astar-Katar seremos preparados vibracionalmente, y accederemos en cuerpos sutiles a la nave arcturiana para así conocer el trabajo de transformación, manifestación y autosanación multidimensional con los seres estelares de luz.

Podrás recibir esta preparación "en persona" para ti, o indirectamente para otra persona a distancia.

Fecha: sábado, 13 de junio
Horario: 10 – 14 hrs
Lugar: Mandala Centro de Arte Decorativo, Av. Coyoacán 1530, Col. del Valle Sur, CDMX
Costo: $600 MXN

Aparta tu lugar en nuestra página-web www.astar-katar.com/talleres
Información: por WhatsApp al 81.8113.9378

www.astar-katar.com`;

async function main() {
  const client = await pool.connect();
  try {
    // 1) Insertar / actualizar el nuevo taller presencial CDMX
    const existing = await client.query(
      'SELECT id FROM products WHERE product_sku = $1',
      [SKU]
    );

    if (existing.rows.length > 0) {
      await client.query(
        `UPDATE products SET
          is_active = TRUE,
          workshop_status = 'Abierto',
          name = $2,
          short_description = $3,
          description = $4,
          price = 600.00,
          couple_price = NULL,
          workshop_date = $5,
          image_url = $6
        WHERE product_sku = $1`,
        [SKU, NAME, SHORT_DESCRIPTION, DESCRIPTION, WORKSHOP_DATE, IMAGE_URL]
      );
      console.log(`Taller actualizado (ID: ${existing.rows[0].id})`);
    } else {
      const result = await client.query(
        `INSERT INTO products (
          product_sku, type, name, short_description, description,
          price, couple_price, workshop_date, workshop_status, is_active, image_url
        ) VALUES ($1, 'WORKSHOP', $2, $3, $4, 600.00, NULL, $5, 'Abierto', TRUE, $6)
        RETURNING id`,
        [SKU, NAME, SHORT_DESCRIPTION, DESCRIPTION, WORKSHOP_DATE, IMAGE_URL]
      );
      console.log(`Taller creado (ID: ${result.rows[0].id})`);
    }

    // 2) Desactivar TODOS los demás talleres (presenciales y a distancia)
    const deact = await client.query(
      `UPDATE products SET is_active = FALSE
       WHERE type = 'WORKSHOP' AND product_sku <> $1 AND is_active = TRUE
       RETURNING id, name`,
      [SKU]
    );
    if (deact.rows.length > 0) {
      console.log(`Talleres anteriores desactivados (${deact.rows.length}):`);
      for (const r of deact.rows) console.log(`  - [${r.id}] ${r.name}`);
    } else {
      console.log('No había otros talleres activos para desactivar.');
    }

    // 3) Verificar talleres activos finales
    const active = await client.query(
      "SELECT id, product_sku, name, workshop_date FROM products WHERE type='WORKSHOP' AND is_active = TRUE ORDER BY id DESC"
    );
    console.log('\n=== Talleres activos ahora ===');
    for (const r of active.rows) console.log(`  [${r.id}] ${r.name} — ${r.workshop_date}`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
