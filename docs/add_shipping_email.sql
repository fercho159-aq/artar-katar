-- Agregar columna shipping_email a la tabla orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_email VARCHAR(255) DEFAULT NULL;
