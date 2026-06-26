import type { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from '../lib/db.js';
import { requireAuth, handlePreflight, setCors } from '../lib/auth.js';
import type { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

interface ContentRow extends RowDataPacket {
  id: number;
  section_key: string;
  content: unknown;
  updated_at: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handlePreflight(req, res)) return;
  setCors(res);

  const { section } = req.query;
  const sectionKey = Array.isArray(section) ? section[0] : section;

  if (!sectionKey) {
    return res.status(400).json({ error: 'Section parameter is required.' });
  }

  try {
    // ----- GET: public -----
    if (req.method === 'GET') {
      const rows = await query<ContentRow[]>(
        'SELECT id, section_key, content, updated_at FROM site_content WHERE section_key = ?',
        [sectionKey],
      );

      if (rows.length === 0) {
        return res.status(404).json({
          error: `Content not found for section: ${sectionKey}`,
        });
      }

      const row = rows[0];
      // MySQL JSON columns are returned as objects already by mysql2,
      // but if stored as a string, parse it.
      const content =
        typeof row.content === 'string' ? JSON.parse(row.content) : row.content;

      return res.status(200).json({
        section_key: row.section_key,
        content,
        updated_at: row.updated_at,
      });
    }

    // ----- PUT: requires auth -----
    if (req.method === 'PUT') {
      const auth = requireAuth(req, res);
      if (!auth) return; // 401 already sent

      const { content } = req.body as { content?: unknown };

      if (content === undefined || content === null) {
        return res.status(400).json({ error: 'Content field is required.' });
      }

      const contentJson = JSON.stringify(content);

      // Upsert: insert or update on duplicate key
      await query<ResultSetHeader>(
        `INSERT INTO site_content (section_key, content)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE content = VALUES(content)`,
        [sectionKey, contentJson],
      );

      return res.status(200).json({
        success: true,
        message: `Content for section '${sectionKey}' updated successfully.`,
        section_key: sectionKey,
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Content error:', error);
    return res.status(500).json({
      error: 'Internal server error.',
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
