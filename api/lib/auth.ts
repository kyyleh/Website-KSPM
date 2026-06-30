import crypto from 'crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const JWT_SECRET = () => process.env.ADMIN_JWT_SECRET || 'kspm-default-secret-change-me';

export interface TokenPayload {
  id: number;
  email: string;
  exp: number;
}

/**
 * Hash a password using scrypt (Node's built-in secure KDF)
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `$scrypt$${salt}$${hash}`;
}

/**
 * Verify a password against a hash (supports both scrypt and legacy SHA-256 fallback)
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (storedHash.startsWith('$scrypt$')) {
    const parts = storedHash.split('$');
    const salt = parts[2];
    const hash = parts[3];
    const calculatedHash = crypto.scryptSync(password, salt, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(calculatedHash, 'hex'));
  }

  // Legacy fallback: SHA-256
  const legacyHash = crypto.createHash('sha256').update(password).digest('hex');
  return legacyHash === storedHash;
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
export function setCors(req: VercelRequest, res: VercelResponse): void {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
}

/**
 * Handle OPTIONS preflight and return true if handled
 */
export function handlePreflight(req: VercelRequest, res: VercelResponse): boolean {
  setCors(req, res);
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }
  return false;
}
