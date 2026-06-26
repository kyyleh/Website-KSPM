import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { requireAuth, handlePreflight, setCors } from '../lib/auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handlePreflight(req, res)) return;
  setCors(res);

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Require authentication
  const auth = requireAuth(req, res);
  if (!auth) return;

  try {
    const cloudName = process.env.CLOUDINARY_NAME;
    const apiKey = process.env.CLOUDINARY_KEY;
    const apiSecret = process.env.CLOUDINARY_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return res.status(500).json({
        error: 'Cloudinary credentials are not configured.',
      });
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const folder = 'kspm';
    const allowedFormats = 'png,jpg,jpeg,webp';

    // Build the string to sign (parameters in alphabetical order)
    const paramsToSign = `allowed_formats=${allowedFormats}&folder=${folder}&timestamp=${timestamp}`;
    const signature = crypto
      .createHash('sha1')
      .update(paramsToSign + apiSecret)
      .digest('hex');

    return res.status(200).json({
      timestamp,
      signature,
      cloud_name: cloudName,
      api_key: apiKey,
      folder,
      allowed_formats: allowedFormats,
    });
  } catch (error) {
    console.error('Signature generation error:', error);
    return res.status(500).json({
      error: 'Failed to generate upload signature.',
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
