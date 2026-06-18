import { Pool } from '@neondatabase/serverless';
import { config } from 'dotenv';

config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const SKU = 'wshop_arcturianas_leon_julio2026';

const NAME = 'EXPERIMENTA TU VIAJE A LAS CÁMARAS CUÁNTICAS ARCTURIANAS';

const SHORT_DESCRIPTION =
  'Taller experiencial presencial en León, Gto con Frank Alexander / Astar Katar. Sábado 4 de julio, 10–14 hrs, en Hotel Imperio de los Ángeles. Activaciones y preparación vibracional para acceder en cuerpos sutiles a las Cámaras Cuánticas Arcturianas.';

const WORKSHOP_DATE = 'León, Gto · Sábado 4 de julio, 10–14 hrs';

const IMAGE_URL = '/images/talleres/taller_arcturianas_leon_julio2026.jpeg';

const DESCRIPTION = `✨ EN LEÓN, GTO... EXPERIMENTA TU VIAJE A LAS CÁMARAS CUÁNTICAS ARCTURIANAS ✨

🌟 Taller Experiencial Presencial en León, Gto – Sábado 4 de julio 🌟

¿Te gustaría acceder a tecnologías cósmicas de luz para impulsar tu armonización corporal, transformación personal y manifestación de objetivos?

A través del Portal Interdimensional de Astar Katar subirás en cuerpos sutiles a la nave estelar arcturiana y vivirás una experiencia extraordinaria de conexión con las Cámaras Cuánticas Arcturianas, espacios vibracionales de alta frecuencia donde podrás trabajar aspectos importantes de tu vida con la asistencia de los seres estelares de luz.

Durante este encuentro realizaremos diversas activaciones y preparaciones energéticas que te permitirán elevar tu frecuencia y acceder, en cuerpos sutiles, a la nave arcturiana. Una vez alcanzado el estado vibracional adecuado, serás guiado por los seres estelares hacia las Cámaras Cuánticas, donde podrás enfocar tu intención en aquellas áreas que más requieran apoyo, armonización corporal, transformación o manifestación de tus objetivos en este momento de tu vida.

✨ Armonización corporal multidimensional
✨ Transformación personal
✨ Manifestación de metas y objetivos
✨ Expansión de consciencia
✨ Conexión con tecnologías de luz arcturianas

Las Cámaras Cuánticas Arcturianas poseen un potencial de creación prácticamente ilimitado, que responde a la intención consciente y al nivel vibracional con el que ingresas a ellas.

El taller será impartido por Frank Alexander, walk-in de Astar Katar, ser creador de las Altas Dimensiones de Luz, a través de cuyo Portal Interdimensional se realizan estos encuentros. Nuestro portal conecta exclusivamente con las Altas Dimensiones de Luz y los seres que las habitan.

📅 Fecha: Sábado 4 de julio
🕙 Horario: 10:00 a 14:00 hrs
💰 Costo: $600 MXN

📍 Lugar:
Hotel Imperio de los Ángeles
Blvd. López Mateos 1902
Las Bugambilias, León, Gto.

📲 Informes y reservaciones por WhatsApp: 81 8113 9378

🌐 Reserva tu lugar: www.astar-katar.com

⚡ Los espacios son limitados. Si sientes el llamado de los Arcturianos y de las frecuencias superiores de luz, este encuentro puede ser una oportunidad única para experimentar estas técnicas multidimensionales de transformación y consciencia.`;

async function main() {
  const client = await pool.connect();
  try {
    // Insertar / actualizar el taller presencial León (sin tocar otros talleres aquí)
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
      console.log(`Taller León actualizado (ID: ${existing.rows[0].id})`);
    } else {
      const result = await client.query(
        `INSERT INTO products (
          product_sku, type, name, short_description, description,
          price, couple_price, workshop_date, workshop_status, is_active, image_url
        ) VALUES ($1, 'WORKSHOP', $2, $3, $4, 600.00, NULL, $5, 'Abierto', TRUE, $6)
        RETURNING id`,
        [SKU, NAME, SHORT_DESCRIPTION, DESCRIPTION, WORKSHOP_DATE, IMAGE_URL]
      );
      console.log(`Taller León creado (ID: ${result.rows[0].id})`);
    }

    // Desactivar el taller presencial anterior (CDMX, sábado 13 de junio, ya pasó)
    const deact = await client.query(
      `UPDATE products SET is_active = FALSE
       WHERE product_sku = 'wshop_arcturianas_cdmx_junio2026'
       RETURNING id`
    );
    if (deact.rows.length > 0) {
      console.log(`Taller presencial anterior (CDMX) desactivado (ID: ${deact.rows[0].id})`);
    } else {
      console.log('No se encontró el taller presencial CDMX para desactivar.');
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
