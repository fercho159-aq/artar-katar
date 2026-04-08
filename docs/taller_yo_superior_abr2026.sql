-- ============================================
-- NUEVO TALLER: Conéctate con tu Yo Superior
-- Del 13 al 19 de abril, 2026 — a distancia
-- ============================================

-- PASO 1: Desactivar talleres anteriores que ya terminaron
-- wshop_005: Abundancia CDMX (7 de marzo, 2026)
-- wshop_007: El Amor en Pareja (16-22 de marzo, 2026)
UPDATE products
SET is_active = FALSE
WHERE product_sku IN ('wshop_005', 'wshop_007');

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
    'wshop_008',
    'WORKSHOP',
    'CONÉCTATE CON TU YO SUPERIOR',
    'Liberar la conexión con tu Yo Superior y comenzar a manejar tu vida conscientemente bajo su guía y protección, es fundamental para poder incorporar y aprovechar las nuevas energías ascensionales cósmicas.',
    'Liberar la conexión con tu Yo Superior y comenzar a manejar tu vida conscientemente bajo su guía y protección, es fundamental para poder incorporar y aprovechar las nuevas energías ascensionales cósmicas, que actualmente están llegando a nuestra tierra desde las altas dimensiones de luz.

Tu Yo Superior es quien mejor te conoce en profundidad, tus vidas pasadas, situación actual y tus potenciales futuros, tus líneas de tiempo paralelas, tus aciertos, así como tus desafíos diarios y también tu sufrimiento profundo, por más oculto que esté.

Esta apertura y comunicación con tu Yo Superior es lo que estaremos activando intensamente en este ciclo de activación intensiva. Asimismo, seremos trabajados por los seres estelares en las cámaras cuánticas de sanación cósmicas, en las naves, cada uno de acuerdo con sus requerimientos y proceso personal.

Cada noche Astar Katar te conectará energéticamente a su portal interdimensional, por donde serás llevado en cuerpos sutiles a la nave estelar y se abrirá la conexión con tu Yo Superior.

Recibirás meditaciones guiadas canalizadas y multidimensionalmente activadas para este evento. Nos coordinamos entre todos los participantes por medio de un chat grupal de WhatsApp.

Cada uno experimenta estas activaciones de acuerdo con su grado de sensibilidad personal: muchos tendrán recuerdos detallados de lo vivido, otros recordarán imágenes escurridizas mientras que otros se quedarán profundamente dormidos, pudiendo recibir los mensajes en sueños u ocurrencias durante su día. Sin embargo, TODOS serán trabajados y recibirán los beneficios correspondientes.

Fechas: 7 noches consecutivas, del 13 al 19 de abril
A partir de las 10 pm, hora México-centro (ver horarios internacionales al final)

Costo:
• Individual: $1,000 MXN (aprox 65 USD)

Aparta tu lugar: en nuestro sitio web www.astar-katar.com/talleres
Info: WhatsApp (+52) 81.8113.9378

Horarios internacionales:
9 pm — EE.UU. Pacífico
10 pm — EE.UU. Montaña, México Centro, Centroamérica
11 pm — EE.UU. Centro, Colombia, Perú, Ecuador
12 am — EE.UU. Este, Caribe, Venezuela, Bolivia
1 am — Chile, Argentina, Uruguay
España: sesión especial a las 22:00 hrs, hora local',
    1000.00,
    NULL,
    '7 noches: del 13 al 19 de abril, 10 pm (hora México-centro)',
    'Abierto',
    TRUE,
    '/images/talleres/taller-abril.jpeg'
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
    name = 'CONÉCTATE CON TU YO SUPERIOR',
    short_description = 'Liberar la conexión con tu Yo Superior y comenzar a manejar tu vida conscientemente bajo su guía y protección, es fundamental para poder incorporar y aprovechar las nuevas energías ascensionales cósmicas.',
    description = 'Liberar la conexión con tu Yo Superior y comenzar a manejar tu vida conscientemente bajo su guía y protección, es fundamental para poder incorporar y aprovechar las nuevas energías ascensionales cósmicas, que actualmente están llegando a nuestra tierra desde las altas dimensiones de luz.

Tu Yo Superior es quien mejor te conoce en profundidad, tus vidas pasadas, situación actual y tus potenciales futuros, tus líneas de tiempo paralelas, tus aciertos, así como tus desafíos diarios y también tu sufrimiento profundo, por más oculto que esté.

Esta apertura y comunicación con tu Yo Superior es lo que estaremos activando intensamente en este ciclo de activación intensiva. Asimismo, seremos trabajados por los seres estelares en las cámaras cuánticas de sanación cósmicas, en las naves, cada uno de acuerdo con sus requerimientos y proceso personal.

Cada noche Astar Katar te conectará energéticamente a su portal interdimensional, por donde serás llevado en cuerpos sutiles a la nave estelar y se abrirá la conexión con tu Yo Superior.

Recibirás meditaciones guiadas canalizadas y multidimensionalmente activadas para este evento. Nos coordinamos entre todos los participantes por medio de un chat grupal de WhatsApp.

Cada uno experimenta estas activaciones de acuerdo con su grado de sensibilidad personal: muchos tendrán recuerdos detallados de lo vivido, otros recordarán imágenes escurridizas mientras que otros se quedarán profundamente dormidos, pudiendo recibir los mensajes en sueños u ocurrencias durante su día. Sin embargo, TODOS serán trabajados y recibirán los beneficios correspondientes.

Fechas: 7 noches consecutivas, del 13 al 19 de abril
A partir de las 10 pm, hora México-centro (ver horarios internacionales al final)

Costo:
• Individual: $1,000 MXN (aprox 65 USD)

Aparta tu lugar: en nuestro sitio web www.astar-katar.com/talleres
Info: WhatsApp (+52) 81.8113.9378

Horarios internacionales:
9 pm — EE.UU. Pacífico
10 pm — EE.UU. Montaña, México Centro, Centroamérica
11 pm — EE.UU. Centro, Colombia, Perú, Ecuador
12 am — EE.UU. Este, Caribe, Venezuela, Bolivia
1 am — Chile, Argentina, Uruguay
España: sesión especial a las 22:00 hrs, hora local',
    price = 1000.00,
    couple_price = NULL,
    workshop_date = '7 noches: del 13 al 19 de abril, 10 pm (hora México-centro)',
    workshop_status = 'Abierto',
    image_url = '/images/talleres/taller-abril.jpeg'
WHERE product_sku = 'wshop_008';
