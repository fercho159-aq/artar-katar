import 'dotenv/config';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { dbQuery } from '@/lib/db';
import { verify } from '@/lib/signed-url';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ slug: string }> };

const PRIVATE_DIR = path.join(process.cwd(), 'private-audio');

export async function GET(request: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const url = new URL(request.url);
    const uid = url.searchParams.get('uid') || '';
    const exp = parseInt(url.searchParams.get('exp') || '0', 10);
    const sig = url.searchParams.get('sig') || '';

    // 1. Verify HMAC signed URL
    if (!verify(uid, slug, exp, sig)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // 2. Confirm active subscription
    const userRows = await dbQuery('SELECT id FROM users WHERE uid = $1', [uid]);
    if (userRows.length === 0) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
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
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // 3. Resolve audio file
    const actRows = await dbQuery(
      'SELECT audio_filename FROM activaciones WHERE slug = $1 AND is_active = TRUE',
      [slug]
    );
    if (actRows.length === 0) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }
    const filename = path.basename(actRows[0].audio_filename); // traversal guard
    const filePath = path.join(PRIVATE_DIR, filename);

    if (!filePath.startsWith(PRIVATE_DIR)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ message: 'File missing' }, { status: 404 });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = request.headers.get('range');

    const baseHeaders: Record<string, string> = {
      'Content-Type': 'audio/mpeg',
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'private, no-store',
    };

    // 4. Range request → 206 partial
    if (range) {
      const match = /bytes=(\d*)-(\d*)/.exec(range);
      if (!match) {
        return new NextResponse(null, { status: 416 });
      }
      const start = match[1] ? parseInt(match[1], 10) : 0;
      const end = match[2] ? parseInt(match[2], 10) : fileSize - 1;

      if (start >= fileSize || end >= fileSize || start > end) {
        return new NextResponse(null, {
          status: 416,
          headers: { 'Content-Range': `bytes */${fileSize}` },
        });
      }

      const chunkSize = end - start + 1;
      const nodeStream = fs.createReadStream(filePath, { start, end });
      const webStream = nodeStreamToWebStream(nodeStream);

      return new NextResponse(webStream, {
        status: 206,
        headers: {
          ...baseHeaders,
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Content-Length': String(chunkSize),
        },
      });
    }

    // 5. Full file
    const nodeStream = fs.createReadStream(filePath);
    const webStream = nodeStreamToWebStream(nodeStream);
    return new NextResponse(webStream, {
      status: 200,
      headers: {
        ...baseHeaders,
        'Content-Length': String(fileSize),
      },
    });
  } catch (error) {
    console.error('GET /api/activaciones/audio/[slug] error:', error);
    return NextResponse.json({ message: 'Error interno' }, { status: 500 });
  }
}

function nodeStreamToWebStream(readable: NodeJS.ReadableStream): ReadableStream {
  return new ReadableStream({
    start(controller) {
      readable.on('data', (chunk) => {
        controller.enqueue(new Uint8Array(chunk as Buffer));
      });
      readable.on('end', () => controller.close());
      readable.on('error', (err) => controller.error(err));
    },
    cancel() {
      (readable as fs.ReadStream).destroy?.();
    },
  });
}
