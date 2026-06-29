import type { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from './lib/db.js';
import { requireAuth, handlePreflight, setCors } from './lib/auth.js';
import type { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

interface MessageRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  category: string;
  is_read: boolean;
  created_at: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handlePreflight(req, res)) return;
  setCors(res);

  try {
    // ----- POST: public (contact form submission) -----
    if (req.method === 'POST') {
      const { name, email, phone, message, category } = req.body as {
        name?: string;
        email?: string;
        phone?: string;
        message?: string;
        category?: string;
      };

      if (!name || !email || !message) {
        return res.status(400).json({
          error: 'Name, email, and message are required.',
        });
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format.' });
      }

      await query<ResultSetHeader>(
        'INSERT INTO messages (name, email, phone, message, category) VALUES (?, ?, ?, ?, ?)',
        [name, email, phone || null, message, category || 'contact'],
      );

      return res.status(201).json({
        success: true,
        message: 'Message submitted successfully.',
      });
    }

    // ----- GET: requires auth (admin listing) -----
    if (req.method === 'GET') {
      const auth = requireAuth(req, res);
      if (!auth) return;

      const rows = await query<MessageRow[]>(
        'SELECT id, name, email, phone, message, is_read, category, created_at FROM messages ORDER BY created_at DESC',
      );

      return res.status(200).json({
        success: true,
        messages: rows,
        total: rows.length,
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Messages error:', error);
    return res.status(500).json({
      error: 'Internal server error.',
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
