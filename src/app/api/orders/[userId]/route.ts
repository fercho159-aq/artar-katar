import 'dotenv/config';
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

type Params = {
  params: {
    userId: string; // This is the public uid
  };
};

export async function GET(request: Request, { params }: Params) {
  const { userId } = params;

  if (!userId) {
    return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    // First, find the internal user ID from the public UID
    const userResult = await client.query('SELECT id FROM users WHERE uid = $1', [userId]);
    if (userResult.rows.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    const internalUserId = userResult.rows[0].id;

    // Now, fetch orders using the internal user ID
    const ordersQuery = `
      SELECT 
        o.id as order_id, 
        o.order_date, 
        o.total_amount, 
        o.status,
        json_agg(
          json_build_object(
            'product_id', p.product_sku,
            'name', p.name,
            'quantity', oi.quantity,
            'price_at_purchase', oi.price_at_purchase,
            'image_url', p.image_url
          )
        ) as items
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.order_date DESC;
    `;
    
    const result = await client.query(ordersQuery, [internalUserId]);

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('API Error fetching orders:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Failed to fetch orders', error: errorMessage }, { status: 500 });
  } finally {
    client.release();
  }
}
