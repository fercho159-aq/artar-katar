import { dbQuery } from '@/lib/db';
import { Product } from '@/lib/types';

export async function getWorkshops(): Promise<Product[]> {
  const query = `
    SELECT *
    FROM products
    WHERE type = 'WORKSHOP' AND is_active = TRUE
    ORDER BY id DESC
  `;
  try {
    const rows = await dbQuery(query);
    return rows as Product[];
  } catch (error) {
    console.error('Error fetching workshops:', error);
    return [];
  }
}

export async function getWorkshopById(id: string | number): Promise<Product | null> {
  const query = `
    SELECT *
    FROM products
    WHERE id = $1 AND type = 'WORKSHOP' AND is_active = TRUE
  `;
  try {
    const rows = await dbQuery(query, [id]);
    return rows.length > 0 ? (rows[0] as Product) : null;
  } catch (error) {
    console.error(`Error fetching workshop ${id}:`, error);
    return null;
  }
}

/**
 * Cuenta los lugares registrados para un taller.
 * Las compras de pareja (_couple) cuentan como 2 personas.
 */
export async function getWorkshopRegisteredCount(productSku: string): Promise<number> {
  const query = `
    SELECT COALESCE(SUM(oi.quantity), 0) as total
    FROM order_items oi
    JOIN orders o ON o.id = oi.order_id
    JOIN products p ON p.id = oi.product_id
    WHERE p.product_sku = $1
      AND o.status != 'Cancelado'
  `;
  try {
    const rows = await dbQuery(query, [productSku]);
    return parseInt(rows[0]?.total || '0', 10);
  } catch (error) {
    console.error(`Error counting registrations for ${productSku}:`, error);
    return 0;
  }
}
