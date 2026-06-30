import type { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from '../lib/db.js';
import { requireAuth, handlePreflight, setCors } from '../lib/auth.js';
import type { ResultSetHeader } from 'mysql2/promise';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handlePreflight(req, res)) return;
  setCors(req, res);

  // Require authentication for all operations
  const auth = requireAuth(req, res);
  if (!auth) return;

  const { id } = req.query;
  const messageId = Array.isArray(id) ? id[0] : id;

  if (!messageId || isNaN(Number(messageId))) {
    return res.status(400).json({ error: 'Valid message ID is required.' });
  }

  const numericId = Number(messageId);

  try {
    // ----- PUT: mark as read -----
    if (req.method === 'PUT') {
      const result = await query<ResultSetHeader>(
        'UPDATE messages SET is_read = TRUE WHERE id = ?',
        [numericId],
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Message not found.' });
      }

      return res.status(200).json({
        success: true,
        message: 'Message marked as read.',
      });
    }

    // ----- DELETE: remove message -----
    if (req.method === 'DELETE') {
      const result = await query<ResultSetHeader>(
        'DELETE FROM messages WHERE id = ?',
        [numericId],
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Message not found.' });
      }

      return res.status(200).json({
        success: true,
        message: 'Message deleted successfully.',
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Message action error:', error);
    return res.status(500).json({
      error: 'Internal server error.',
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
