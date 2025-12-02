-- ============================================
-- SCRIPT DE INSERCIÓN DE DATOS (SEED)
-- ============================================
-- Este script puebla la base de datos con los datos iniciales de la aplicación,
-- incluyendo meditaciones, talleres, productos físicos y la suscripción.
-- Ejecutar después de haber creado la estructura de tablas.

-- Limpiar tablas antes de insertar (opcional, útil para reinicios)
-- CUIDADO: Esto borrará todos los datos existentes en estas tablas.
-- Descomentar solo si se desea un reinicio completo.
-- DELETE FROM order_items;
-- DELETE FROM orders;
-- DELETE FROM subscriptions;
-- DELETE FROM products;

-- Insertar Meditaciones
INSERT INTO products (product_sku, type, name, description, price, meditation_duration, is_active, image_url) VALUES
('med_001', 'MEDITATION', 'Meditación de Anclaje a Tierra', 'Conecta con la energía de Gaia y encuentra tu centro.', 40.00, '15 min', TRUE, 'https://images.unsplash.com/photo-1609718561976-d52836e625cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxzZXJlbmUlMjBtZWRpdGF0aW9ufGVufDB8fHx8MTc2NDYzNzYxMnww&ixlib=rb-4.1.0&q=80&w=1080'),
('med_002', 'MEDITATION', 'Activación del Corazón Cristalino', 'Abre tu corazón a la frecuencia del amor incondicional.', 40.00, '25 min', TRUE, 'https://images.unsplash.com/photo-1532979772520-f2763956cce0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxjYWxtJTIwbGFrZXxlbnwwfHx8fDE3NjQ2NTUwMjR8MA&ixlib=rb-4.1.0&q=80&w=1080'),
('med_003', 'MEDITATION', 'Viaje al Templo de Sanación', 'Recibe sanación y guía de los maestros ascendidos.', 40.00, '30 min', TRUE, 'https://images.unsplash.com/photo-1532190795157-3f983fb7fa3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxzcGlyaXR1YWwlMjBsZWFybmluZ3xlbnwwfHx8fDE3NjQ2OTIxNDB8MA&ixlib=rb-4.1.0&q=80&w=1080'),
('med_004', 'MEDITATION', 'Limpieza Energética Profunda', 'Libera energías densas y revitaliza tu campo áurico.', 40.00, '20 min', TRUE, 'https://images.unsplash.com/photo-1560287810-1c89fede7218?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxzcGlyaXR1YWwlMjBhY3RpdmF0aW9ufGVufDB8fHx8MTc2NDY5MjE0MHww&ixlib=rb-4.1.0&q=80&w=1080'),
('med_005', 'MEDITATION', 'Conexión con tu Llama Gemela', 'Armoniza la energía sagrada masculina y femenina en tu interior.', 40.00, '22 min', TRUE, 'https://images.unsplash.com/photo-1609718561976-d52836e625cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxzZXJlbmUlMjBtZWRpdGF0aW9ufGVufDB8fHx8MTc2NDYzNzYxMnww&ixlib=rb-4.1.0&q=80&w=1080'),
('med_006', 'MEDITATION', 'Activación del ADN Cósmico', 'Despierta tu potencial dormido y activa tus hebras de ADN.', 40.00, '33 min', TRUE, 'https://images.unsplash.com/photo-1532979772520-f2763956cce0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxjYWxtJTIwbGFrZXxlbnwwfHx8fDE3NjQ2NTUwMjR8MA&ixlib=rb-4.1.0&q=80&w=1080');

-- Insertar Talleres
INSERT INTO products (product_sku, type, name, description, price, workshop_date, workshop_status, is_active, image_url) VALUES
('wshop_001', 'WORKSHOP', 'Ciclo de Activación Nocturna', 'Un viaje de 21 días para despertar tus dones y talentos multidimensionales.', 111.00, 'Inicia el 1 de Agosto', 'Abierto', TRUE, 'https://images.unsplash.com/photo-1532190795157-3f983fb7fa3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxzcGlyaXR1YWwlMjBsZWFybmluZ3xlbnwwfHx8fDE3NjQ2OTIxNDB8MA&ixlib=rb-4.1.0&q=80&w=1080'),
('wshop_002', 'WORKSHOP', 'Conexión con tu Yo Superior', 'Un taller intensivo de fin de semana para alinear tu energía con tu propósito de vida.', 222.00, '15 y 16 de Septiembre', 'Abierto', TRUE, 'https://images.unsplash.com/photo-1560287810-1c89fede7218?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxzcGlyaXR1YWwlMjBhY3RpdmF0aW9ufGVufDB8fHx8MTc2NDY5MjE0MHww&ixlib=rb-4.1.0&q=80&w=1080'),
('wshop_003', 'WORKSHOP', 'Sanación del Niño Interior', 'Libera bloqueos emocionales y patrones limitantes de tu infancia para abrazar tu verdadero ser.', 0.00, 'Próximamente', 'Próximamente', FALSE, 'https://images.unsplash.com/photo-1532979772520-f2763956cce0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxjYWxtJTIwbGFrZXxlbnwwfHx8fDE3NjQ2NTUwMjR8MA&ixlib=rb-4.1.0&q=80&w=1080');

-- Insertar Suscripción como un producto
-- Usaremos un SKU especial para identificarlo
INSERT INTO products (product_sku, type, name, description, price, is_active, image_url) VALUES
('sub_monthly_001', 'WORKSHOP', 'Suscripción Mensual: Acceso Total', 'Disfruta de todas las meditaciones existentes y futuras con nuestra suscripción mensual.', 300.00, TRUE, 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxhYnN0cmFjdCUyMGNvc21vc3xlbnwwfHx8fDE3MjA3MzM3MzF8MA&ixlib=rb-4.1.0&q=80&w=1080');


-- Insertar Productos Físicos
INSERT INTO products (product_sku, type, name, description, price, is_active, image_url) VALUES
('prod_001', 'PHYSICAL_GOOD', 'Pulsera de Cuarzo Rosa', 'Pulsera activada con la energía del amor incondicional.', 44.00, TRUE, 'https://images.unsplash.com/photo-1743127671067-62af70aa67c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxjcnlzdGFsJTIwYnJhY2VsZXR8ZW58MHx8fHwxNzY0NjkyMTM5fDA&ixlib=rb-4.1.0&q=80&w=1080'),
('prod_002', 'PHYSICAL_GOOD', 'Cristal Atlante', 'Cristal programado con la sabiduría de la antigua Atlántida.', 77.00, TRUE, 'https://images.unsplash.com/photo-1727430473786-e88adb86e463?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxxdWFydHolMjBjcnlzdGFsfGVufDB8fHx8MTc2NDY5MjE0MHww&ixlib=rb-4.1.0&q=80&w=1080'),
('prod_003', 'PHYSICAL_GOOD', 'Kit de 7 Chakras', 'Set de cristales para alinear y balancear tus centros energéticos.', 99.00, TRUE, 'https://images.unsplash.com/photo-1575550959103-5f0714b1049c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
('prod_004', 'PHYSICAL_GOOD', 'Orgonita Piramidal', 'Dispositivo para transmutar energías densas y proteger tu espacio.', 120.00, TRUE, 'https://images.unsplash.com/photo-1607567702223-289b53110e54?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');

-- Mensaje de finalización
\echo '--------------------------------------------'
\echo '¡Script de inserción de datos completado!'
\echo '--------------------------------------------'
