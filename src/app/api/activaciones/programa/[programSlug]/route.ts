import 'dotenv/config';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { dbQuery } from '@/lib/db';
import { sign } from '@/lib/signed-url';
import { getProgramState } from '@/lib/activaciones-programa';

const schema = z.object({ userId: z.string().min(1) });

type Params = { params: Promise<{ programSlug: string }> };

/**
 * Devuelve los pasos de un programa secuenciado con su estado de bloqueo.
 * Solo firma la URL de audio de los pasos DESBLOQUEADOS para el usuario.
 * Requiere suscripción activa de activaciones.
 */
export async function POST(request: Request, { params }: Params) {
  try {
    const { programSlug } = await params;
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
         AND program IN ('activaciones_diarias', 'meditaciones')
         AND status = 'Activa'
         AND end_date > NOW()
       LIMIT 1`,
      [internalUserId]
    );
    if (subRows.length === 0) {
      return NextResponse.json({ message: 'Sin suscripción activa.' }, { status: 403 });
    }

    const state = await getProgramState(programSlug, internalUserId);

    const ttl = 600; // 10 min
    const steps = state.map((s) => {
      let url: string | null = null;
      if (!s.locked) {
        const { exp, sig } = sign(userId, s.slug, ttl);
        url = `/api/activaciones/audio/${s.slug}?uid=${encodeURIComponent(userId)}&exp=${exp}&sig=${sig}`;
      }
      return {
        slug: s.slug,
        title: s.title,
        description: s.description,
        category: s.category,
        duration_seconds: s.duration_seconds,
        sequence_order: s.sequence_order,
        locked: s.locked,
        unlock_at: s.unlock_at,
        prev_started: s.prev_started,
        url,
      };
    });

    return NextResponse.json({ steps, ttl }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Datos inválidos' }, { status: 400 });
    }
    console.error('POST /api/activaciones/programa error:', error);
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}
