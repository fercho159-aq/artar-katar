-- ============================================
-- MIGRACIÓN 008: CONTADOR DE REPRODUCCIONES DE ACTIVACIONES
-- Hidden play tracking — one row per play start
-- ============================================

BEGIN;

CREATE TABLE IF NOT EXISTS activacion_plays (
  id BIGSERIAL PRIMARY KEY,
  activacion_id INT NOT NULL REFERENCES activaciones(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id) ON DELETE SET NULL,
  played_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activacion_plays_activacion ON activacion_plays(activacion_id);
CREATE INDEX IF NOT EXISTS idx_activacion_plays_played_at  ON activacion_plays(played_at);
CREATE INDEX IF NOT EXISTS idx_activacion_plays_user       ON activacion_plays(user_id);

COMMIT;
