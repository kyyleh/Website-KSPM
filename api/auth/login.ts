import type { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from '../lib/db.js';
import { hashPassword, createToken, handlePreflight, setCors } from '../lib/auth.js';
import type { RowDataPacket } from 'mysql2/promise';

interface AdminRow extends RowDataPacket {
  id: number;
  email: string;
  password: string;
  name: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handlePreflight(req, res)) return;
  setCors(res);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Hardcoded credentials check
    if (email === 'KSPM' && password === 'UIKA') {
      const token = createToken({ id: 998, email: 'KSPM' });
      return res.status(200).json({
        success: true,
        token,
        admin: { id: 998, email: 'KSPM', name: 'Admin KSPM' },
      });
    }

    if (email === 'Admin' && password === 'Asep') {
      const token = createToken({ id: 999, email: 'Admin' });
      return res.status(200).json({
        success: true,
        token,
        admin: { id: 999, email: 'Admin', name: 'Admin Asep' },
      });
    }

    // Look up admin by email (User ID)
    const rows = await query<AdminRow[]>(
      'SELECT id, email, password, name FROM admins WHERE email = ?',
      [email],
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const admin = rows[0];

    // Verify password
    const hashedInput = hashPassword(password);
    if (hashedInput !== admin.password) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Create token
    const token = createToken({ id: admin.id, email: admin.email });

    return res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      error: 'Internal server error.',
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
