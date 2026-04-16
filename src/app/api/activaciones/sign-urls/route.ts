import 'dotenv/config';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { dbQuery } from '@/lib/db';
import { sign } from '@/lib/signed-url';

const schema = z.object({
  userId: z.string().min(1),
});

/**
 * Returns signed URLs (10-min TTL) for every active activación for the requesting user,
 * IF and only if they have an active activaciones_diarias subscription.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId } = schema.parse(body);

    const userRows = await dbQuery('SELECT id FROM users WHERE uid = $1', [userId]);
    if (userRows.length === 0) {
      return NextResponse.json({ message: 'Usuario no encontrado.' }, { status: 404 });
    }
    const internalUserId = userRows[0].id;

    const subRows = await dbQuery(
      `SELECT id FROM subscriptions
       WHERE user_id = $1
         AND program = 'activaciones_diarias'
         AND status = 'Activa'
         AND end_date > NOW()
       LIMIT 1`,
      [internalUserId]
    );
    if (subRows.length === 0) {
      return NextResponse.json({ message: 'Sin suscripción activa.' }, { status: 403 });
    }

    const rows = await dbQuery(
      `SELECT slug FROM activaciones WHERE is_active = TRUE ORDER BY sort_order ASC, title ASC`
    );

    const ttl = 600; // 10 minutes
    const signed = rows.map((r: { slug: string }) => {
      const { exp, sig } = sign(userId, r.slug, ttl);
      return {
        slug: r.slug,
        url: `/api/activaciones/audio/${r.slug}?uid=${encodeURIComponent(userId)}&exp=${exp}&sig=${sig}`,
        exp,
      };
    });

    return NextResponse.json({ urls: signed, ttl }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Datos inválidos' }, { status: 400 });
    }
    console.error('POST /api/activaciones/sign-urls error:', error);
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}
