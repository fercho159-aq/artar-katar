import { Pool } from '@neondatabase/serverless';
import { config } from 'dotenv';

config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const SKU = 'wshop_camaras_sirianas_junio2026';

const NAME =
  'DESCUBRE EL POTENCIAL INFINITO DE TU SER EN LAS CÁMARAS CUÁNTICAS SIRIANAS';

const SHORT_DESCRIPTION =
  'Ciclo intensivo a distancia de 7 noches de activación, sanación multidimensional y expansión de consciencia en las Cámaras Cuánticas Sirianas. Del 8 al 14 de junio.';

const WORKSHOP_DATE = '7 noches: del 8 al 14 de junio, 10 pm (hora México-centro)';

const IMAGE_URL = '/images/talleres/taller_camaras_sirianas_junio2026.jpeg';

const DESCRIPTION = `¿Y si aquello que hoy consideras ser tu identidad fuera apenas una pequeña fracción de lo que realmente eres?

Más allá de la historia personal, de las creencias, de los límites aprendidos y de la imagen que tu mente ha construido de ti mismo, existe una consciencia infinita esperando ser recordada.

Los seres estelares de Sirio nos invitan a un profundo viaje de expansión interior para trascender las limitaciones de la percepción humana, dejar atrás viejas estructuras de realidad y despertar nuevas posibilidades de creación consciente.

Durante este ciclo intensivo de activación trabajaremos junto a la Fuente, el Arcángel Metatrón, el Arcángel Miguel y los seres estelares de Sirio en procesos de apertura de consciencia, transformación energética y sanación multidimensional.

A través del Portal Interdimensional de Astar Katar, cada noche serás conectado con la nave siriana y sus Cámaras Cuánticas de Sanación, donde recibirás exactamente las energías, frecuencias y aperturas que correspondan a tu nivel actual de consciencia, siempre bajo la guía de tu Yo Superior y de acuerdo con tu camino de alma.

Cada experiencia es única. Algunas personas recuerdan vívidamente sus encuentros y procesos en los planos de luz. Otras reciben imágenes, símbolos o mensajes fragmentados. Y algunas simplemente duermen profundamente durante toda la sesión. Sin importar cómo se manifieste tu experiencia consciente, TODOS reciben los beneficios de las activaciones, sanaciones y ajustes energéticos realizados durante la noche.

Durante los siete días trabajaremos con una serie de meditaciones guiadas, canalizadas y energéticamente activadas para nuestro grupo, las cuales recibirás antes de cada sesión para potenciar tu proceso.

Un viaje de expansión personal y despertar interior que puede transformar profundamente tu percepción de quién eres y de lo que es posible crear en tu realidad.

Fechas: 7 noches de activación intensiva, del 8 al 14 de junio.

Inicio de cada sesión: 10:00 pm (hora México-centro).

Costos:
• Individual: $1000 MXN (apróx. 65 USD)
• En pareja: $1500 MXN (apróx. 97 USD), incluye armonización energética de la relación
• En familia: hijos acompañados hasta 21 años participan GRATIS

Horarios internacionales:
• 9 pm: Costa Pacífico EE.UU.
• 10 pm: México-centro y Centroamérica
• 11 pm: Colombia, Perú y EE.UU.-centro
• 12 am: Costa Este EE.UU.
• 1 am: Chile y Argentina
• España: sesión especial a las 22:00 hrs, hora local

Informes y reservaciones: WhatsApp (+52) 81 8113 9378`;

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

    // Desactivar evento a distancia anterior (Arcturianas, del 25 al 31 de mayo)
    const deact = await client.query(
      `UPDATE products SET is_active = FALSE
       WHERE product_sku = 'wshop_arcturianas_mayo2026'
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
