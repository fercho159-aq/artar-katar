-- ============================================
-- NUEVO TALLER: Sube a las Cámaras Cuánticas de Sanación Arcturianas
-- Del 27 de abril al 3 de mayo, 2026 — a distancia
-- ============================================

-- PASO 1: Desactivar el taller anterior (Yo Superior, terminó 19 de abril)
UPDATE products
SET is_active = FALSE
WHERE product_sku = 'wshop_008';

-- PASO 2: Insertar el nuevo taller
INSERT INTO products (
    product_sku,
    type,
    name,
    short_description,
    description,
    price,
    couple_price,
    workshop_date,
    workshop_status,
    is_active,
    image_url
)
VALUES (
    'wshop_009',
    'WORKSHOP',
    'SUBE A LAS CÁMARAS CUÁNTICAS DE SANACIÓN ARCTURIANAS',
    'Una puerta se abre… y tu alma ya sabe el camino. Sé llevado en tus cuerpos sutiles a la nave arcturiana Comando Atena para trabajar sanación física, emocional, liberación de bloqueos y proyección de tus metas.',
    'Una puerta se abre… y tu alma ya sabe el camino.

A través del portal interdimensional de Astar Katar serás llevado en tus cuerpos sutiles a la nave arcturiana, Comando Atena. En sus cámaras cuánticas de sanación trabajarás profundamente aquello que hoy tu alma te pide transformar: sanación física o emocional, liberación de bloqueos en tu vida actual, proyección de tus metas y objetivos personales, o cualquier otro tema que necesites a nivel del alma.

🌟 PUNTO ESPECIAL DE ESTA SEMANA
Activaremos tus cuarzos personales para que puedas acceder y comunicarte con su ser inteligente innato, abriendo un canal de conexión más profundo con estas herramientas de luz.

🌟 PREPARACIÓN Y ACTIVACIÓN
Serás preparado y activado energéticamente por el Arcángel Miguel y los siete arcángeles, apoyando tu apertura multidimensional personal.

🌟 MODALIDAD DEL TALLER
Durante 7 noches trabajarás a distancia desde tu casa con 5 meditaciones guiadas, canalizadas y activadas multidimensionalmente por Astar Katar / Frank Alexander. Nos comunicaremos y coordinaremos a través de un chat grupal de WhatsApp, creando un campo energético conjunto de transformación.

🌟 EXPERIENCIA PERSONAL
Cada participante vivirá este proceso según su sensibilidad:
• Algunos tendrán visiones claras y recuerdos conscientes de los planos superiores.
• Otros percibirán imágenes sutiles o sensaciones profundas.
• Algunos incluso quedarán dormidos durante las sesiones.

Sin importar cómo lo experimentes, TODOS recibirán los beneficios y podrán observar cambios reales en su vida diaria.

Fechas: 7 noches consecutivas, del 27 de abril al 3 de mayo
A partir de las 10 pm, hora México-centro (ver horarios internacionales al final)

Costo:
• Individual: $1,000 MXN (aprox 65 USD)
• En pareja: $1,500 MXN (aprox 97 USD) — incluye armonización de la relación
• En familia: hijos acompañados hasta 21 años participan GRATIS

Aparta tu lugar: en nuestro sitio web www.astar-katar.com/talleres
Info: WhatsApp (+52) 81.8113.9378

Horarios internacionales:
9 pm — EE.UU. Pacífico
10 pm — México Centro, Centroamérica
11 pm — Colombia, Perú, EE.UU. Centro
12 am — EE.UU. Este, Caribe
1 am — Chile, Argentina
España: sesión especial a las 22:00 hrs, hora local',
    1000.00,
    1500.00,
    '7 noches: del 27 de abril al 3 de mayo, 10 pm (hora México-centro)',
    'Abierto',
    TRUE,
    '/images/talleres/taller_ciclo_nocturno.jpeg'
);

-- PASO 3: Verificar cambios
SELECT id, product_sku, name, price, couple_price, workshop_date, workshop_status, is_active
FROM products
WHERE type = 'WORKSHOP';

-- ============================================
-- PASO 4: UPDATE (si el registro ya fue insertado y necesita actualizarse)
-- ============================================
UPDATE products
SET
    name = 'SUBE A LAS CÁMARAS CUÁNTICAS DE SANACIÓN ARCTURIANAS',
    short_description = 'Una puerta se abre… y tu alma ya sabe el camino. Sé llevado en tus cuerpos sutiles a la nave arcturiana Comando Atena para trabajar sanación física, emocional, liberación de bloqueos y proyección de tus metas.',
    description = 'Una puerta se abre… y tu alma ya sabe el camino.

A través del portal interdimensional de Astar Katar serás llevado en tus cuerpos sutiles a la nave arcturiana, Comando Atena. En sus cámaras cuánticas de sanación trabajarás profundamente aquello que hoy tu alma te pide transformar: sanación física o emocional, liberación de bloqueos en tu vida actual, proyección de tus metas y objetivos personales, o cualquier otro tema que necesites a nivel del alma.

🌟 PUNTO ESPECIAL DE ESTA SEMANA
Activaremos tus cuarzos personales para que puedas acceder y comunicarte con su ser inteligente innato, abriendo un canal de conexión más profundo con estas herramientas de luz.

🌟 PREPARACIÓN Y ACTIVACIÓN
Serás preparado y activado energéticamente por el Arcángel Miguel y los siete arcángeles, apoyando tu apertura multidimensional personal.

🌟 MODALIDAD DEL TALLER
Durante 7 noches trabajarás a distancia desde tu casa con 5 meditaciones guiadas, canalizadas y activadas multidimensionalmente por Astar Katar / Frank Alexander. Nos comunicaremos y coordinaremos a través de un chat grupal de WhatsApp, creando un campo energético conjunto de transformación.

🌟 EXPERIENCIA PERSONAL
Cada participante vivirá este proceso según su sensibilidad:
• Algunos tendrán visiones claras y recuerdos conscientes de los planos superiores.
• Otros percibirán imágenes sutiles o sensaciones profundas.
• Algunos incluso quedarán dormidos durante las sesiones.

Sin importar cómo lo experimentes, TODOS recibirán los beneficios y podrán observar cambios reales en su vida diaria.

Fechas: 7 noches consecutivas, del 27 de abril al 3 de mayo
A partir de las 10 pm, hora México-centro (ver horarios internacionales al final)

Costo:
• Individual: $1,000 MXN (aprox 65 USD)
• En pareja: $1,500 MXN (aprox 97 USD) — incluye armonización de la relación
• En familia: hijos acompañados hasta 21 años participan GRATIS

Aparta tu lugar: en nuestro sitio web www.astar-katar.com/talleres
Info: WhatsApp (+52) 81.8113.9378

Horarios internacionales:
9 pm — EE.UU. Pacífico
10 pm — México Centro, Centroamérica
11 pm — Colombia, Perú, EE.UU. Centro
12 am — EE.UU. Este, Caribe
1 am — Chile, Argentina
España: sesión especial a las 22:00 hrs, hora local',
    price = 1000.00,
    couple_price = 1500.00,
    workshop_date = '7 noches: del 27 de abril al 3 de mayo, 10 pm (hora México-centro)',
    workshop_status = 'Abierto',
    is_active = TRUE,
    image_url = '/images/talleres/taller_ciclo_nocturno.jpeg'
WHERE product_sku = 'wshop_009';
