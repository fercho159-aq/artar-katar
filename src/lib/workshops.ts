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
