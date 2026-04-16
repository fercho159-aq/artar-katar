import crypto from 'crypto';

const SECRET = process.env.SIGNED_URL_SECRET;

function getSecret(): string {
  if (!SECRET) {
    throw new Error('SIGNED_URL_SECRET is not set');
  }
  return SECRET;
}

export type SignedParams = { uid: string; exp: number; sig: string };

export function sign(uid: string, slug: string, ttlSeconds = 600): SignedParams {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const sig = hmac(`${uid}:${slug}:${exp}`);
  return { uid, exp, sig };
}

export function verify(uid: string, slug: string, exp: number, sig: string): boolean {
  if (!uid || !slug || !exp || !sig) return false;
  if (exp < Math.floor(Date.now() / 1000)) return false;
  const expected = hmac(`${uid}:${slug}:${exp}`);
  const a = Buffer.from(sig, 'hex');
  const b = Buffer.from(expected, 'hex');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function hmac(payload: string): string {
  return crypto.createHmac('sha256', getSecret()).update(payload).digest('hex');
}
