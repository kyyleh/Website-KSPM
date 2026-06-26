import crypto from 'crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const JWT_SECRET = () => process.env.ADMIN_JWT_SECRET || 'kspm-default-secret-change-me';

export interface TokenPayload {
  id: number;
  email: string;
  exp: number;
}

/**
 * Hash a password using SHA-256
 */
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

/**
 * Create a signed token (JWT-like) with HMAC-SHA256
 */
export function createToken(payload: Omit<TokenPayload, 'exp'>): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: TokenPayload = {
    ...payload,
    exp: now + 24 * 60 * 60, // 24 hours
  };

  const headerB64 = Buffer.from(JSON.stringify(header)).toString('base64url');
  const payloadB64 = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET())
    .update(`${headerB64}.${payloadB64}`)
    .digest('base64url');

  return `${headerB64}.${payloadB64}.${signature}`;
}

/**
 * Verify and decode a token. Returns the payload or null if invalid/expired.
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signature] = parts;

    // Verify signature
    const expectedSig = crypto
      .createHmac('sha256', JWT_SECRET())
      .update(`${headerB64}.${payloadB64}`)
      .digest('base64url');

    if (signature !== expectedSig) return null;

    // Decode payload
    const payload: TokenPayload = JSON.parse(
      Buffer.from(payloadB64, 'base64url').toString('utf-8'),
    );

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return null;

    return payload;
  } catch {
    return null;
  }
}

/**
 * Extract and verify the Bearer token from the Authorization header.
 * Returns the decoded payload or null.
 */
export function getAuthFromRequest(req: VercelRequest): TokenPayload | null {
  let token = req.cookies?.kspm_admin_token;

  if (!token && req.headers.cookie) {
    const cookies = req.headers.cookie.split(';').reduce((acc: any, c) => {
      const [key, val] = c.trim().split('=');
      if (key) acc[key] = val;
      return acc;
    }, {});
    token = cookies.kspm_admin_token;
  }

  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    }
  }

  if (!token) return null;
  return verifyToken(token);
}

/**
 * Middleware-style function: verifies auth and sends 401 if invalid.
 * Returns the payload if valid, or null (after sending 401).
 */
export function requireAuth(
  req: VercelRequest,
  res: VercelResponse,
): TokenPayload | null {
  const payload = getAuthFromRequest(req);
  if (!payload) {
    res.status(401).json({ error: 'Unauthorized. Invalid or expired token.' });
    return null;
  }
  return payload;
}

/**
 * Set CORS headers on the response
 */
export function setCors(res: VercelResponse): void {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

/**
 * Handle OPTIONS preflight and return true if handled
 */
export function handlePreflight(req: VercelRequest, res: VercelResponse): boolean {
  setCors(res);
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }
  return false;
}
