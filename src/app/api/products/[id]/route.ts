import 'dotenv/config';
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

type Params = {
  params: {
    id: string;
  };
};

export async function GET(request: Request, { params }: Params) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    const productQuery = `SELECT * FROM products WHERE id = $1 AND is_active = TRUE`;
    const result = await client.query(productQuery, [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error(`API Error fetching product ${id}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Failed to fetch product', error: errorMessage }, { status: 500 });
  } finally {
    client.release();
  }
}
