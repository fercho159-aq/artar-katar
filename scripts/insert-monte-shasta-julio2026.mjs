import { Pool } from '@neondatabase/serverless';
import { config } from 'dotenv';

config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const SKU = 'wshop_monte_shasta_julio2026';

const NAME =
  'ACTIVACIONES Y VIAJES INTERDIMENSIONALES AL MONTE SHASTA';

const SHORT_DESCRIPTION =
  'Ciclo intensivo de activación a distancia con Astar Katar. 7 noches de viajes en cuerpos sutiles a los templos iniciáticos de Telos, bajo el Monte Shasta, con Kwan Yin, Adama de Telos y Yeshua. Del 6 al 12 de julio.';

const WORKSHOP_DATE = '7 noches: del 6 al 12 de julio, 10 pm (hora México-centro)';

const IMAGE_URL = '/images/talleres/taller_monte_shasta_julio2026.jpeg';

const DESCRIPTION = `🌟 ACTIVACIONES Y VIAJES INTERDIMENSIONALES AL MONTE SHASTA 🌟

— Ciclo Intensivo de Activación a Distancia, del 6 al 12 de julio —

¿Sientes el llamado del Monte Shasta?

Durante siete noches consecutivas accederemos, a través del Portal Interdimensional de Astar Katar, a los templos iniciáticos de las Dimensiones de Luz que se encuentran en Telos, la ciudad intraterrena bajo el Monte Shasta, uno de los centros espirituales multidimensionales más importantes del planeta, donde convergen las civilizaciones estelares de luz y la civilización lemuriana.

Serás guiado hacia profundas experiencias de transformación, activación y expansión de conciencia junto a grandes Maestros Ascendidos.

✨ En este ciclo recibirás el trabajo energético de:

🌸 La Maestra Kwan Yin, irradiando compasión, sanación y liberación del corazón.

💎 El Maestro Adama de Telos, regente de la civilización lemuriana, quien compartirá activaciones y enseñanzas en los templos intraterrenos.

✝️ El Maestro Yeshua, cuya presencia vibracional acompañará al grupo para impulsar la evolución espiritual, la apertura del corazón y la expansión de la conciencia.

Cada noche, a las 10:00 p.m. (hora México Centro), participarás en meditaciones guiadas especialmente canalizadas y activadas para este evento.

Durante estas experiencias, Astar Katar establecerá una conexión vibracional contigo para llevarte, en cuerpos sutiles, a las reuniones nocturnas con los Maestros en los templos iniciáticos de Telos.

Cada persona vivirá estas experiencias según su sensibilidad:
✨ Algunos recordarán con gran claridad los encuentros.
✨ Otros conservarán imágenes, símbolos o sensaciones.
✨ Otros simplemente dormirán profundamente durante el proceso.

Sin importar cómo lo experimentes, TODOS recibirán las activaciones, armonizaciones y beneficios para el alma, acelerando su evolución espiritual y su apertura multidimensional consciente.

📅 Fechas: 7 sesiones nocturnas, del 6 al 12 de julio.

🕙 Horario: 10:00 p.m. hora de México Centro.

🌎 Horarios internacionales:
🕘 9:00 p.m. — Costa Pacífico de EE.UU.
🕙 10:00 p.m. — México Centro y Centroamérica.
🕚 11:00 p.m. — Centro de EE.UU., Colombia y Perú.
🕛 12:00 a.m. — Este de EE.UU., Caribe y Venezuela.
🕐 1:00 a.m. — Argentina y Chile.

💠 Costos:
• Individual: $1,000 MXN (aprox. 65 USD)
• En pareja: $1,500 MXN (aprox. 97 USD), incluye armonización energética de la relación
• En familia: los hijos hasta 21 años, acompañados por sus padres, participan sin costo

✨ Aparta tu lugar:
📲 WhatsApp: (+52) 81 8113 9378
🌐 En nuestro sitio web: www.astar-katar.com

🌟 Los templos de Telos y los Maestros de Luz te esperan.

Permite que esta semana de activaciones despierte memorias profundas de tu alma, fortalezca tu conexión espiritual y abra nuevas puertas en tu camino evolutivo.

✨ Los lugares son limitados. Reserva hoy mismo tu participación y responde al llamado del Monte Shasta. ✨`;

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
      console.log(`Evento actualizado (ID: ${existing.rows[0].id})`);
    } else {
      const result = await client.query(
        `INSERT INTO products (
          product_sku, type, name, short_description, description,
          price, couple_price, workshop_date, workshop_status, is_active, image_url
        ) VALUES ($1, 'WORKSHOP', $2, $3, $4, 1000.00, 1500.00, $5, 'Abierto', TRUE, $6)
        RETURNING id`,
        [SKU, NAME, SHORT_DESCRIPTION, DESCRIPTION, WORKSHOP_DATE, IMAGE_URL]
      );
      console.log(`Evento creado (ID: ${result.rows[0].id})`);
    }

    // Desactivar eventos que ya pasaron:
    // - Saint Germain a distancia (22-28 junio)
    // - Taller presencial Querétaro (27 junio)
    for (const sku of [
      'wshop_saint_germain_junio2026',
      'wshop_arcturianas_qro_junio2026',
    ]) {
      const deact = await client.query(
        `UPDATE products SET is_active = FALSE
         WHERE product_sku = $1 AND is_active = TRUE
         RETURNING id`,
        [sku]
      );
      if (deact.rows.length > 0) {
        console.log(`Evento anterior ${sku} desactivado (ID: ${deact.rows[0].id})`);
      } else {
        console.log(`Evento ${sku} ya estaba desactivado o no existe.`);
      }
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
