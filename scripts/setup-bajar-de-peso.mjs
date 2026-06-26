#!/usr/bin/env node
/**
 * Setup del programa secuenciado "Bajar de Peso y Rejuvenecimiento Cuántico".
 *
 * - Comprime los 5 audios (mono 64 kbps mp3) a ./private-audio/<slug>.mp3
 * - Agrega columnas program_slug / sequence_order a `activaciones` (idempotente)
 * - Inserta/actualiza las 5 activaciones del programa
 *
 * Uso:
 *   node scripts/setup-bajar-de-peso.mjs "/ruta/a/meditaciones bajar peso audio"
 *
 * Requiere ffmpeg + ffprobe en PATH y DATABASE_URL en el entorno.
 */
import 'dotenv/config';
import { Pool } from '@neondatabase/serverless';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const PROGRAM_SLUG = 'bajar-de-peso';
const CATEGORY = 'Bajar de Peso y Rejuvenecimiento';
const BITRATE = 64;

// Mapeo por número de orden (los archivos vienen con nombres irregulares,
// algunos sin extensión, así que los buscamos por el dígito inicial).
const STEPS = [
  { order: 1, slug: 'bajar-de-peso-1-habitos-alimenticios-saludables',
    title: 'Adquiere Hábitos Alimenticios Saludables' },
  { order: 2, slug: 'bajar-de-peso-2-elimina-adicciones-subconscientes',
    title: 'Elimina Adicciones Subconscientes' },
  { order: 3, slug: 'bajar-de-peso-3-rejuvenecimiento-programacion-neuronal',
    title: 'Rejuvenecimiento y Pérdida de Peso, Programación Neuronal en tu Supra Consciente' },
  { order: 4, slug: 'bajar-de-peso-4-amor-propio-cuerpo-perfecto',
    title: 'Amor Propio, Aceptación de tu Cuerpo Perfecto' },
  { order: 5, slug: 'bajar-de-peso-5-visualizar-manifestar-cuerpo-perfecto',
    title: 'Visualizar y Manifestar tu Cuerpo Perfecto' },
];

function findSourceFile(dir, order) {
  const files = readdirSync(dir);
  // Empieza con "N." o "N)" o "N.)"
  const re = new RegExp(`^${order}[.)]`);
  const match = files.find((f) => re.test(f.trim()));
  if (!match) throw new Error(`No encontré el archivo para el paso ${order} en ${dir}`);
  return join(dir, match);
}

function compress(input, output, bitrate) {
  const res = spawnSync('ffmpeg', [
    '-y', '-i', input, '-ac', '1', '-b:a', `${bitrate}k`, '-codec:a', 'libmp3lame', output,
  ], { stdio: 'inherit' });
  return res.status === 0;
}

function probeDuration(file) {
  const res = spawnSync('ffprobe', [
    '-v', 'error', '-show_entries', 'format=duration',
    '-of', 'default=noprint_wrappers=1:nokey=1', file,
  ], { encoding: 'utf8' });
  if (res.status !== 0) return null;
  const sec = parseFloat(res.stdout.trim());
  return Number.isFinite(sec) ? Math.round(sec) : null;
}

async function main() {
  const srcArg = process.argv[2];
  if (!srcArg) {
    console.error('Uso: node scripts/setup-bajar-de-peso.mjs "<carpeta de audios>"');
    process.exit(1);
  }
  const sourceDir = resolve(srcArg);
  if (!existsSync(sourceDir)) {
    console.error(`Carpeta no encontrada: ${sourceDir}`);
    process.exit(1);
  }

  const destDir = resolve(process.cwd(), 'private-audio');
  if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true });

  // 1) Comprimir
  const rows = [];
  for (const step of STEPS) {
    const input = findSourceFile(sourceDir, step.order);
    const output = join(destDir, `${step.slug}.mp3`);
    console.error(`\n→ Paso ${step.order}: ${step.title}\n  src: ${input}\n  out: ${step.slug}.mp3`);
    if (!compress(input, output, BITRATE)) {
      throw new Error(`Falló la compresión del paso ${step.order}`);
    }
    const duration = probeDuration(output);
    rows.push({ ...step, filename: `${step.slug}.mp3`, duration });
  }

  // 2) Migración + inserción
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  try {
    await client.query(`
      ALTER TABLE activaciones
        ADD COLUMN IF NOT EXISTS program_slug VARCHAR(50),
        ADD COLUMN IF NOT EXISTS sequence_order INT;
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_activaciones_program
        ON activaciones(program_slug, sequence_order);
    `);

    for (const r of rows) {
      await client.query(
        `INSERT INTO activaciones
           (slug, title, description, category, duration_seconds, audio_filename,
            sort_order, is_active, program_slug, sequence_order)
         VALUES ($1,$2,NULL,$3,$4,$5,$6,TRUE,$7,$8)
         ON CONFLICT (slug) DO UPDATE SET
           title = EXCLUDED.title,
           category = EXCLUDED.category,
           duration_seconds = EXCLUDED.duration_seconds,
           audio_filename = EXCLUDED.audio_filename,
           sort_order = EXCLUDED.sort_order,
           is_active = TRUE,
           program_slug = EXCLUDED.program_slug,
           sequence_order = EXCLUDED.sequence_order`,
        [r.slug, r.title, CATEGORY, r.duration, r.filename, r.order, PROGRAM_SLUG, r.order]
      );
      console.error(`  ✓ DB: ${r.slug} (${r.duration ?? '?'}s)`);
    }

    const check = await client.query(
      `SELECT sequence_order, slug, duration_seconds FROM activaciones
       WHERE program_slug = $1 ORDER BY sequence_order`,
      [PROGRAM_SLUG]
    );
    console.error('\nPrograma en DB:');
    console.table(check.rows);
  } finally {
    client.release();
    await pool.end();
  }

  console.error('\n✅ Listo.');
}

main().catch((e) => {
  console.error('FAILED:', e.message);
  process.exit(1);
});
