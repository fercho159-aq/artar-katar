# private-audio/

Gated audio files for the **Programa de Activaciones Diarias** subscription.

These MP3s are **NOT served statically**. They are streamed only through the
authenticated route `/api/activaciones/audio/[slug]`, which verifies:

1. A short-lived HMAC-signed URL (`?uid&exp&sig`).
2. An active `subscriptions` row where `program = 'activaciones_diarias'`.

## Adding new activations

1. Drop the source audio (mp3/wav/m4a) in `~/Downloads/meditaciones/` (or any folder).
2. Run:
   ```
   node scripts/compress-activaciones.mjs ~/Downloads/meditaciones --bitrate 64
   ```
3. The script writes compressed mono MP3s to `private-audio/<slug>.mp3` and
   prints `INSERT INTO activaciones ...` SQL. Run that SQL against Neon.
4. Commit the new `.mp3` files plus the `activaciones` SQL seed.

## Why not `public/`?

Files in `public/` are served by Next.js statically with no auth. Keeping them
here lets the API route enforce the subscription check before returning bytes.

## Vercel deploy

`next.config.ts` has `outputFileTracingIncludes` pointing to `./private-audio/**/*`
so these files are bundled into the serverless function for the audio route.
Without that config the files are excluded from the serverless bundle → 404 in prod.
