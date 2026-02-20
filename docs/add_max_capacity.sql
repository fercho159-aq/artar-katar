-- ============================================
-- Agregar campo max_capacity a la tabla products
-- Para limitar el cupo de talleres
-- ============================================

-- PASO 1: Agregar columna max_capacity (NULL = sin límite)
ALTER TABLE products ADD COLUMN IF NOT EXISTS max_capacity INTEGER DEFAULT NULL;

-- PASO 2: Establecer cupo de 70 personas para el taller "Activación Multidimensional de tu Abundancia"
UPDATE products
SET max_capacity = 70
WHERE product_sku = 'wshop_005';

-- PASO 3: Verificar cambios
SELECT product_sku, name, max_capacity
FROM products
WHERE type = 'WORKSHOP';
