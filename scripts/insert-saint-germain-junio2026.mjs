import { Pool } from '@neondatabase/serverless';
import { config } from 'dotenv';

config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const SKU = 'wshop_saint_germain_junio2026';

const NAME =
  'ACTIVACIÓN INTENSIVA CON SAINT GERMAIN, LA LLAMA VIOLETA Y LOS SERES ESTELARES PLEYADIANOS';

const SHORT_DESCRIPTION =
  'Semana de activación intensiva a distancia con Saint Germain, la Llama Violeta y los seres estelares pleyadianos. 7 noches de transmutación, sanación y activación de ADN multidimensional. Del 22 al 28 de junio.';

const WORKSHOP_DATE = '7 noches: del 22 al 28 de junio, 10 pm (hora México-centro)';

const IMAGE_URL = '/images/talleres/taller_saint_germain_junio2026.jpeg';

const DESCRIPTION = `ACTIVACIÓN INTENSIVA CON SAINT GERMAIN, LA LLAMA VIOLETA Y LOS SERES ESTELARES PLEYADIANOS...

— Semana de activación intensiva a distancia, del 22 al 28 de junio —

Será una semana de fuerte trabajo energético personal para lograr mejoras y cambios en tu vida diaria, en tu salud, en tu proyección profesional, material y financiera. Será un trabajo intensivo de transmutación y disolución de los bloqueos subconscientes y energéticos que hasta ahora te han retenido, un parteaguas para tu vida personal que debe traer grandes cambios para ti...

A través del portal interdimensional de Astar Katar subiremos en cuerpos sutiles a las naves pleyadianas para ser trabajados en sus cámaras cuánticas de sanación y para conectarnos con Saint Germain y la llama violeta transmutadora. Allí serán activadas tus 12 hebras de ADN multidimensional por los seres estelares de Pléyades.

Recibirás una serie de meditaciones guiadas canalizadas y activadas por Astar Katar, mediante las cuales nos conectaremos en grupo, cada noche a partir de las 22:00 hrs, hora México-centro (ver horarios internacionales al final de la publicación).

Cada uno experimentará las activaciones cósmicas de acuerdo con su grado de sensibilidad personal. Muchos experimentarán nítidamente lo ocurrido en los planos de luz, otros retendrán imágenes huidizas de lo recibido, mientras que otros se quedarán profundamente dormidos. Sin embargo, TODOS podrán experimentar los beneficios correspondientes, prácticos y tangibles para su vida diaria.

Fechas: 7 noches consecutivas, del 22 al 28 de junio.

Horario: a partir de las 22:00 hrs, hora México-centro.

Costos:
• Individual: $1000 MXN (apróx. 65 USD)
• En pareja: $1500 MXN (apróx. 97 USD), incluye armonización de su relación
• En familia: hijos hasta 21 años participan GRATIS

Aparta tu lugar:
WhatsApp: (+52) 81 8113 9378
En nuestro sitio web: www.astar-katar.com

¡Te esperamos!`;

async function main() {
  const client = await pool.connect();
  try {
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
          price = 1000.00,
          couple_price = 1500.00,
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
        ) VALUES ($1, 'WORKSHOP', $2, $3, $4, 1000.00, 1500.00, $5, 'Abierto', TRUE, $6)
        RETURNING id`,
        [SKU, NAME, SHORT_DESCRIPTION, DESCRIPTION, WORKSHOP_DATE, IMAGE_URL]
      );
      console.log(`Taller creado (ID: ${result.rows[0].id})`);
    }

    // Desactivar evento a distancia anterior (Cámaras Sirianas, del 8 al 14 de junio, ya pasó)
    const deact = await client.query(
      `UPDATE products SET is_active = FALSE
       WHERE product_sku = 'wshop_camaras_sirianas_junio2026'
       RETURNING id`
    );
    if (deact.rows.length > 0) {
      console.log(`Evento a distancia anterior (Sirianas) desactivado (ID: ${deact.rows[0].id})`);
    } else {
      console.log('No se encontró el evento a distancia anterior para desactivar.');
    }

    // Verificar talleres activos finales
    const active = await client.query(
      "SELECT id, product_sku, name, workshop_date, price FROM products WHERE type='WORKSHOP' AND is_active = TRUE ORDER BY id DESC"
    );
    console.log('\n=== Talleres activos ahora ===');
    for (const r of active.rows)
      console.log(`  [${r.id}] ${r.name} — ${r.workshop_date} — $${r.price}`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
