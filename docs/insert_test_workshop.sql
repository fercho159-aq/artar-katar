-- Insertar taller de prueba de $1 MXN para verificar pagos
INSERT INTO products (product_sku, type, name, short_description, description, price, workshop_date, workshop_status, is_active, image_url)
VALUES (
  'wshop_test_001',
  'WORKSHOP',
  '🧪 Taller de Prueba',
  'Producto de prueba para verificar pagos - $1 MXN',
  'Este es un taller de prueba para verificar que el sistema de pagos funcione correctamente. No es un taller real.',
  1.00,
  'Producto de prueba',
  'Abierto',
  TRUE,
  NULL
)
ON CONFLICT (product_sku) DO UPDATE SET
  is_active = TRUE,
  price = 1.00,
  workshop_status = 'Abierto';
