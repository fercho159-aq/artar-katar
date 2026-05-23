import { Pool } from '@neondatabase/serverless';
import { config } from 'dotenv';

config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const SKU = 'wshop_arcturianas_mayo2026';

const NAME =
  'REPROGRAMA Y RECONFIGURA TU ADN MULTIDIMENSIONAL EN LAS CÁMARAS CUÁNTICAS DE SANACIÓN ARCTURIANAS';

const SHORT_DESCRIPTION =
  'Ciclo intensivo de 7 noches de reprogramación y reconfiguración de tu ADN multidimensional en las cámaras cuánticas de sanación arcturianas. Del 25 al 31 de mayo.';

const WORKSHOP_DATE = '7 noches: del 25 al 31 de mayo, 10 pm (hora México-centro)';

const IMAGE_URL = '/images/talleres/taller_arcturianas_mayo2026.jpeg';

const DESCRIPTION = `Las energías cósmicas están elevando su frecuencia intensamente en estos tiempos, acelerando la evolución y apertura multidimensional de muchos seres… pero también haciendo emerger antiguas codificaciones limitantes que aún permanecen activas.

Para ayudarnos a integrar estas nuevas frecuencias de luz y alinearnos con nuestro verdadero plan cósmico personal, los seres estelares estarán trabajando profundamente en la reprogramación y reconfiguración de nuestro ADN multidimensional durante un poderoso ciclo intensivo de activación, del 25 al 31 de mayo.

A través del portal interdimensional de Astar Katar, durante cada sesión seremos llevados en cuerpos sutiles a la nave arcturiana Atena, donde tendrán lugar procesos avanzados de sanación, activación y reconfiguración energética.

Durante este trabajo multidimensional también estaremos acompañados por Arcángel Miguel, Yeshua y Madre María, en su calidad de maestros cósmicos ascendidos.

Trabajaremos con meditaciones guiadas canalizadas y activadas multidimensionalmente por Astar Katar, diseñadas especialmente para facilitar estos encuentros y procesos evolutivos.

Cada participante vivirá esta experiencia de acuerdo con su sensibilidad personal. Algunos tendrán recuerdos vívidos de lo experimentado en los planos superiores, otros percibirán imágenes o sensaciones sutiles, y algunos incluso podrán quedarse dormidos durante las sesiones… Sin embargo, TODOS recibirán las activaciones y sanaciones correspondientes, percibiendo posteriormente cambios y movimientos importantes en su vida cotidiana.

Costos:
• Individual: $1000 MXN (apróx. 65 USD)
• En pareja: $1500 MXN (apróx. 97 USD), incluye armonización energética de la relación
• En familia: hijos acompañados hasta 21 años participan GRATIS

Comenzaremos a trabajarte a partir de las 10 pm, hora México-centro.

Horarios internacionales:
• 9 pm: EE.UU-pacífico
• 10 pm: México-centro y Centroamérica
• 11 pm: Colombia, Perú y EE.UU-centro
• 12 am: EE.UU-este y Caribe
• 1 am: Argentina y Chile
• España: sesión especial a las 22:00 hrs, hora local`;

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

    // Desactivar evento a distancia anterior (Encarnaciones Andrómeda, del 11 al 17 de mayo)
    const deact = await client.query(
      `UPDATE products SET is_active = FALSE
       WHERE product_sku = 'wshop_encarnaciones_andromeda_mayo2026'
       RETURNING id`
    );
    if (deact.rows.length > 0) {
      console.log(`Evento a distancia anterior desactivado (ID: ${deact.rows[0].id})`);
    } else {
      console.log('No se encontró el evento a distancia anterior para desactivar.');
    }
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(console.error);
