import 'dotenv/config';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { dbQuery } from '@/lib/db';

const schema = z.object({
  userId: z.string().min(1),
  slug: z.string().min(1),
});

/**
 * Records a play-start event for an activación.
 * Silent: returns 204 even when subscription/slug invalid (auth gating happens at sign-urls).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return new NextResponse(null, { status: 204 });
    }
    const { userId, slug } = parsed.data;

    const userRows = await dbQuery('SELECT id FROM users WHERE uid = $1', [userId]);
    if (userRows.length === 0) {
      return new NextResponse(null, { status: 204 });
    }
    const internalUserId = userRows[0].id;

    const subRows = await dbQuery(
      `SELECT 1 FROM subscriptions
       WHERE user_id = $1
         AND program = 'activaciones_diarias'
         AND status = 'Activa'
         AND end_date > NOW()
       LIMIT 1`,
      [internalUserId]
    );
    if (subRows.length === 0) {
      return new NextResponse(null, { status: 204 });
    }

    const actRows = await dbQuery(
      `SELECT id FROM activaciones WHERE slug = $1 AND is_active = TRUE LIMIT 1`,
      [slug]
    );
    if (actRows.length === 0) {
      return new NextResponse(null, { status: 204 });
    }

    await dbQuery(
      `INSERT INTO activacion_plays (activacion_id, user_id) VALUES ($1, $2)`,
      [actRows[0].id, internalUserId]
    );

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('POST /api/activaciones/track-play error:', error);
    return new NextResponse(null, { status: 204 });
  }
}
