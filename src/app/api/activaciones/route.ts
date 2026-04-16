import 'dotenv/config';
import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';

export async function GET() {
  try {
    const rows = await dbQuery(
      `SELECT id, slug, title, description, category, duration_seconds, sort_order
       FROM activaciones
       WHERE is_active = TRUE
       ORDER BY sort_order ASC, title ASC`
    );
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error('GET /api/activaciones error:', error);
    return NextResponse.json({ message: 'Error al obtener activaciones' }, { status: 500 });
  }
}
