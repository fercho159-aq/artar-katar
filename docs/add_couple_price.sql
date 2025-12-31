-- ============================================
-- ADD COUPLE_PRICE COLUMN FOR WORKSHOPS
-- Precio individual: $1000 MXN
-- Precio parejas: $1500 MXN
-- ============================================

-- Add couple_price column to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS couple_price DECIMAL(10, 2) DEFAULT NULL;

-- Update all active workshops:
-- Set individual price to 1000 MXN and couple price to 1500 MXN
UPDATE products 
SET price = 1000.00,
    couple_price = 1500.00 
WHERE type = 'WORKSHOP' AND is_active = TRUE;

-- Verify the update
SELECT id, name, type, price, couple_price, workshop_status 
FROM products 
WHERE type = 'WORKSHOP';
