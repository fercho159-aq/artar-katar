-- ============================================
-- MIGRACIÓN 009: PROGRAMAS SECUENCIADOS DE ACTIVACIONES
-- Agrega agrupación + orden para programas con desbloqueo temporal
-- (p.ej. "Bajar de Peso y Rejuvenecimiento Cuántico").
--
-- Aplicada por scripts/setup-bajar-de-peso.mjs (que además comprime los
-- audios e inserta las filas). Este archivo queda como registro del schema.
-- ============================================

BEGIN;

-- program_slug NULL  = biblioteca plana (comportamiento actual).
-- program_slug != NULL = pertenece a un programa secuenciado; sequence_order
-- define el orden y el desbloqueo (paso N se libera 21 días después de la
-- primera reproducción del paso N-1, ver src/lib/activaciones-programa.ts).
ALTER TABLE activaciones
  ADD COLUMN IF NOT EXISTS program_slug VARCHAR(50),
  ADD COLUMN IF NOT EXISTS sequence_order INT;

CREATE INDEX IF NOT EXISTS idx_activaciones_program
  ON activaciones(program_slug, sequence_order);

COMMIT;
