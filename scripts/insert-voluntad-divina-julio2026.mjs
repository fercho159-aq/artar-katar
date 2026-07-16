import { Pool } from '@neondatabase/serverless';
import { config } from 'dotenv';

config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const SKU = 'wshop_voluntad_divina_julio2026';

const NAME = 'LA VOLUNTAD DIVINA EN NUESTRO CUERPO FÍSICO';

const SHORT_DESCRIPTION =
  'Ciclo de activación a distancia con Astar Katar, Saint Germain, el Arcángel Miguel, Yeshua y los Seres Estelares de Sirio. 7 noches de viajes en cuerpos sutiles a las Cámaras Cuánticas de Sanación Sirianas. Del 20 al 26 de julio.';

const WORKSHOP_DATE = '7 noches: del 20 al 26 de julio, 10 pm (hora México-centro)';

const IMAGE_URL = '/images/talleres/taller_voluntad_divina_julio2026.jpeg';

const DESCRIPTION = `✨ ¿Y SI TU CUERPO PUDIERA RECORDAR SU DISEÑO ORIGINAL DE LUZ? ✨

LA VOLUNTAD DIVINA EN NUESTRO CUERPO FÍSICO

🌌 Ciclo de Activación con Astar Katar, Saint Germain, Arcángel Miguel, Yeshua y los Seres Estelares de Sirio

Muchas personas buscan respuestas únicamente en el plano físico...

Pero ¿qué sucede si el origen de gran parte de lo que experimentamos se encuentra en niveles mucho más profundos de nuestra conciencia?

Tu cuerpo físico es mucho más que materia. Es la manifestación en la tercera dimensión de programas multidimensionales de creación de realidad, creencias, memorias y patrones que has ido incorporando a lo largo de tu vida.

La buena noticia es que estos programas pueden ser redefinidos, remodulados y elevados desde las Dimensiones Superiores de Luz.

Durante este extraordinario ciclo trabajarás junto a Astar Katar, Saint Germain, el Arcángel Miguel, Yeshua y los Seres Estelares de Sirio para abrir nuevas posibilidades de transformación interior y armonización energética.

No se trata únicamente de adquirir conocimiento...

Se trata de vivir una experiencia que puede cambiar profundamente la forma en que percibes tu cuerpo, tu energía y tu realidad.

🌟 Durante 7 noches consecutivas accederás a las Cámaras Cuánticas de Sanación Sirianas

A través del Portal Interdimensional de Astar Katar, serás guiado en cuerpos sutiles hacia las Cámaras Cuánticas de Sanación ubicadas en una nave siriana de luz.

Estos espacios de frecuencia elevada son utilizados para realizar profundos procesos de reorganización energética y expansión de conciencia mediante meditaciones especialmente canalizadas para este ciclo.

✨ Puedes participar desde cualquier lugar del mundo.

✨ Solamente necesitas registrarte y estar cómodamente recostado en tu hogar a la hora de la sesión.

Cada persona vive esta experiencia de manera diferente.

Algunos recuerdan con claridad lo sucedido durante el viaje; otros reciben imágenes, sensaciones o comprensiones profundas; algunos simplemente descansan mientras el trabajo energético se desarrolla.

Sin importar cómo sea tu experiencia consciente, todos los participantes reciben las activaciones y los beneficios de las Cámaras Cuánticas de Sanación Sirianas.

📅 Fechas: 7 noches consecutivas, del 20 al 26 de julio.

🕙 Horario: 10:00 p.m. hora del centro de México.

💫 Inversión:
🔹 Individual: $1,000 MXN (aprox. 65 USD)
🔹 Pareja: $1,500 MXN (aprox. 97 USD), incluye armonización energética de la relación
🔹 Familia: los hijos acompañados de hasta 21 años participan sin costo adicional

🌍 Puedes participar desde cualquier país.

Miles de kilómetros no representan una limitación cuando el trabajo se realiza desde los planos superiores de conciencia.

Si sientes que este llamado resuena contigo, quizá no sea una coincidencia.

Tal vez sea el momento de permitir que tu cuerpo recuerde la frecuencia para la cual fue creado.

✨ Tu transformación comienza con una decisión.

🌐 Información e inscripciones: www.astar-katar.com

📲 WhatsApp: (+52) 81 8113 9378

💙 TE ESPERAMOS.`;

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
    // - Activación a distancia Monte Shasta (6-12 julio)
    // - Taller presencial CDMX Cámaras Arcturianas (11 julio)
    for (const sku of [
      'wshop_monte_shasta_julio2026',
      'wshop_arcturianas_cdmx_julio2026',
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
