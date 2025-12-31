-- ============================================
-- ADD COUPLE_PRICE COLUMN FOR WORKSHOPS
-- ============================================

-- Add couple_price column to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS couple_price DECIMAL(10, 2) DEFAULT NULL;

-- Update all active workshops to have a couple price of 1500
UPDATE products 
SET couple_price = 1500.00 
WHERE type = 'WORKSHOP' AND is_active = TRUE;

-- Verify the update
SELECT id, name, type, price, couple_price, workshop_status 
FROM products 
WHERE type = 'WORKSHOP';
