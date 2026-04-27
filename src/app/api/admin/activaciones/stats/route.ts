import 'dotenv/config';
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

/**
 * GET /api/admin/activaciones/stats?adminUid=...
 * Returns play stats per activación (admin only).
 */
export async function GET(request: Request) {
  const client = await pool.connect();

  try {
    const { searchParams } = new URL(request.url);
    const adminUid = searchParams.get('adminUid');

    if (!adminUid) {
      return NextResponse.json({ message: 'Falta adminUid' }, { status: 400 });
    }

    const adminCheck = await client.query(
      'SELECT is_admin FROM users WHERE uid = $1',
      [adminUid]
    );

    if (adminCheck.rows.length === 0 || !adminCheck.rows[0].is_admin) {
      return NextResponse.json(
        { message: 'No tienes permisos de administrador' },
        { status: 403 }
      );
    }

    const result = await client.query(
      `SELECT
         a.id,
         a.slug,
         a.title,
         a.category,
         a.sort_order,
         a.is_active,
         COUNT(p.id)::int AS total_plays,
         COUNT(p.id) FILTER (WHERE p.played_at > NOW() - INTERVAL '30 days')::int AS plays_30d,
         COUNT(DISTINCT p.user_id)::int AS unique_users,
         MAX(p.played_at) AS last_played_at
       FROM activaciones a
       LEFT JOIN activacion_plays p ON p.activacion_id = a.id
       GROUP BY a.id
       ORDER BY total_plays DESC, a.sort_order ASC, a.title ASC`
    );

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('GET /api/admin/activaciones/stats error:', error);
    return NextResponse.json(
      { message: 'Error al obtener estadísticas' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
