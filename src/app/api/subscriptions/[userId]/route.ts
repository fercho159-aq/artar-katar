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
      // Find the user's internal ID from their public UID
      const userResult = await client.query('SELECT id FROM users WHERE uid = $1', [userId]);
      if (userResult.rows.length === 0) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }
      const internalUserId = userResult.rows[0].id;

      // Now, fetch the subscription for that internal user ID
      const subscriptionQuery = `
        SELECT 
          s.id as subscription_id, 
          s.status,
          to_char(s.start_date, 'YYYY-MM-DD') as start_date,
          to_char(s.next_billing_date, 'YYYY-MM-DD') as next_billing_date,
          to_char(s.end_date, 'YYYY-MM-DD') as end_date
        FROM subscriptions s
        WHERE s.user_id = $1 AND s.status = 'Activa'
        ORDER BY s.start_date DESC
        LIMIT 1;
      `;
      
      const result = await client.query(subscriptionQuery, [internalUserId]);

      if (result.rows.length === 0) {
        return NextResponse.json(null, { status: 200 }); // No active subscription found
      }

      return NextResponse.json(result.rows[0], { status: 200 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Failed to fetch subscription', error: errorMessage }, { status: 500 });
  }
}
