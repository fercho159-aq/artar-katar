import { Pool } from '@neondatabase/serverless';
import { config } from 'dotenv';

config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const SKU = 'wshop_fractales_multidimensionales_mayo2026';

const NAME = 'Conecta con tus Fractales Multidimensionales';

const SHORT_DESCRIPTION =
  'Encuentro presencial en CDMX. Conecta con tus encarnaciones paralelas en otros tiempos y dimensiones. Sábado 23 de mayo, 10–14 hrs.';

const DESCRIPTION = `Todos tenemos gran variedad de fractales (encarnaciones paralelas en otros tiempos o dimensiones), cada una en su experiencia de vida propia, todos unidos por un "Yo Superior" común.

En nuestro portal interdimensional de Astar Katar podrás conocerlos y experimentarlos en forma directa y experiencial. Estaremos llamando a aquellos fractales tuyos, cuyas capacidades especiales te serían de gran utilidad en tu situación de vida actual, para que unifiquen su consciencia contigo.

Una experiencia enriquecedora que podrá cambiar tu vida.

Fecha: sábado 23 de mayo
Horario: 10 – 14:00 hrs
Lugar: Mandala, Centro de Arte Decorativo, Av. Coyoacán 1530, Col. Del Valle-Sur, CDMX

Información: WhatsApp 81.8113.9378`;

async function main() {
  const client = await pool.connect();
  try {
    const existing = await client.query(
      'SELECT id, is_active FROM products WHERE product_sku = $1',
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
          workshop_date = 'Sábado 23 de mayo, 10–14 hrs',
          image_url = '/images/talleres/taller_fractales_multidimensionales.jpeg'
        WHERE product_sku = $1`,
        [SKU, NAME, SHORT_DESCRIPTION, DESCRIPTION]
      );
      console.log(`Taller actualizado (ID: ${existing.rows[0].id})`);
    } else {
      const result = await client.query(
        `INSERT INTO products (
          product_sku, type, name, short_description, description,
          price, workshop_date, workshop_status, is_active, image_url
        ) VALUES ($1, 'WORKSHOP', $2, $3, $4, 600.00, $5, 'Abierto', TRUE, $6)
        RETURNING id`,
        [
          SKU,
          NAME,
          SHORT_DESCRIPTION,
          DESCRIPTION,
          'Sábado 23 de mayo, 10–14 hrs',
          '/images/talleres/taller_fractales_multidimensionales.jpeg',
        ]
      );
      console.log(`Taller creado (ID: ${result.rows[0].id})`);
    }
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(console.error);
