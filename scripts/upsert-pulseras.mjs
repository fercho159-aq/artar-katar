import { Pool } from '@neondatabase/serverless';
import { config } from 'dotenv';

config({ path: '.env.local' });
if (!process.env.DATABASE_URL) {
  config({ path: '.env' });
}

if (!process.env.DATABASE_URL) {
  console.error('\n❌ ERROR: No se encontró DATABASE_URL. Asegúrate de tener un archivo .env o .env.local con la conexión.\n');
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const products = [
  // === ABUNDANCIA (Abundancia & ADN Millonario - 12 modelos) ===
  {
    sku: 'puls_1001', name: 'Pulsera ADN Millonario Modelo 1',
    short_description: 'Astar katar & la Fuente\nReconecta tus filamentos multidimensionales "de abundancia" y ayuda a atraer riqueza financiera',
    description: 'Activa tu capacidad natural de manifestación sin límites | Reconecta tus filamentos de ADN multidimensional de manifestación | Atrae abundancia económica desde la Fuente',
    activated_by: 'Astar katar & la Fuente',
    stone: 'Agatha y Obsidiana', category: 'Abundancia', price: 2900,
    image_url: '/images/pulseras/adn-millonario-1.png',
    learn_more: 'En esta 3ª densidad, la conexión consciente con el origen suele estar desconectada. El dinero es energía viva, es amor. Con la activación de estas pulseras, la Fuente (el Creador) activa tus filamentos de "ADN millonario" y tu capacidad natural de manifestación sin límites. Astar Katar canaliza esta energía desde la dimensión 33 para reconectar tu capacidad de atraer abundancia económica.'
},
  {
    sku: 'puls_1002', name: 'Pulsera ADN Millonario Modelo 2',
    short_description: 'Astar katar & la Fuente\nReconecta tus filamentos multidimensionales "de abundancia" y ayuda a atraer riqueza financiera',
    description: 'Activa tu capacidad natural de manifestación sin límites | Reconecta tus filamentos de ADN multidimensional de manifestación | Atrae abundancia económica desde la Fuente',
    activated_by: 'Astar katar & la Fuente',
    stone: 'Agatha y Obsidiana', category: 'Abundancia', price: 2900,
    image_url: '/images/pulseras/adn-millonario-2.png',
    learn_more: 'En esta 3ª densidad, la conexión consciente con el origen suele estar desconectada. El dinero es energía viva, es amor. Con la activación de estas pulseras, la Fuente (el Creador) activa tus filamentos de "ADN millonario" y tu capacidad natural de manifestación sin límites. Astar Katar canaliza esta energía desde la dimensión 33 para reconectar tu capacidad de atraer abundancia económica.'
  },
  {
    sku: 'puls_1003', name: 'Pulsera ADN Millonario Modelo 3',
    short_description: 'Astar katar & la Fuente\nReconecta tus filamentos multidimensionales "de abundancia" y ayuda a atraer riqueza financiera',
    description: 'Activa tu capacidad natural de manifestación sin límites | Reconecta tus filamentos de ADN multidimensional de manifestación | Atrae abundancia económica desde la Fuente',
    activated_by: 'Astar katar & la Fuente',
    stone: 'Agatha Naranja', category: 'Abundancia', price: 2900,
    image_url: '/images/pulseras/adn-millonario-3.png',
    learn_more: 'En esta 3ª densidad, la conexión consciente con el origen suele estar desconectada. El dinero es energía viva, es amor. Con la activación de estas pulseras, la Fuente (el Creador) activa tus filamentos de "ADN millonario" y tu capacidad natural de manifestación sin límites. Astar Katar canaliza esta energía desde la dimensión 33 para reconectar tu capacidad de atraer abundancia económica.'
},
  {
    sku: 'puls_1004', name: 'Pulsera ADN Millonario Modelo 4',
    short_description: 'Astar katar & la Fuente\nReconecta tus filamentos multidimensionales "de abundancia" y ayuda a atraer riqueza financiera',
    description: 'Activa tu capacidad natural de manifestación sin límites | Reconecta tus filamentos de ADN multidimensional de manifestación | Atrae abundancia económica desde la Fuente',
    activated_by: 'Astar katar & la Fuente',
    stone: 'Agatha y obsidiana', category: 'Abundancia', price: 2900,
    image_url: '/images/pulseras/adn-millonario-4.png',
    learn_more: 'En esta 3ª densidad, la conexión consciente con el origen suele estar desconectada. El dinero es energía viva, es amor. Con la activación de estas pulseras, la Fuente (el Creador) activa tus filamentos de "ADN millonario" y tu capacidad natural de manifestación sin límites. Astar Katar canaliza esta energía desde la dimensión 33 para reconectar tu capacidad de atraer abundancia económica.'
  },
  {
    sku: 'puls_1005', name: 'Pulsera ADN Millonario Modelo 5',
    short_description: 'Astar katar & la Fuente\nReconecta tus filamentos multidimensionales de "de abundancia" y ayuda a atraer riqueza',
    description: 'Activa tu capacidad natural de manifestación sin límites | Reconecta tus filamentos de ADN multidimensional de manifestación | Atrae abundancia económica desde la Fuente',
    activated_by: 'Astar katar & la Fuente',
    stone: 'Agatha Naranja', category: 'Abundancia', price: 2900,
    image_url: '/images/pulseras/adn-millonario-5.png',
    learn_more: 'En esta 3ª densidad, la conexión consciente con el origen suele estar desconectada. El dinero es energía viva, es amor. Con la activación de estas pulseras, la Fuente (el Creador) activa tus filamentos de "ADN millonario" y tu capacidad natural de manifestación sin límites. Astar Katar canaliza esta energía desde la dimensión 33 para reconectar tu capacidad de atraer abundancia económica.'
  },
  {
    sku: 'puls_1006', name: 'Pulsera ADN Millonario Modelo 6',
    short_description: 'Astar katar & la Fuente\nReconecta tus filamentos multidimensionales de "de abundancia" y ayuda a atraer riqueza',
    description: 'Activa tu capacidad natural de manifestación sin límites | Reconecta tus filamentos de ADN millonario | Atrae abundancia económica desde la Fuente',
    activated_by: 'Astar katar & la Fuente',
    stone: 'Agatha Naranja', category: 'Abundancia', price: 2900,
    image_url: '/images/pulseras/adn-millonario-6.png',
    learn_more: 'En esta 3ª densidad, la conexión consciente con el origen suele estar desconectada. El dinero es energía viva, es amor. Con la activación de estas pulseras, la Fuente (el Creador) activa tus filamentos de "ADN millonario" y tu capacidad natural de manifestación sin límites. Astar Katar canaliza esta energía desde la dimensión 33 para reconectar tu capacidad de atraer abundancia económica.'
  },
  {
    sku: 'puls_1007', name: 'Pulsera ADN Millonario Modelo 7',
    short_description: 'Astar katar & la Fuente\nReconecta tus filamentos multidimensionales de "de abundancia" y ayuda a atraer riqueza',
    description: 'Activa tu capacidad natural de manifestación sin límites | Reconecta tus filamentos de ADN millonario | Atrae abundancia económica desde la Fuente',
    activated_by: 'Astar katar & la Fuente',
    stone: 'Ágata y Obsidiana', category: 'Abundancia', price: 2900,
    image_url: '/images/pulseras/adn-millonario-7.png',
    learn_more: 'En esta 3ª densidad, la conexión consciente con el origen suele estar desconectada. El dinero es energía viva, es amor. Con la activación de estas pulseras, la Fuente (el Creador) activa tus filamentos de "ADN millonario" y tu capacidad natural de manifestación sin límites. Astar Katar canaliza esta energía desde la dimensión 33 para reconectar tu capacidad de atraer abundancia económica.'
  },
  {
    sku: 'puls_1008', name: 'Pulsera ADN Millonario Modelo 8',
    short_description: 'Astar katar & la Fuente\nReconecta tus filamentos multidimensionales de "de abundancia" y ayuda a atraer riqueza',
    description: 'Activa tu capacidad natural de manifestación sin límites | Reconecta tus filamentos de ADN millonario | Atrae abundancia económica desde la Fuente',
    activated_by: 'Astar katar & la Fuente',
    stone: 'Ágata Roja y Obsidiana', category: 'Abundancia', price: 2900,
    image_url: '/images/pulseras/adn-millonario-8.png',
    learn_more: 'En esta 3ª densidad, la conexión consciente con el origen suele estar desconectada. El dinero es energía viva, es amor. Con la activación de estas pulseras, la Fuente (el Creador) activa tus filamentos de "ADN millonario" y tu capacidad natural de manifestación sin límites. Astar Katar canaliza esta energía desde la dimensión 33 para reconectar tu capacidad de atraer abundancia económica.'
  },
  {
    sku: 'puls_1009', name: 'Pulsera ADN Millonario Jade Azul Grande',
    short_description: 'Astar katar & la Fuente\nReconecta tus filamentos multidimensionales "de abundancia" y ayuda a atraer riqueza financiera',
    description: 'Activa tu capacidad natural de manifestación sin límites | Reconecta tus filamentos de ADN multidimensional de manifestación | Atrae abundancia económica desde la Fuente',
    activated_by: 'Astar katar & la Fuente',
    stone: 'Jade Azul - Verde', category: 'Abundancia', price: 2900,
    image_url: '/images/pulseras/1009-adn-millonario-jade-azul-grande.jpeg',
    learn_more: 'En esta 3ª densidad, la conexión consciente con el origen suele estar desconectada. El dinero es energía viva, es amor. Con la activación de estas pulseras, la Fuente (el Creador) activa tus filamentos de "ADN millonario" y tu capacidad natural de manifestación sin límites. Astar Katar canaliza esta energía desde la dimensión 33 para reconectar tu capacidad de atraer abundancia económica.'
  },
  {
    sku: 'puls_1010', name: 'Pulsera ADN Millonario Jade Azul Chico',
    short_description: 'Astar katar & la Fuente\nReconecta tus filamentos multidimensionales "de abundancia" y ayuda a atraer riqueza financiera',
    description: 'Activa tu capacidad natural de manifestación sin límites | Reconecta tus filamentos de ADN multidimensional de manifestación | Atrae abundancia económica desde la Fuente',
    activated_by: 'Astar katar & la Fuente',
    stone: 'Jade Azul - Verde', category: 'Abundancia', price: 2900,
    image_url: '/images/pulseras/1010-adn-millonario-jade-azul-chico.jpeg',
    learn_more: 'En esta 3ª densidad, la conexión consciente con el origen suele estar desconectada. El dinero es energía viva, es amor. Con la activación de estas pulseras, la Fuente (el Creador) activa tus filamentos de "ADN millonario" y tu capacidad natural de manifestación sin límites. Astar Katar canaliza esta energía desde la dimensión 33 para reconectar tu capacidad de atraer abundancia económica.'
  },
  {
    sku: 'puls_1011', name: 'Pulsera Abundancia y Bienestar Amplio',
    short_description: 'Arcángel Jofiel, Arcángel Uriel, rayo dorado\nTransforma tus paradigmas de escasez y conecta con el flujo de abundancia',
    description: 'Activa tu capacidad natural de manifestación sin límites | Reconecta tus filamentos de ADN multidimensional de manifestación | Reprograma tu subconsciente para recibir',
    activated_by: 'Arcángel Jofiel, Arcángel Uriel, rayo dorado',
    stone: 'Agatha amarillo', category: 'Abundancia', price: 1600,
    image_url: '/images/pulseras/1011-abundancia-amplio.jpeg',
    learn_more: 'La vibración de la Abundancia: El Arcángel Jofiel dice: "La abundancia no es externa, es una vibración". Muchos han sido programados con frases como "el dinero no crece en los árboles", creando un sistema de creencias de escasez. La abundancia responde a quien está preparado para recibirla. Con estas pulseras, se aplica una "neurociencia espiritual" que transforma sus patrones mentales. No necesitas hacer más, necesitas ser más. Vibra en la certeza que tú mismo te permites.'
  },
  {
    sku: 'puls_1012', name: 'Pulsera Abundancia y Bienestar Fino',
    short_description: 'Arcángel Jofiel, Arcángel Uriel, rayo dorado\nTransforma tus paradigmas de escasez y conecta con el flujo de abundancia',
    description: 'Activa tu capacidad natural de manifestación sin límites | Reconecta tus filamentos de ADN multidimensional de manifestación | Reprograma tu subconsciente para recibir',
    activated_by: 'Arcángel Jofiel, Arcángel Uriel, rayo dorado',
    stone: 'Agatha amarillo', category: 'Abundancia', price: 1600,
    image_url: '/images/pulseras/1012-abundancia-fino.jpeg',
    learn_more: 'La vibración de la Abundancia: El Arcángel Jofiel dice: "La abundancia no es externa, es una vibración". Muchos han sido programados con frases como "el dinero no crece en los árboles", creando un sistema de creencias de escasez. La abundancia responde a quien está preparado para recibirla. Con estas pulseras, se aplica una "neurociencia espiritual" que transforma sus patrones mentales. No necesitas hacer más, necesitas ser más. Vibra en la certeza que tú mismo te permites.'
  },

  // === SEXUALIDAD (Mujeres, Hombres, Parejas) ===
  {
    sku: 'puls_1019', name: 'Pulsera Kundalini & Sexualidad Hombres',
    short_description: 'Despierta tu energía kundalini y potencia tu virilidad y fuerza vital',
    description: 'Despierta tu energía kundalini masculina | Potencia tu virilidad y fuerza vital | Limpia memorias antiguas y desbloquea emociones',
    activated_by: 'Sirianos, Lemurianos, Sekhmeth, María Magdala',
    stone: 'Amatista', category: 'Sexualidad', price: 1600,
    image_url: '/images/pulseras/1019-sexualidad-masculina.jpeg',
    learn_more: 'El despertar de la Kundalini: La energía kundalini es el misterio más antiguo del ser humano. Ha sido llamada Shakti dormida, la madre del despertar, la energía primordial. Es una fuerza vital latente enroscada en la base de tu columna, esperando ser reconocida para ascender. No es simbólica, es real y tangible; un fuego contenido.\n\nAl activarse y ascender por la columna (atravesando los siete chakras), limpia memorias antiguas, desbloquea emociones reprimidas y expande la percepción. Estas pulseras no te liberan de algo, sino que sacan tu conciencia de la prisión de la ilusión.'
  },
  {
    sku: 'puls_1020', name: 'Pulsera Kundalini & Sexualidad Mujeres',
    short_description: 'Despierta tu energía kundalini y potencia tu fuerza vital femenina',
    description: 'Despierta tu energía kundalini femenina | Potencia tu fuerza vital y sensualidad | Limpia memorias antiguas y libera emociones',
    activated_by: 'Sirianos, Lemurianos, Sekhmeth, María Magdala',
    stone: 'Amatista', category: 'Sexualidad', price: 1600,
    image_url: '/images/pulseras/1020-sexualidad-femenina.jpeg',
    learn_more: 'El despertar de la Kundalini: La energía kundalini es el misterio más antiguo del ser humano. Ha sido llamada Shakti dormida, la madre del despertar, la energía primordial. Es una fuerza vital latente enroscada en la base de tu columna, esperando ser reconocida para ascender. No es simbólica, es real y tangible; un fuego contenido.\n\nAl activarse y ascender por la columna (atravesando los siete chakras), limpia memorias antiguas, desbloquea emociones reprimidas y expande la percepción. Estas pulseras no te liberan de algo, sino que sacan tu conciencia de la prisión de la ilusión.'
  },
  {
    sku: 'puls_1021', name: 'Pulsera Kundalini & Sexualidad Parejas',
    short_description: 'Despierta la energía kundalini de pareja y potencia la conexión sagrada',
    description: 'Armoniza la energía sagrada masculina y femenina | Potencia la conexión íntima de pareja | Despierta la kundalini compartida',
    activated_by: 'Sirianos, Lemurianos, Sekhmeth, María Magdala',
    stone: 'Cuarzo Cristal', category: 'Sexualidad', price: 3100,
    image_url: '/images/pulseras/sexualidad-pareja-3.png',
    learn_more: 'El despertar de la Kundalini en pareja: La energía kundalini es el misterio más antiguo del ser humano. Cuando se activa en pareja, se genera una sinergia que potencia la conexión íntima y sagrada. La kundalini responde al amor, a la entrega y a la madurez interna. Utilicen estas pulseras con respeto para recibir su mayor beneficio.'
  },

  // === CONEXIÓN ARCTURIANA ===
  {
    sku: 'puls_1017', name: 'Pulsera Conexión Arcturiana Fina',
    short_description: 'Activada por seres estelares arcturianos',
    description: 'Transmite energía ascensional de la 7a y 9a dimensión | Facilita la apertura e integración de las dimensiones superiores de luz | Acelera tu proceso de ascensión personal | Mejora capacidad intelectual y cognitiva',
    activated_by: 'Seres estelares arcturianos',
    stone: 'Cuarzo Sandía de la India', category: 'Conexión Arcturiana', price: 2700,
    image_url: '/images/pulseras/1017-conexion-arcturiana-fina.jpeg',
    learn_more: 'La energía Omega proviene de la 7a y 9a dimensión. Su integración en tu campo energético permite una apertura multidimensional acelerada. Facilita el pensamiento abstracto y las capacidades cognitivas.'
  },
  {
    sku: 'puls_1018', name: 'Pulsera Conexión Arcturiana Amplio',
    short_description: 'Activada por seres estelares arcturianos',
    description: 'Transmite energía ascensional de la 7a y 9a dimensión | Facilita la apertura e integración de las dimensiones superiores de luz | Acelera tu proceso de ascensión personal | Mejora capacidad intelectual y cognitiva',
    activated_by: 'Seres estelares arcturianos',
    stone: 'Cuarzo Sandía de la India', category: 'Conexión Arcturiana', price: 2700,
    image_url: '/images/pulseras/1018-conexion-arcturiana-amplio.jpeg',
    learn_more: 'La energía Omega proviene de la 7a y 9a dimensión. Su integración en tu campo energético permite una apertura multidimensional acelerada. Facilita el pensamiento abstracto y las capacidades cognitivas.'
  },

  // === PROPÓSITO (Dones y Potencial del Alma) ===
  {
    sku: 'puls_1013', name: 'Pulsera Dones y Propósito del Alma Modelo 1',
    short_description: 'Activa tus dones dormidos y descubre tu propósito de alma',
    description: 'Activa tus dones y talentos dormidos | Descubre y alinea tu propósito de alma | Despierta capacidades psíquicas latentes',
    activated_by: 'Ashírion, Sekhmeth y Enki (creadores y guerreros cósmicos)',
    stone: 'Obsidiana y Dzi', category: 'Propósito', price: 2700,
    image_url: '/images/pulseras/dones-proposito-1.png',
    learn_more: 'El propósito del Alma: Activadas con vibraciones altísimas (más allá de la densidad 33). Algunos sentirán la energía muy fuerte, otros más sutil. Tu alma encarnó para vivir ciertas experiencias y desarrollar habilidades; estas pulseras apoyan la flexibilidad y adaptabilidad ante esos cambios, despertando con naturalidad tus capacidades psíquicas latentes.'
  },
  {
    sku: 'puls_1014', name: 'Pulsera Dones y Propósito del Alma Modelo 2',
    short_description: 'Activa tus dones dormidos y descubre tu propósito de alma',
    description: 'Activa tus dones y talentos dormidos | Descubre y alinea tu propósito de alma | Despierta capacidades psíquicas latentes',
    activated_by: 'Ashírion, Sekhmeth y Enki (creadores y guerreros cósmicos)',
    stone: 'Madera Petrificada y Obsidiana', category: 'Propósito', price: 2700,
    image_url: '/images/pulseras/dones-proposito-2.png',
    learn_more: 'El propósito del Alma: Activadas con vibraciones altísimas (más allá de la densidad 33). Algunos sentirán la energía muy fuerte, otros más sutil. Tu alma encarnó para vivir ciertas experiencias y desarrollar habilidades; estas pulseras apoyan la flexibilidad y adaptabilidad ante esos cambios, despertando con naturalidad tus capacidades psíquicas latentes.'
  },
  {
    sku: 'puls_1015', name: 'Pulsera Dones y Propósito del Alma Modelo 4',
    short_description: 'Activa tus dones dormidos y descubre tu propósito de alma',
    description: 'Activa tus dones y talentos dormidos | Descubre y alinea tu propósito de alma | Despierta capacidades psíquicas latentes',
    activated_by: 'Ashírion, Sekhmeth y Enki (creadores y guerreros cósmicos)',
    stone: 'Ágata Roja Esmerilada y Obsidiana', category: 'Propósito', price: 2700,
    image_url: '/images/pulseras/dones-proposito-4.png',
    learn_more: 'El propósito del Alma: Activadas con vibraciones altísimas (más allá de la densidad 33). Algunos sentirán la energía muy fuerte, otros más sutil. Tu alma encarnó para vivir ciertas experiencias y desarrollar habilidades; estas pulseras apoyan la flexibilidad y adaptabilidad ante esos cambios, despertando con naturalidad tus capacidades psíquicas latentes.'
  },
  {
    sku: 'puls_1016', name: 'Pulsera Dones y Propósito del Alma Modelo 3',
    short_description: 'Activa tus dones dormidos y descubre tu propósito de alma',
    description: 'Activa tus dones y talentos dormidos | Descubre y alinea tu propósito de alma | Despierta capacidades psíquicas latentes',
    activated_by: 'Ashírion, Sekhmeth y Enki (creadores y guerreros cósmicos)',
    stone: 'Cornalina y Obsidiana Mate', category: 'Propósito', price: 2700,
    image_url: '/images/pulseras/dones-proposito-3.png',
    learn_more: 'El propósito del Alma: Activadas con vibraciones altísimas (más allá de la densidad 33). Algunos sentirán la energía muy fuerte, otros más sutil. Tu alma encarnó para vivir ciertas experiencias y desarrollar habilidades; estas pulseras apoyan la flexibilidad y adaptabilidad ante esos cambios, despertando con naturalidad tus capacidades psíquicas latentes.'
  },

  // === SANACIÓN (Sanadores Cósmicos + Anclas de Sanadores Cósmicos) ===
  {
    sku: 'puls_1022', name: 'Pulsera Sanadores Cósmicos',
    short_description: 'Conecta con la tecnología espiritual de Sirio para tu sanación integral',
    description: 'Conecta con energía sanadora de Sirio A y B | Facilita la sanación integral cuerpo-mente-espíritu | Transmuta emociones negativas somatizadas',
    activated_by: 'Numo y Nikol, sanadores cósmicos de Sirio A y B',
    stone: 'Obsidiana', category: 'Sanación', price: 1200,
    image_url: '/images/pulseras/sanadores-cosmicos-1.png',
    learn_more: 'Tecnología Espiritual de Sirio: Numo y Nikol transmiten su energía y tecnología espiritual a través de estas pulseras. Es un anhelo profundo de estos seres ayudarles a sanar. Al usar estas pulseras, contactan con su verdadera esencia, la cual no es vivir con escasez ni enfermedad.'
  },
  {
    sku: 'puls_1025', name: 'Anclas Sanadores Cósmicos',
    short_description: 'Activadas por Numo y Nikol, sanadores cósmicos de Sirio A y B',
    description: 'Permiten atraer y anclar energías cósmicas sanadoras a un espacio | Un ancla crea espacio sanador de varios metros de radio',
    activated_by: 'Numo y Nikol, sanadores cósmicos de Sirio A y B',
    stone: null, category: 'Sanación', price: 300,
    image_url: '/images/pulseras/sanadores-cosmicos-2.png',
    learn_more: 'Activadas por Numo y Nikol, sanadores cósmicos de Sirio A y B. Ubicadas en forma de triángulo crea un vórtice de energía sanadora cósmica al interior del triángulo. Ideal para habitaciones y casas.\n\nKit de 3 anclas: $800 MXN'
  },

  // === PROTECCIÓN (Protección Energética, Extra-fuerte, Anclas de Protección) ===
  {
    sku: 'puls_1023', name: 'Protección Energética Extra Fuerte',
    short_description: 'Protección contra energías negativas activada por la maestra Pachita',
    description: 'Protección extra fuerte contra envidias y ataques energéticos | Limpieza del campo áurico | Escudo contra larvas energéticas y bajo astral',
    activated_by: 'Pachita (desde la 5ª densidad)',
    stone: 'Obsidiana Plateada', category: 'Protección', price: 1600,
    image_url: '/images/pulseras/proteccion-energetica-1.png',
    learn_more: 'El legado de Pachita: Pachita, eminente maestra chamánica multidimensional, activa estas piedras desde la 5ª densidad. Utiliza su energía específica y la de sus guías para brindar protección personal contra envidias, larvas energéticas y ataques del bajo astral.'
  },
  {
    sku: 'puls_1024', name: 'Anclas de Protección Energética',
    short_description: 'Protege tus espacios con vórtices de energía sagrada',
    description: 'Genera un campo de energía protectora en tus espacios | Estabiliza y protege contra cambios de frecuencia | Crea vórtices de protección en forma de triángulo',
    activated_by: 'Pachita y María Sabina (desde la 5ª densidad)',
    stone: 'Opalita', category: 'Protección', price: 300,
    image_url: '/images/pulseras/proteccion-energetica-2.png',
    learn_more: 'Vórtices de Protección: Al colocar estas anclas en las esquinas, se genera una estructura de vórtices que crea un campo de energía protectora en tu realidad. Esto es vital dado que los cambios de frecuencia del planeta pueden provocar inquietud o estrés; estas anclas estabilizan y protegen el lugar y a ti.\n\nKit de 4 anclas: $1,100 MXN'
  },
];

async function main() {
  const client = await pool.connect();
  try {
    // First deactivate old physical goods
    await client.query(
      "UPDATE products SET is_active = FALSE WHERE type = 'PHYSICAL_GOOD' AND product_sku LIKE 'phys_%'"
    );
    console.log('Deactivated old physical goods');

    for (const p of products) {
      const existing = await client.query(
        'SELECT id FROM products WHERE product_sku = $1',
        [p.sku]
      );

      if (existing.rows.length > 0) {
        await client.query(`
          UPDATE products SET
            name = $1, short_description = $2, description = $3,
            activated_by = $4, stone = $5, category = $6,
            price = $7, image_url = $8, learn_more = $9,
            is_active = TRUE, type = 'PHYSICAL_GOOD'
          WHERE product_sku = $10
        `, [p.name, p.short_description, p.description, p.activated_by, p.stone, p.category, p.price, p.image_url, p.learn_more, p.sku]);
        console.log(`Updated: ${p.name}`);
      } else {
        await client.query(`
          INSERT INTO products (product_sku, type, name, short_description, description, activated_by, stone, category, price, image_url, learn_more, is_active)
          VALUES ($1, 'PHYSICAL_GOOD', $2, $3, $4, $5, $6, $7, $8, $9, $10, TRUE)
        `, [p.sku, p.name, p.short_description, p.description, p.activated_by, p.stone, p.category, p.price, p.image_url, p.learn_more]);
        console.log(`Inserted: ${p.name}`);
      }
    }

    // Verify
    const result = await client.query(
      "SELECT id, product_sku, name, category, price FROM products WHERE type = 'PHYSICAL_GOOD' AND is_active = TRUE ORDER BY category, product_sku"
    );
    console.log('\n=== Active Physical Products ===');
    for (const row of result.rows) {
      console.log(`  [${row.category}] ${row.name} - $${row.price} MXN (${row.product_sku})`);
    }
    console.log(`\nTotal: ${result.rows.length} products`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(console.error);
