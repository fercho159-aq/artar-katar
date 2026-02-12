-- ============================================
-- NUEVO TALLER: Ciclo de Activación Intensiva Nocturna a Distancia
-- Febrero 16-22, 2026
-- ============================================

-- PASO 1: Desactivar los dos talleres anteriores que ya pasaron
-- ID 31: taller_5ta_dimension_enero_2025 - "MANIFIESTA TU REALIDAD DESDE LA 5TA DIMENSIÓN"
-- ID 39: taller_merkabah_feb_2026 - "APRENDE A USAR TU MERKABAH Y VIAJA A LAS NAVES DE LUZ"
UPDATE products
SET is_active = FALSE
WHERE id IN (31, 39);

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
    'wshop_004',
    'WORKSHOP',
    'Ciclo de Activación Intensiva Nocturna a Distancia',
    'Trabajaremos con La Fuente, Dios, con Arcángeles Gabriel, Miguel y Rafael y subiremos a las naves, a las cámaras cuánticas de sanación pleyadianas.',
    'Trabajaremos con La Fuente, Dios, con Arcángeles Gabriel, Miguel y Rafael y subiremos a las naves, a las cámaras cuánticas de sanación pleyadianas...

Nos asistirán para cocrear salud, bienestar, todo lo que nosotros deseamos dentro de nuestro interior, sin colocarnos ninguna máscara, ningún paradigma aprendido de nuestra infancia, sino que realmente lo que nuestra alma desea.

Descubrirás que cada vez que tú percibes algo fuera, algo te incomoda, es porque habita en ti, porque es como un espejo, es un reflejo de ti, sí, de ti mismo.

Trabajaremos con varias meditaciones guiadas canalizadas y activadas multidimensionalmente por Astar Katar para este taller. Cada noche te visitaremos en astral y te llevaremos en cuerpos sutiles a la nave pleyadiana donde los trabajos se llevarán a cabo. Nos coordinaremos por chat grupal de WhatsApp entre los participantes.

Cada uno experimentará estas sesiones de acuerdo con su grado de sensibilidad personal. Muchos tendrán vivos recuerdos de sus experiencias, otros retendrán imágenes furtivas mientras que otros se quedarán dormidos durante las sesiones. Sin embargo, TODOS serán trabajados y recibirán los beneficios correspondientes.

En familia: hijos acompañados hasta 21 años participan gratis.

Horarios internacionales:
8 pm — EE.UU. Pacífico
9 pm — EE.UU. Montaña
10 pm — México Centro, EE.UU. Centro, Centroamérica
11 pm — EE.UU. Este, Colombia, Perú
12 am — Venezuela, Caribe, Bolivia
1 am — Chile, Argentina, Uruguay',
    1000.00,
    1500.00,
    '7 noches consecutivas: del 16 al 22 de febrero, 10 pm (hora México-centro)',
    'Abierto',
    TRUE,
    'https://images.unsplash.com/photo-1532190795157-3f983fb7fa3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxzcGlyaXR1YWwlMjBsZWFybmluZ3xlbnwwfHx8fDE3NjQ2OTIxNDB8MA&ixlib=rb-4.1.0&q=80&w=1080'
);

-- PASO 3: Verificar cambios
SELECT id, product_sku, name, price, couple_price, workshop_date, workshop_status, is_active
FROM products
WHERE type = 'WORKSHOP';
