-- ============================================
-- SCRIPT DE DATOS INICIALES - NEON
-- ============================================

-- Insertar meditaciones
INSERT INTO products (product_sku, type, name, description, price, meditation_duration, is_active, image_url)
VALUES 
('med_001', 'MEDITATION', 'Meditación de Anclaje a Tierra', 'Conecta con la energía de Gaia y encuentra tu centro.', 40.00, '15 min', TRUE, 'https://images.unsplash.com/photo-1609718561976-d52836e625cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxzZXJlbmUlMjBtZWRpdGF0aW9ufGVufDB8fHx8MTc2NDYzNzYxMnww&ixlib=rb-4.1.0&q=80&w=1080'),
('med_002', 'MEDITATION', 'Activación del Corazón Cristalino', 'Abre tu corazón a la frecuencia del amor incondicional.', 40.00, '25 min', TRUE, 'https://images.unsplash.com/photo-1532979772520-f2763956cce0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxjYWxtJTIwbGFrZXxlbnwwfHx8fDE3NjQ2NTUwMjR8MA&ixlib=rb-4.1.0&q=80&w=1080'),
('med_003', 'MEDITATION', 'Viaje al Templo de Sanación', 'Recibe sanación y guía de los maestros ascendidos.', 40.00, '30 min', TRUE, 'https://images.unsplash.com/photo-1532190795157-3f983fb7fa3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxzcGlyaXR1YWwlMjBsZWFybmluZ3xlbnwwfHx8fDE3NjQ2OTIxNDB8MA&ixlib=rb-4.1.0&q=80&w=1080'),
('med_004', 'MEDITATION', 'Limpieza Energética Profunda', 'Libera energías densas y revitaliza tu campo áurico.', 40.00, '20 min', TRUE, 'https://images.unsplash.com/photo-1560287810-1c89fede7218?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxzcGlyaXR1YWwlMjBhY3RpdmF0aW9ufGVufDB8fHx8MTc2NDY5MjE0MHww&ixlib=rb-4.1.0&q=80&w=1080'),
('med_005', 'MEDITATION', 'Conexión con tu Llama Gemela', 'Armoniza la energía sagrada masculina y femenina en tu interior.', 40.00, '22 min', TRUE, 'https://images.unsplash.com/photo-1609718561976-d52836e625cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxzZXJlbmUlMjBtZWRpdGF0aW9ufGVufDB8fHx8MTc2NDYzNzYxMnww&ixlib=rb-4.1.0&q=80&w=1080'),
('med_006', 'MEDITATION', 'Activación del ADN Cósmico', 'Despierta tu potencial dormido y activa tus hebras de ADN.', 40.00, '33 min', TRUE, 'https://images.unsplash.com/photo-1532979772520-f2763956cce0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxjYWxtJTIwbGFrZXxlbnwwfHx8fDE3NjQ2NTUwMjR8MA&ixlib=rb-4.1.0&q=80&w=1080');

-- Insertar talleres
INSERT INTO products (product_sku, type, name, description, price, workshop_date, workshop_status, is_active, image_url)
VALUES 
('wshop_001', 'WORKSHOP', 'Ciclo de Activación Nocturna', 'Un viaje de 21 días para despertar tus dones y talentos multidimensionales.', 111.00, 'Inicia el 1 de Agosto', 'Abierto', TRUE, 'https://images.unsplash.com/photo-1532190795157-3f983fb7fa3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxzcGlyaXR1YWwlMjBsZWFybmluZ3xlbnwwfHx8fDE3NjQ2OTIxNDB8MA&ixlib=rb-4.1.0&q=80&w=1080'),
('wshop_002', 'WORKSHOP', 'Conexión con tu Yo Superior', 'Un taller intensivo de fin de semana para alinear tu energía con tu propósito de vida.', 222.00, '15 y 16 de Septiembre', 'Abierto', TRUE, 'https://images.unsplash.com/photo-1560287810-1c89fede7218?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxzcGlyaXR1YWwlMjBhY3RpdmF0aW9ufGVufDB8fHx8MTc2NDY5MjE0MHww&ixlib=rb-4.1.0&q=80&w=1080'),
('wshop_003', 'WORKSHOP', 'Sanación del Niño Interior', 'Libera bloqueos emocionales y patrones limitantes de tu infancia para abrazar tu verdadero ser.', 0.00, 'Próximamente', 'Próximamente', TRUE, 'https://images.unsplash.com/photo-1532979772520-f2763956cce0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxjYWxtJTIwbGFrZXxlbnwwfHx8fDE3NjQ2NTUwMjR8MA&ixlib=rb-4.1.0&q=80&w=1080');

-- Insertar productos físicos
INSERT INTO products (product_sku, type, name, description, price, is_active, image_url)
VALUES 
('phys_001', 'PHYSICAL_GOOD', 'Pulsera de Cuarzo Rosa Activada', 'Pulsera para vibrar en la frecuencia del amor incondicional.', 44.00, TRUE, 'https://images.unsplash.com/photo-1743127671067-62af70aa67c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxjcnlzdGFsJTIwYnJhY2VsZXR8ZW58MHx8fHwxNzY0NjkyMTM5fDA&ixlib=rb-4.1.0&q=80&w=1080'),
('phys_002', 'PHYSICAL_GOOD', 'Cristal Maestro Atlante', 'Cristal programado con la sabiduría de la Atlántida.', 77.00, TRUE, 'https://images.unsplash.com/photo-1727430473786-e88adb86e463?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxxdWFydHolMjBjcnlzdGFsfGVufDB8fHx8MTc2NDY5MjE0MHww&ixlib=rb-4.1.0&q=80&w=1080'),
('phys_003', 'PHYSICAL_GOOD', 'Kit de 7 Chakras', 'Set de cristales para alinear y balancear tus centros energéticos.', 55.00, TRUE, 'https://images.unsplash.com/photo-1727430473786-e88adb86e463?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxxdWFydHolMjBjcnlzdGFsfGVufDB8fHx8MTc2NDY5MjE0MHww&ixlib=rb-4.1.0&q=80&w=1080'),
('phys_004', 'PHYSICAL_GOOD', 'Orgonita Piramidal', 'Dispositivo para transmutar energías densas en tu espacio.', 60.00, TRUE, 'https://images.unsplash.com/photo-1727430473786-e88adb86e463?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxxdWFydHolMjBjcnlzdGFsfGVufDB8fHx8MTc2NDY5MjE0MHww&ixlib=rb-4.1.0&q=80&w=1080');

-- Insertar producto de suscripción
INSERT INTO products (product_sku, type, name, description, price, is_active, image_url)
VALUES 
('sub_001', 'MEDITATION', 'Suscripción Mensual - Acceso Total', 'Acceso ilimitado a toda la biblioteca de meditaciones.', 300.00, TRUE, 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxhYnN0cmFjdCUyMGNvc21vc3xlbnwwfHx8fDE3MjA3MzM3MzF8MA&ixlib=rb-4.1.0&q=80&w=1080');
