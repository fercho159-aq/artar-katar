import { NextResponse } from 'next/server';
import pool from '@/lib/db';

type Params = {
  params: {
    userId: string;
  };
};

export async function GET(request: Request, { params }: Params) {
  const { userId } = params;

  if (!userId) {
    return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  }

  try {
    const client = await pool.connect();
    try {
      // We assume userId corresponds to the 'uid' column in the 'users' table
      const ordersQuery = `
        SELECT 
          o.id as order_id, 
          o.order_date, 
          o.total_amount, 
          o.status,
          json_agg(
            json_build_object(
              'product_id', p.id,
              'name', p.name,
              'quantity', oi.quantity,
              'price_at_purchase', oi.price_at_purchase
            )
          ) as items
        FROM orders o
        JOIN users u ON o.user_id = u.id
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        WHERE u.uid = $1
        GROUP BY o.id
        ORDER BY o.order_date DESC;
      `;
      
      const result = await client.query(ordersQuery, [userId]);

      return NextResponse.json(result.rows, { status: 200 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Failed to fetch orders', error: errorMessage }, { status: 500 });
  }
}
