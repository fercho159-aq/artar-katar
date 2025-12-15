-- ============================================
-- SCRIPT DE ACTUALIZACIÓN DE PRODUCTOS
-- Agregar campos adicionales y actualizar datos
-- ============================================

-- PASO 1: Agregar nuevas columnas a la tabla products
ALTER TABLE products ADD COLUMN IF NOT EXISTS short_description TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS activated_by TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS stone VARCHAR(200);
ALTER TABLE products ADD COLUMN IF NOT EXISTS learn_more TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS category VARCHAR(100);

-- ============================================
-- PASO 2: Actualizar cada producto con su información
-- ============================================

-- A. ENERGÍA VITAL Y SEXUALIDAD (KUNDALINI)
-- ============================================

-- Pulsera KUNDALINI & SEXUALIDAD (Mujeres)
UPDATE products SET 
    short_description = 'Despierta tu energía kundalini y potencia tu fuerza vital femenina',
    activated_by = 'Sirianos, Lemurianos, Sekhmeth, María Magdala',
    stone = 'Amatista',
    category = 'Kundalini',
    learn_more = 'El despertar de la Kundalini: La energía kundalini es el misterio más antiguo del ser humano. Ha sido llamada Shakti dormida, la madre del despertar, la energía primordial. Es una fuerza vital latente enroscada en la base de tu columna, esperando ser reconocida para ascender. No es simbólica, es real y tangible; un fuego contenido.

Al activarse y ascender por la columna (atravesando los siete chakras), limpia memorias antiguas, desbloquea emociones reprimidas y expande la percepción. No es un proceso cómodo ni superficial; es la muerte simbólica del ego y el desmantelamiento de la falsedad acumulada.

Estas pulseras no te liberan de algo, sino que sacan tu conciencia de la prisión de la ilusión. La kundalini responde al amor, a la entrega y a la madurez interna. Utilicen estas pulseras con respeto para recibir su mayor beneficio.'
WHERE name LIKE '%KUNDALINI%Mujeres%' OR name LIKE '%KUNDALINI%MUJERES%';

-- Pulsera KUNDALINI & SEXUALIDAD (Hombres)
UPDATE products SET 
    short_description = 'Despierta tu energía kundalini y potencia tu virilidad y fuerza vital',
    activated_by = 'Sirianos, Lemurianos, Sekhmeth, María Magdala',
    stone = 'Amatista',
    category = 'Kundalini',
    learn_more = 'El despertar de la Kundalini: La energía kundalini es el misterio más antiguo del ser humano. Ha sido llamada Shakti dormida, la madre del despertar, la energía primordial. Es una fuerza vital latente enroscada en la base de tu columna, esperando ser reconocida para ascender. No es simbólica, es real y tangible; un fuego contenido.

Al activarse y ascender por la columna (atravesando los siete chakras), limpia memorias antiguas, desbloquea emociones reprimidas y expande la percepción. No es un proceso cómodo ni superficial; es la muerte simbólica del ego y el desmantelamiento de la falsedad acumulada.

Estas pulseras no te liberan de algo, sino que sacan tu conciencia de la prisión de la ilusión. La kundalini responde al amor, a la entrega y a la madurez interna. Utilicen estas pulseras con respeto para recibir su mayor beneficio.'
WHERE name LIKE '%KUNDALINI%Hombres%' OR name LIKE '%KUNDALINI%HOMBRES%';

-- B. INTELECTO Y MENTE
-- ============================================

-- Pulsera EINSTEIN
UPDATE products SET 
    short_description = 'Potencia tu capacidad intelectual y cognitiva con energía cuántica Omega',
    activated_by = 'Arcturianos de 9ª densidad',
    stone = 'Cuarzo Sandía de la India',
    category = 'Intelecto',
    learn_more = 'Energía Cuántica Omega: La manera en que Einstein logró trascender la lógica común es la imagen de lo que la energía cuántica Omega transmite. Los seres estelares arcturianos activaron cada esfera individualmente con un rayo de luz.

Esta energía activa todas las áreas del cerebro por igual (lógico, creativo, comunicacional). En situaciones de gran exigencia, puedes "hablarle" mentalmente a la energía de la pulsera para pedir apoyo en la solución de un problema específico, especialmente antes de dormir, y observar las ideas al despertar.'
WHERE name LIKE '%EINSTEIN%';

-- C. ABUNDANCIA Y MANIFESTACIÓN
-- ============================================

-- Pulsera ABUNDANCIA Y BIENESTAR
UPDATE products SET 
    short_description = 'Transforma tus paradigmas de escasez y conecta con el flujo de abundancia',
    activated_by = 'Arcángeles Uriel, Jofiel y el maestro Yashua',
    stone = 'Ágata Amarilla',
    category = 'Abundancia',
    learn_more = 'La vibración de la Abundancia: El Arcángel Jofiel dice: "La abundancia no es externa, es una vibración". Muchos han sido programados con frases como "el dinero no crece en los árboles", creando un sistema de creencias de escasez.

