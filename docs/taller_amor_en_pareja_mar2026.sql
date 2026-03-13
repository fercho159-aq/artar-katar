-- ============================================
-- NUEVO TALLER: El Amor en Pareja
-- Del 16 al 22 de marzo, 2026 — a distancia
-- ============================================

-- PASO 1: Desactivar el taller de ADN Multidimensional (ya terminó el 8 de marzo)
UPDATE products
SET is_active = FALSE
WHERE product_sku = 'wshop_006';

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
    'wshop_007',
    'WORKSHOP',
    'EL AMOR EN PAREJA',
    'Sea para profundizar tu relación de pareja ya existente o para atraer una nueva relación de amor duradera, en plenitud y compenetración mutua.',
    'Sea para profundizar tu relación de pareja ya existente o para atraer una nueva relación de amor duradera, en plenitud y compenetración mutua...

Trabajaremos con el Arcángel Chamuel y su rayo rosado, con el arcángel Gabriel, con el Maestro Yashua, Madre Divina Cósmica y con los seres estelares arcturianos con su tecnología cósmica de cámaras cuánticas de sanación.

En este nuevo ciclo de activación nocturna, impartido a distancia por Frank Alexander/Astar Katar, recibirás una serie de meditaciones guiadas canalizadas y activadas multidimensionalmente que te conectarán cada noche con las dimensiones y seres espirituales. Astar Katar, junto con los seres estelares te llevarán en cuerpos sutiles a la nave arcturiana con su tecnología de sanación cuántica, donde las conexiones y activaciones cósmicas se llevarán a cabo.

Será una semana de intensivo trabajo y activación que te beneficiará toda la vida, desde tus programas de alma más profundos. Nos coordinaremos entre todos los participantes por medio de un chat grupal de WhatsApp.

Cada participante experimentará estas activaciones de acuerdo con su grado de sensibilidad personal: Muchos tendrán vivencias nítidas y claras de lo ocurrido, otros retendrán imágenes furtivas mientras que otros se quedarán profundamente dormidos. Sin embargo, TODOS recibirán las activaciones a nivel de alma correspondientes.

Fechas: 7 noches, del 16 al 22 de marzo
A partir de las 10 pm, hora México-centro (ver horarios internacionales al final)

Costo:
• Individual: $1,000 MXN (aprox 60 USD)
• En pareja: $1,500 MXN (aprox 90 USD)

Aparta tu lugar: en nuestro sitio web www.astar-katar.com/talleres
Info: WhatsApp (+52) 81.8113.9378

Horarios internacionales:
8 pm — EE.UU. Pacífico
9 pm — EE.UU. Montaña
10 pm — México Centro, EE.UU. Centro, Centroamérica
11 pm — Colombia, Perú, EE.UU. Este
1 am — Argentina, Chile
España: sesión especial a las 22:00 hrs, hora local',
    1000.00,
    1500.00,
    '7 noches: del 16 al 22 de marzo, 22:00 hrs (hora México-centro)',
    'Abierto',
    TRUE,
    '/images/talleres/taller_amor_en_pareja.jpeg'
);

-- PASO 3: Verificar cambios
SELECT id, product_sku, name, price, couple_price, workshop_date, workshop_status, is_active
FROM products
WHERE type = 'WORKSHOP';

-- ============================================
-- PASO 4: UPDATE (si el registro ya fue insertado y necesita actualizarse)
-- ============================================
UPDATE products
SET description = 'Sea para profundizar tu relación de pareja ya existente o para atraer una nueva relación de amor duradera, en plenitud y compenetración mutua...

Trabajaremos con el Arcángel Chamuel y su rayo rosado, con el arcángel Gabriel, con el Maestro Yashua, Madre Divina Cósmica y con los seres estelares arcturianos con su tecnología cósmica de cámaras cuánticas de sanación.

En este nuevo ciclo de activación nocturna, impartido a distancia por Frank Alexander/Astar Katar, recibirás una serie de meditaciones guiadas canalizadas y activadas multidimensionalmente que te conectarán cada noche con las dimensiones y seres espirituales. Astar Katar, junto con los seres estelares te llevarán en cuerpos sutiles a la nave arcturiana con su tecnología de sanación cuántica, donde las conexiones y activaciones cósmicas se llevarán a cabo.

Será una semana de intensivo trabajo y activación que te beneficiará toda la vida, desde tus programas de alma más profundos. Nos coordinaremos entre todos los participantes por medio de un chat grupal de WhatsApp.

Cada participante experimentará estas activaciones de acuerdo con su grado de sensibilidad personal: Muchos tendrán vivencias nítidas y claras de lo ocurrido, otros retendrán imágenes furtivas mientras que otros se quedarán profundamente dormidos. Sin embargo, TODOS recibirán las activaciones a nivel de alma correspondientes.

Fechas: 7 noches, del 16 al 22 de marzo
A partir de las 10 pm, hora México-centro (ver horarios internacionales al final)

Costo:
• Individual: $1,000 MXN (aprox 60 USD)
• En pareja: $1,500 MXN (aprox 90 USD)

Aparta tu lugar: en nuestro sitio web www.astar-katar.com/talleres
Info: WhatsApp (+52) 81.8113.9378

Horarios internacionales:
8 pm — EE.UU. Pacífico
9 pm — EE.UU. Montaña
10 pm — México Centro, EE.UU. Centro, Centroamérica
11 pm — Colombia, Perú, EE.UU. Este
1 am — Argentina, Chile
España: sesión especial a las 22:00 hrs, hora local'
WHERE product_sku = 'wshop_007';
