import { Pool } from '@neondatabase/serverless';
import { config } from 'dotenv';

config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const SKU = 'wshop_encarnaciones_andromeda_mayo2026';

const NAME = '¿Cuáles han sido mis encarnaciones en otras vidas, realidades y dimensiones?';

const SHORT_DESCRIPTION =
  'Activación de 7 noches en registros akáshicos cósmicos bajo la guía de los seres estelares de Andrómeda. Del 11 al 17 de mayo.';

const DESCRIPTION = `Realizaremos una maravillosa activación de 7 noches en registros akáshicos cósmicos, bajo la guía y protección de los seres estelares de nuestra galaxia hermana, Andrómeda.

Seremos guiados por razas cósmicas sumamente antiguas y evolucionadas de Andrómeda, que hace eones sembraron las diferentes civilizaciones estelares con las que comúnmente interactuamos hoy en día en nuestra vía láctea.

Bajo su guía sanaremos nuestras heridas de vidas pasadas, para que cada uno de ustedes continúe su camino evolutivo con las nuevas energías.

Comprenderás de forma profunda acerca de tu vida, quitando toda creencia errónea en ti mismo, desde otra vida. Podrás avanzar con facilidad, limpiando tu camino de vida, tu linaje y aprenderás a resolver situaciones y mirar la vida desde otro punto. Con ayuda de los Andromedanos, entenderás el linaje estelar de tu alma.

Trabajaremos como siempre con Arcángel Miguel, tus guías y maestros, Numo y Nikol, sanadores de Sirio y bajo la guía de Astar Katar y Frank Alexander.

Cada noche te conectaremos al portal interdimensional de Astar Katar a través de las meditaciones guiadas canalizadas y activadas que recibirás al iniciar el trabajo. Seremos llevados a las naves andromedanas en cuerpos sutiles donde se llevarán a cabo las sanaciones y activaciones.

Cada uno experimentará estas activaciones de acuerdo con su sensibilidad personal. Muchos tendrán vivos recuerdos de su experiencia multidimensional, otros retendrán imágenes huidizas mientras que otros se quedarán dormidos. Independientemente de cómo vayan a ser tus experiencias, TODOS recibirán los efectos sanadores profundos a nivel de alma de estas activaciones.

Comenzaremos a trabajarte a las 10 pm, hora México-centro.

Horarios internacionales:
• 9 pm: EE.UU-pacífico
• 10 pm: México-centro, Centroamérica
• 11 pm: Colombia, Perú, EE.UU-centro
• 12 am: EE.UU-este, Caribe
• 1 am: Chile, Argentina
• España: sesiones especiales a las 22:00 hrs, hora local`;

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
          price = 1000.00,
          couple_price = 1500.00,
          workshop_date = '7 sesiones, del 11 al 17 de mayo',
          image_url = '/images/talleres/taller_encarnaciones_andromeda.jpg'
        WHERE product_sku = $1`,
        [SKU, NAME, SHORT_DESCRIPTION, DESCRIPTION]
      );
      console.log(`Taller actualizado (ID: ${existing.rows[0].id})`);
    } else {
      const result = await client.query(
        `INSERT INTO products (
          product_sku, type, name, short_description, description,
          price, couple_price, workshop_date, workshop_status, is_active, image_url
        ) VALUES ($1, 'WORKSHOP', $2, $3, $4, 1000.00, 1500.00, $5, 'Abierto', TRUE, $6)
        RETURNING id`,
        [
          SKU,
          NAME,
          SHORT_DESCRIPTION,
          DESCRIPTION,
          '7 sesiones, del 11 al 17 de mayo',
          '/images/talleres/taller_encarnaciones_andromeda.jpg',
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
