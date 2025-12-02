import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { Product } from '@/lib/types';

export async function GET() {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query<Product>(
        'SELECT * FROM products WHERE is_active = TRUE'
      );
      return NextResponse.json(result.rows, { status: 200 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Failed to fetch products', error: errorMessage }, { status: 500 });
  }
}