La abundancia responde a quien está preparado para recibirla. Con estas pulseras, se aplica una "neurociencia espiritual" que transforma sus patrones mentales. No necesitas hacer más, necesitas ser más. Vibra en la certeza que tú mismo te permites.'
WHERE name LIKE '%ABUNDANCIA%BIENESTAR%' OR name LIKE '%ABUNDANCIA Y BIENESTAR%';

-- Pulsera ADN MILLONARIO
UPDATE products SET 
    short_description = 'Reconecta tus filamentos de ADN de abundancia y atrae riqueza financiera',
    activated_by = 'Astar Katar con la energía de la Fuente',
    stone = 'Ágata Naranja',
    category = 'Abundancia',
    learn_more = 'Reconexión con la Fuente: En esta 3ª densidad, la conexión consciente con el origen suele estar desconectada. El dinero es energía viva, es amor. Con la activación de estas pulseras, la Fuente (el Creador) activa tus filamentos de "ADN millonario" y tu capacidad natural de manifestación sin límites. Astar Katar canaliza esta energía desde la dimensión 33 para reconectar tu capacidad de atraer abundancia económica.'
WHERE name LIKE '%ADN MILLONARIO%' OR name LIKE '%MILLONARIO%';

-- D. MISIÓN DE VIDA Y DONES
-- ============================================

-- Pulsera ACTIVACIÓN DONES y "PROPÓSITO DE ALMA"
UPDATE products SET 
    short_description = 'Activa tus dones dormidos y descubre tu propósito de alma',
    activated_by = 'Ashírion, Sekhmeth y Enki (creadores y guerreros cósmicos)',
    stone = 'Jade Naranja y Obsidiana',
    category = 'Propósito',
    learn_more = 'El propósito del Alma: Activadas con vibraciones altísimas (más allá de la densidad 33). Algunos sentirán la energía muy fuerte, otros más sutil. Tu alma encarnó para vivir ciertas experiencias y desarrollar habilidades; estas pulseras apoyan la flexibilidad y adaptabilidad ante esos cambios, despertando con naturalidad tus capacidades psíquicas latentes.'
WHERE name LIKE '%DONES%' OR name LIKE '%PROPÓSITO%ALMA%';

-- E. SANACIÓN
-- ============================================

-- Pulsera SANADORES CÓSMICOS
UPDATE products SET 
    short_description = 'Conecta con la tecnología espiritual de Sirio para tu sanación integral',
    activated_by = 'Numo y Nikol (seres estelares sanadores de Sirio A y B)',
    stone = 'Piedra de Luna',
    category = 'Sanación',
    learn_more = 'Tecnología Espiritual de Sirio: Numo y Nikol transmiten su energía y tecnología espiritual a través de estas pulseras. Es un anhelo profundo de estos seres ayudarles a sanar. Al usar estas pulseras, contactan con su verdadera esencia, la cual no es vivir con escasez ni enfermedad. La ausencia de abundancia y las emociones negativas pueden somatizarse en el cuerpo; estas pulseras ayudan a sanar esos patrones desde la raíz.'
WHERE name LIKE '%SANADORES%' OR name LIKE '%SANADORES CÓSMICOS%';

-- F. PROTECCIÓN Y LIMPIEZA
-- ============================================

-- Pulsera PROTECCIÓN ENERGÉTICA
UPDATE products SET 
    short_description = 'Protección contra energías negativas activada por la maestra Pachita',
    activated_by = 'Pachita (desde la 5ª densidad)',
    stone = 'Piedra Volcánica',
    category = 'Protección',
    learn_more = 'El legado de Pachita: Pachita, eminente maestra chamánica multidimensional, activa estas pulseras desde la 5ª densidad. Utiliza su energía específica y la de sus guías para brindar protección personal contra envidias, larvas energéticas y ataques del bajo astral.'
WHERE name LIKE '%PROTECCIÓN ENERGÉTICA%' AND name NOT LIKE '%ANCLAS%' AND name NOT LIKE '%Espacios%';

-- ANCLAS DE PROTECCIÓN ENERGÉTICA (Para Espacios)
UPDATE products SET 
    short_description = 'Protege tus espacios con vórtices de energía sagrada',
    activated_by = 'Pachita y María Sabina (desde la 5ª densidad)',
    stone = 'Obsidiana',
    category = 'Protección',
    learn_more = 'Vórtices de Protección: Al colocar estas anclas en las esquinas, se genera una estructura de vórtices que crea un campo de energía protectora en tu realidad. Esto es vital dado que los cambios de frecuencia del planeta pueden provocar inquietud o estrés; estas anclas estabilizan y protegen el lugar y a ti.'
WHERE name LIKE '%ANCLAS%' OR name LIKE '%Espacios%';

-- ============================================
-- VERIFICAR ACTUALIZACIONES
-- ============================================
SELECT id, name, short_description, activated_by, stone, category FROM products WHERE type = 'PHYSICAL_GOOD';
