import type { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from './lib/db.js';
import { hashPassword, handlePreflight, setCors } from './lib/auth.js';
import type { ResultSetHeader } from 'mysql2/promise';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handlePreflight(req, res)) return;
  setCors(res);

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Create admins table
    await query<ResultSetHeader>(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create site_content table
    await query<ResultSetHeader>(`
      CREATE TABLE IF NOT EXISTS site_content (
        id INT AUTO_INCREMENT PRIMARY KEY,
        section_key VARCHAR(100) UNIQUE NOT NULL,
        content JSON NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create messages table
    await query<ResultSetHeader>(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        message TEXT NOT NULL,
        category VARCHAR(100) DEFAULT 'contact',
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Ensure category column exists (for existing tables)
    try {
      await query<ResultSetHeader>(`
        ALTER TABLE messages ADD COLUMN category VARCHAR(100) DEFAULT 'contact'
      `);
    } catch (e) {
      // Ignore if column already exists
    }

    // Insert default admin user (ignore if already exists)
    const hashedPassword = hashPassword('Admin');
    await query<ResultSetHeader>(
      `INSERT IGNORE INTO admins (email, password, name) VALUES (?, ?, ?)`,
      ['Admin', hashedPassword, 'Admin KSPM'],
    );

    return res.status(200).json({
      success: true,
      message: 'Database tables created and default admin seeded successfully.',
      tables: ['admins', 'site_content', 'messages'],
    });
  } catch (error) {
    console.error('Setup error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to initialize database.',
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
