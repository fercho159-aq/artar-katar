import 'dotenv/config';
import { dbQuery } from '@/lib/db';

/**
 * Lógica de programas secuenciados de activaciones (p.ej. "Bajar de Peso").
 *
 * Modelo de desbloqueo (auto-pausado):
 *   - El paso 1 está disponible para cualquier suscriptor activo.
 *   - El paso N (N>=2) se desbloquea UNLOCK_DAYS días después de la PRIMERA
 *     reproducción del paso N-1 por ese usuario.
 *
 * La "primera reproducción" se deriva de MIN(played_at) en activacion_plays
 * (que AudioPlayer registra vía /api/activaciones/track-play).
 */

export const UNLOCK_DAYS = 21;
const DAY_MS = 24 * 60 * 60 * 1000;

export type ProgramRow = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  category: string | null;
  duration_seconds: number | null;
  sequence_order: number;
};

export async function getProgramRows(programSlug: string): Promise<ProgramRow[]> {
  return (await dbQuery(
    `SELECT id, slug, title, description, category, duration_seconds, sequence_order
     FROM activaciones
     WHERE program_slug = $1 AND is_active = TRUE
     ORDER BY sequence_order ASC`,
    [programSlug]
  )) as ProgramRow[];
}

/** Map activacion_id -> primera reproducción (Date) del usuario, entre los ids dados. */
async function getFirstPlays(internalUserId: number, ids: number[]): Promise<Map<number, Date>> {
  const map = new Map<number, Date>();
  if (ids.length === 0) return map;
  const rows = await dbQuery(
    `SELECT activacion_id, MIN(played_at) AS first_play
       FROM activacion_plays
      WHERE user_id = $1 AND activacion_id = ANY($2::int[])
      GROUP BY activacion_id`,
    [internalUserId, ids]
  );
  for (const r of rows as { activacion_id: number; first_play: string }[]) {
    map.set(r.activacion_id, new Date(r.first_play));
  }
  return map;
}

export type ProgramStepState = ProgramRow & {
  locked: boolean;
  /** Fecha (ISO) en que se desbloquea, si el paso anterior ya fue iniciado. */
  unlock_at: string | null;
  /** ¿El usuario ya inició (reprodujo) el paso anterior? */
  prev_started: boolean;
};

/**
 * Devuelve el estado de bloqueo de cada paso del programa para un usuario.
 */
export async function getProgramState(
  programSlug: string,
  internalUserId: number
): Promise<ProgramStepState[]> {
  const rows = await getProgramRows(programSlug);
  const firstPlays = await getFirstPlays(internalUserId, rows.map((r) => r.id));
  const now = Date.now();

  return rows.map((row, i) => {
    if (i === 0) {
      return { ...row, locked: false, unlock_at: null, prev_started: true };
    }
    const prev = rows[i - 1];
    const prevFirst = firstPlays.get(prev.id) ?? null;
    if (!prevFirst) {
      return { ...row, locked: true, unlock_at: null, prev_started: false };
    }
    const unlockTime = prevFirst.getTime() + UNLOCK_DAYS * DAY_MS;
    return {
      ...row,
      locked: unlockTime > now,
      unlock_at: new Date(unlockTime).toISOString(),
      prev_started: true,
    };
  });
}

/**
 * Enforcement server-side para la ruta de audio: ¿este paso está desbloqueado
 * para el usuario? Evita que alguien use una URL firmada de un paso bloqueado.
 */
export async function isProgramStepUnlocked(
  internalUserId: number,
  programSlug: string,
  sequenceOrder: number
): Promise<boolean> {
  if (sequenceOrder <= 1) return true;

  const prevRows = await dbQuery(
    `SELECT id FROM activaciones
      WHERE program_slug = $1 AND sequence_order = $2 AND is_active = TRUE
      LIMIT 1`,
    [programSlug, sequenceOrder - 1]
  );
  if (prevRows.length === 0) return false;

  const playRows = await dbQuery(
    `SELECT MIN(played_at) AS first_play
       FROM activacion_plays
      WHERE user_id = $1 AND activacion_id = $2`,
    [internalUserId, prevRows[0].id]
  );
  const firstPlay = playRows[0]?.first_play ? new Date(playRows[0].first_play) : null;
  if (!firstPlay) return false;

  return firstPlay.getTime() + UNLOCK_DAYS * DAY_MS <= Date.now();
}
