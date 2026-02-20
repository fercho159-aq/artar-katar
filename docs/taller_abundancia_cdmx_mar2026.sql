-- ============================================
-- NUEVO TALLER: Activación Multidimensional de tu Abundancia en CDMX
-- Sábado 7 de marzo, 2026
-- ============================================

-- NOTA: wshop_004 (Ciclo Nocturno) se mantiene activo junto con este nuevo taller

-- PASO 1: Insertar el nuevo taller
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
    'wshop_005',
    'WORKSHOP',
    'ACTIVACIÓN MULTIDIMENSIONAL DE TU ABUNDANCIA',
    'Taller presencial en CDMX. Astar Katar instalará nuevos códigos y frecuencias de éxito y abundancia multidimensionales en tus células energéticamente.',
    'Taller de activación presencial a través del portal interdimensional de Astar Katar.

Astar Katar instalará nuevos códigos y frecuencias de éxito y abundancia multidimensionales en tus células energéticamente. Cambiaremos tu vibración, modificaremos todos esos patrones limitantes que puedas tener, para que el universo responda a lo que realmente deseas para ti.

Trabajarás con tus raíces energéticas profundas a partir de las cuales puedes crear todo lo que deseas, en tu trabajo, en tus proyectos, en tu abundancia financiera personal.

El dinero no está fuera para que lo persigas, sino adentro, esperando que lo recibas.

Lugar: Mandala, Centro de Arte Decorativo, Av Coyoacán 1530, Colonia del Valle-Sur, Cd de México
Horario: de 10:00 a 13:30 hrs',
    600.00,
    NULL,
    'Sábado 7 de marzo, 10:00 – 13:30 hrs',
    'Abierto',
    TRUE,
    '/images/talleres/taller_abundancia_cdmx.jpg'
);

-- PASO 3: Verificar cambios
SELECT id, product_sku, name, price, couple_price, workshop_date, workshop_status, is_active
FROM products
WHERE type = 'WORKSHOP';
