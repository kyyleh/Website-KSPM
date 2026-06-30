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
  setCors(req, res);

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

      let dbSuccess = false;
      let emailSuccess = false;
      let dbError: any = null;

      // 1. Try DB insert
      try {
        await query<ResultSetHeader>(
          'INSERT INTO messages (name, email, phone, message, category) VALUES (?, ?, ?, ?, ?)',
          [name, email, phone || null, message, category || 'contact'],
        );
        dbSuccess = true;
      } catch (err) {
        dbError = err;
        console.error('Database message insertion failed:', err);
      }

      // 2. Try Web3Forms notification (or fallback)
      const web3Key = process.env.WEB3FORMS_ACCESS_KEY;
      if (web3Key) {
        try {
          const subject = category === 'registration'
            ? `Pendaftaran Anggota Baru KSPM - ${name}`
            : `Pesan Kemitraan/Kolaborasi KSPM - ${name}`;

          const web3Body: Record<string, string> = {
            access_key: web3Key,
            name,
            email,
            phone: phone || 'Tidak ada',
            message,
            subject,
            from_name: 'KSPM FEB UIKA Bogor',
          };

          const web3Res = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify(web3Body),
          });

          if (web3Res.ok) {
            const web3Result = await web3Res.json();
            if (web3Result.success) {
              emailSuccess = true;
            } else {
              console.warn('Web3Forms API returned failure:', web3Result);
            }
          } else {
            console.warn('Web3Forms request failed with status:', web3Res.status);
          }
        } catch (emailErr) {
          console.error('Web3Forms dispatch error:', emailErr);
        }
      } else {
        console.warn('WEB3FORMS_ACCESS_KEY is not defined in environment variables.');
      }

      // 3. Determine response status
      if (dbSuccess) {
        return res.status(201).json({
          success: true,
          message: 'Message submitted successfully.',
          email_notified: emailSuccess,
        });
      }

      if (emailSuccess) {
        return res.status(200).json({
          success: true,
          message: 'Message submitted successfully (via email fallback).',
          db_error: dbError instanceof Error ? dbError.message : String(dbError),
        });
      }

      // Both failed
      return res.status(500).json({
        success: false,
        error: 'Failed to submit message to both database and email service.',
        db_details: dbError instanceof Error ? dbError.message : String(dbError),
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
