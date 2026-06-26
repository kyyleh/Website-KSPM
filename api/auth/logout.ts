import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handlePreflight, setCors } from '../lib/auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handlePreflight(req, res)) return;
  setCors(res);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader(
    'Set-Cookie',
    'kspm_admin_token=; Path=/; HttpOnly; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
  );
  return res.status(200).json({ success: true });
}
