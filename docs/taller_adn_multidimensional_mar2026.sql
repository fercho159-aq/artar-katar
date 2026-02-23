-- ============================================
-- NUEVO TALLER: Semana de Activación de tu ADN Multidimensional
-- Del 2 al 8 de marzo, 2026 — a distancia
-- ============================================

-- PASO 1: Desactivar el Ciclo de Activación Nocturna (ya terminó el 22 de feb)
UPDATE products
SET is_active = FALSE
WHERE product_sku = 'wshop_004';

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
    'wshop_006',
    'WORKSHOP',
    'SEMANA DE ACTIVACIÓN DE TU ADN MULTIDIMENSIONAL',
    'A través del portal interdimensional de Astar Katar trabajaremos en las cámaras cuánticas de sanación sirianas, con el rayo dorado de arcángel Jofiel, y la activación de tu ADN multidimensional.',
    'A través del portal interdimensional de Astar Katar trabajaremos en las cámaras cuánticas de sanación sirianas, con el rayo dorado de arcángel Jofiel, y la activación de tu ADN multidimensional. Facilitado por arcángel Gabriel, serás preparado para recibir un mensaje personal multidimensional de la Fuente para tu evolución de alma. Será una semana de intenso trabajo personal.

Recibirás 4 meditaciones canalizadas y activadas multidimensionalmente por Astar Katar para el taller, con las cuales iniciaremos el trabajo nocturno. Cada noche Astar Katar y los seres cósmicos de luz te visitarán y te llevarán en cuerpos sutiles a las naves, para trabajar contigo de acuerdo con tus necesidades personales.

Experimentarás el taller de acuerdo con tu sensibilidad personal. Muchos tendrán vívidos recuerdos de sus experiencias nocturnas, otros retendrán imágenes furtivas mientras que otros quedarán profundamente dormidos. Sin embargo, TODOS serán trabajados y recibirán los beneficios correspondientes.

En familia: hijos acompañados hasta 21 años participan gratis.

Horarios internacionales:
8 pm — EE.UU. Pacífico
9 pm — EE.UU. Montaña
10 pm — México Centro, EE.UU. Centro, Centroamérica
11 pm — Colombia, Perú, EE.UU. Este
1 am — Argentina, Chile
España: sesión especial, 22:00 hrs, hora local',
    1000.00,
    1500.00,
    '7 sesiones: del 2 al 8 de marzo, 22:00 hrs (hora México-centro)',
    'Abierto',
    TRUE,
    '/images/talleres/taller_adn_multidimensional.jpeg'
);

-- PASO 3: Verificar cambios
SELECT id, product_sku, name, price, couple_price, workshop_date, workshop_status, is_active
FROM products
WHERE type = 'WORKSHOP';
