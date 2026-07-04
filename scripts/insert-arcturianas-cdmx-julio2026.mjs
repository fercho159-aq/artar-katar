import { Pool } from '@neondatabase/serverless';
import { config } from 'dotenv';

config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const SKU = 'wshop_arcturianas_cdmx_julio2026';

const NAME =
  'UTILIZA EL POTENCIAL ILIMITADO DE LAS CÁMARAS CUÁNTICAS ARCTURIANAS';

const SHORT_DESCRIPTION =
  'Taller presencial experiencial en CDMX con Astar Katar / Frank Alexander. Sábado 11 de julio, 10–14 hrs, en Mandala, Centro Decurativo. Viaje en cuerpos sutiles a las Cámaras Cuánticas Arcturianas para sanación y manifestación consciente.';

const WORKSHOP_DATE = 'CDMX · Sábado 11 de julio, 10–14 hrs';

const IMAGE_URL = '/images/talleres/taller_arcturianas_cdmx_julio2026.jpeg';

const DESCRIPTION = `✨ UTILIZA EL POTENCIAL ILIMITADO DE LAS CÁMARAS CUÁNTICAS ARCTURIANAS ✨

🌌 Vive una experiencia que puede transformar el rumbo de tu vida

🌟 Taller Presencial Experiencial en CDMX – Sábado 11 de julio 🌟
Con Astar Katar / Frank Alexander

¿Qué pasaría si durante unas horas pudieras acceder a una tecnología cósmica de luz capaz de ayudarte a manifestar aquello que deseas para tu vida?

Las Cámaras Cuánticas Arcturianas representan una de las herramientas energéticas más extraordinarias para la transformación y la manifestación consciente. Su potencial es prácticamente ilimitado y depende de la intención con la que ingreses a su campo vibracional.

Podrás utilizarlas para favorecer procesos de:
✨ Sanación física, emocional y energética.
✨ Manifestación de objetivos personales.
✨ Impulso de proyectos profesionales, financieros o de negocios.
✨ Armonización de aspectos sentimentales.
✨ Cualquier propósito alineado con el mayor bien de todos, sin manipular la voluntad de ninguna persona.

🚀 Un viaje multidimensional guiado por los Seres Arcturianos

Durante este taller, Astar Katar abrirá un Portal Interdimensional hacia las Altas Dimensiones de Luz, permitiendo el descenso vibracional de los Seres Estelares Arcturianos para trabajar personalmente contigo.

Guiado por ellos, realizarás un viaje en cuerpos sutiles hacia la nave arcturiana, donde ingresarás a las Cámaras Cuánticas Arcturianas, espacios de alta frecuencia en los que podrás trabajar profundamente los objetivos que deseas manifestar en tu vida.

Aunque esta experiencia ocurre en cuerpos sutiles mientras permaneces sentado junto con los demás participantes en el salón, muchas personas logran visualizar claramente lo vivido en los planos superiores y TODOS reciben los beneficios energéticos intencionados del trabajo realizado, independientemente de lo que perciban durante la experiencia.

🌟 Cada persona vive el proceso de una manera única, pero todas reciben la asistencia vibracional de los Seres Arcturianos.

💫 Una oportunidad para abrirte a nuevas posibilidades

Si sientes el llamado de profundizar en tu crecimiento espiritual, impulsar cambios importantes en tu vida o experimentar una conexión directa con dimensiones superiores de conciencia, este taller puede convertirse en una experiencia que recordarás para siempre.

Permítete recibir la ayuda de los Seres Arcturianos y descubrir el inmenso potencial creador que existe dentro de ti.

📅 Fecha: Sábado 11 de julio
🕙 Horario: 10:00 a.m. a 2:00 p.m.
💰 Costo: $600 MXN

📍 Lugar:
Mandala, Centro Decurativo
Av. Coyoacán 1530
Col. del Valle, CDMX

✨ Aparta tu lugar:
🌐 En nuestra página: www.astar-katar.com
📲 O por WhatsApp: 81 8113 9378

🌠 Si las Cámaras Cuánticas Arcturianas han llegado a tu camino, quizá no sea una coincidencia. Tal vez sea el momento de dar un paso hacia una realidad con mayores posibilidades para tu vida.

¡TE ESPERAMOS! 💙✨`;

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
          price = 600.00,
          couple_price = NULL,
          workshop_date = $5,
          image_url = $6
        WHERE product_sku = $1`,
        [SKU, NAME, SHORT_DESCRIPTION, DESCRIPTION, WORKSHOP_DATE, IMAGE_URL]
      );
      console.log(`Taller CDMX actualizado (ID: ${existing.rows[0].id})`);
    } else {
      const result = await client.query(
        `INSERT INTO products (
          product_sku, type, name, short_description, description,
          price, couple_price, workshop_date, workshop_status, is_active, image_url
        ) VALUES ($1, 'WORKSHOP', $2, $3, $4, 600.00, NULL, $5, 'Abierto', TRUE, $6)
        RETURNING id`,
        [SKU, NAME, SHORT_DESCRIPTION, DESCRIPTION, WORKSHOP_DATE, IMAGE_URL]
      );
      console.log(`Taller CDMX creado (ID: ${result.rows[0].id})`);
    }

    // Desactivar el taller presencial anterior (León, sábado 4 de julio)
    const deact = await client.query(
      `UPDATE products SET is_active = FALSE
       WHERE product_sku = 'wshop_arcturianas_leon_julio2026' AND is_active = TRUE
       RETURNING id`
    );
    if (deact.rows.length > 0) {
      console.log(`Taller presencial anterior (León) desactivado (ID: ${deact.rows[0].id})`);
    } else {
      console.log('Taller León ya estaba desactivado o no existe.');
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
