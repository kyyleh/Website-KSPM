import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAuthFromRequest, handlePreflight, setCors } from '../lib/auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handlePreflight(req, res)) return;
  setCors(req, res);

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const payload = getAuthFromRequest(req);

  if (!payload) {
    return res.status(401).json({
      valid: false,
      error: 'Invalid or expired token.',
    });
  }

  return res.status(200).json({
    valid: true,
    admin: {
      id: payload.id,
      email: payload.email,
    },
  });
}
