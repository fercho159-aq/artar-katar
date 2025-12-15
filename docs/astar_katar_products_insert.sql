-- ============================================
-- TIENDA CÓSMICA: COLECCIÓN ASTAR KATAR
-- Script de inserción de productos
-- ============================================

-- IMPORTANTE: Ejecutar estos comandos para agregar nuevos campos a la tabla products
-- (ejecutar ANTES de los inserts si los campos no existen)
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS category VARCHAR(100);
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS activated_by TEXT;
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS learn_more TEXT;
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS stone VARCHAR(100);

-- ============================================
-- A. ENERGÍA VITAL Y SEXUALIDAD (KUNDALINI)
-- ============================================

-- Pulsera KUNDALINI & SEXUALIDAD (Mujeres)
INSERT INTO products (product_sku, type, name, description, price, is_active, image_url)
VALUES (
    'puls_kundalini_mujer', 
    'PHYSICAL_GOOD', 
    'Pulsera KUNDALINI & SEXUALIDAD (Mujeres)', 
    'Despierta la energía kundalini de manera armónica, fuerte y profunda | Promueve mayor libido y disfrute sexual | Aumenta placer y creatividad sexual | Libera de traumas sexuales | Aumenta energía vital y tu "radiación sexual" | En personas en proceso de apertura multidimensional, facilita el pasar conscientemente a otras dimensiones | Material: Amatista',
    599.00, 
    TRUE, 
    'https://images.unsplash.com/photo-1611652022419-a9419f74343d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
);

-- Pulsera KUNDALINI & SEXUALIDAD (Hombres)
INSERT INTO products (product_sku, type, name, description, price, is_active, image_url)
VALUES (
    'puls_kundalini_hombre', 
    'PHYSICAL_GOOD', 
    'Pulsera KUNDALINI & SEXUALIDAD (Hombres)', 
    'Despierta la energía Kundalini de manera armónica, fuerte y profunda | Aumenta virilidad y fuerza sexual | Mayor libido y vigor sexual | Aumenta energía vital y tu "radiación sexual" | En personas en procesos de apertura multidimensional, facilita el pasar conscientemente a otras dimensiones | Material: Amatista',
    599.00, 
    TRUE, 
    'https://images.unsplash.com/photo-1611652022419-a9419f74343d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
);

-- ============================================
-- B. INTELECTO Y MENTE
-- ============================================

-- Pulsera EINSTEIN
INSERT INTO products (product_sku, type, name, description, price, is_active, image_url)
VALUES (
    'puls_einstein', 
    'PHYSICAL_GOOD', 
    'Pulsera EINSTEIN', 
    'Mejora tu capacidad intelectual y cognitiva | Ayuda en pensamiento abstracto | Permite un enfoque nuevo a problemas que trasciendan la lógica ordinaria | Cargada con energía cuántica Omega | Ideal para ejecutivos, profesionales con alta exigencia mental y estudiantes | Material: Cuarzo Sandía de la India',
    649.00, 
    TRUE, 
    'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
);

-- ============================================
-- C. ABUNDANCIA Y MANIFESTACIÓN
-- ============================================

-- Pulsera ABUNDANCIA Y BIENESTAR
INSERT INTO products (product_sku, type, name, description, price, is_active, image_url)
VALUES (
    'puls_abundancia', 
    'PHYSICAL_GOOD', 
    'Pulsera ABUNDANCIA Y BIENESTAR', 
    'Permite aceptar la abundancia como un derecho natural de vida | Instala la consciencia de cocreador vibracional | Transforma paradigmas y condicionamientos de escasez (ancestrales y de otras vidas) | Conecta con el flujo natural de abundancia en la tierra | Material: Ágata Amarilla',
    549.00, 
    TRUE, 
    'https://images.unsplash.com/photo-1515377905703-c4788e51af15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
);

-- Pulsera ADN MILLONARIO
INSERT INTO products (product_sku, type, name, description, price, is_active, image_url)
VALUES (
    'puls_adn_millonario', 
    'PHYSICAL_GOOD', 
    'Pulsera ADN MILLONARIO', 
    'Fuerte impulso para atraer abundancia y riqueza financiera | Apoyo personal en área de trabajo y negocios | Ayuda a reconectar tus filamentos multidimensionales de ADN "de abundancia" | Efecto profundo y multidimensional | Material: Ágata Naranja',
    649.00, 
    TRUE, 
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
);

-- ============================================
-- D. MISIÓN DE VIDA Y DONES
-- ============================================

-- Pulsera ACTIVACIÓN DONES y "PROPÓSITO DE ALMA"
INSERT INTO products (product_sku, type, name, description, price, is_active, image_url)
VALUES (
    'puls_dones_proposito', 
    'PHYSICAL_GOOD', 
    'Pulsera ACTIVACIÓN DONES y PROPÓSITO DE ALMA', 
    'Activa tus dones y habilidades dormidas (intuición, clarividencia, etc.) | Te guía hacia tu "propósito de alma" | Da la capacidad de manifestar tus objetivos | Promueve concentración, firmeza y decisión | Material: Jade Naranja y Obsidiana',
    699.00, 
    TRUE, 
    'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
);

-- ============================================
-- E. SANACIÓN
-- ============================================

-- Pulsera SANADORES CÓSMICOS
INSERT INTO products (product_sku, type, name, description, price, is_active, image_url)
VALUES (
    'puls_sanadores_cosmicos', 
    'PHYSICAL_GOOD', 
    'Pulsera SANADORES CÓSMICOS', 
    'Apoyo en sanación física, mental y emocional | Conexión con tecnología espiritual de Sirio | Armonización de frecuencias personales | Sanación de la relación con la economía (al contactar con patrones divinos) | Material: Piedra de Luna',
    599.00, 
    TRUE, 
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
);

-- ============================================
-- F. PROTECCIÓN Y LIMPIEZA
-- ============================================

-- Pulsera PROTECCIÓN ENERGÉTICA
INSERT INTO products (product_sku, type, name, description, price, is_active, image_url)
VALUES (
    'puls_proteccion', 
    'PHYSICAL_GOOD', 
    'Pulsera PROTECCIÓN ENERGÉTICA', 
    'Protege al portador contra energías negativas y brujerías | Repele malas vibras y elimina negatividad | Quita ansiedad, ira y estados depresivos | Otorga fuerza espiritual | Material: Piedra Volcánica',
    549.00, 
    TRUE, 
    'https://images.unsplash.com/photo-1599459183200-59c3b51c8ad1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
);

-- ANCLAS DE PROTECCIÓN ENERGÉTICA (Para Espacios)
INSERT INTO products (product_sku, type, name, description, price, is_active, image_url)
VALUES (
    'anclas_proteccion', 
    'PHYSICAL_GOOD', 
    'ANCLAS DE PROTECCIÓN ENERGÉTICA (Para Espacios)', 
    'Protege espacios de energías negativas y brujerías | Elimina negatividad dejada por otras personas | Genera un hexágono vibracional y estructuras de vórtices | Uso: Colocar un ancla en cada esquina del espacio (casa, oficina) | Material: Obsidiana',
    799.00, 
    TRUE, 
    'https://images.unsplash.com/photo-1628926379972-9bd2bac55a36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
);

-- ============================================
-- OPCIONAL: Desactivar productos anteriores si es necesario
-- ============================================
-- UPDATE products SET is_active = FALSE WHERE product_sku IN ('phys_001', 'phys_002', 'phys_003', 'phys_004');
