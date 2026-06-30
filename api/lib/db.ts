import mysql from 'mysql2/promise';
import type { Pool, RowDataPacket, ResultSetHeader, OkPacket } from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT) || 3306,
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      ssl:
        process.env.DATABASE_SSL === 'true'
          ? { rejectUnauthorized: false }
          : undefined,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
    });
  }
  return pool;
}

let mockQueryFn: ((sql: string, params?: unknown[]) => Promise<any>) | null = null;

export function setMockQuery(fn: typeof mockQueryFn) {
  mockQueryFn = fn;
}

// --- Local JSON DB Mock Fallback Implementation ---
const MOCK_DB_FILE = path.resolve(process.cwd(), 'local-db.json');

function readMockDb() {
  if (!fs.existsSync(MOCK_DB_FILE)) {
    fs.writeFileSync(MOCK_DB_FILE, JSON.stringify({ admins: [], site_content: [], messages: [] }, null, 2));
  }
  try {
    return JSON.parse(fs.readFileSync(MOCK_DB_FILE, 'utf-8'));
  } catch {
    return { admins: [], site_content: [], messages: [] };
  }
}

function writeMockDb(data: any) {
  fs.writeFileSync(MOCK_DB_FILE, JSON.stringify(data, null, 2));
}

async function runMockQuery(sql: string, params: any[] = []): Promise<any> {
  const db = readMockDb();
  const normalizedSql = sql.trim().replace(/\s+/g, ' ');

  // 1. CREATE TABLE
  if (normalizedSql.toUpperCase().startsWith('CREATE TABLE')) {
    return { affectedRows: 0 };
  }

  // 2. ALTER TABLE
  if (normalizedSql.toUpperCase().startsWith('ALTER TABLE')) {
    return { affectedRows: 0 };
  }

  // 3. SELECT FROM admins
  if (normalizedSql.includes('SELECT id, email, password, name FROM admins WHERE email = ?')) {
    const email = params[0];
    const match = db.admins.filter((u: any) => u.email === email);
    return match;
  }

  // 4. INSERT IGNORE INTO admins
  if (normalizedSql.includes('INSERT IGNORE INTO admins')) {
    const [email, password, name] = params;
    const exists = db.admins.some((u: any) => u.email === email);
    if (!exists) {
      const nextId = db.admins.length > 0 ? Math.max(...db.admins.map((u: any) => u.id)) + 1 : 1;
      db.admins.push({ id: nextId, email, password, name, created_at: new Date().toISOString() });
      writeMockDb(db);
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  // 5. SELECT FROM site_content
  if (normalizedSql.includes('SELECT id, section_key, content, updated_at FROM site_content WHERE section_key = ?')) {
    const sectionKey = params[0];
    const match = db.site_content.filter((c: any) => c.section_key === sectionKey);
    return match;
  }

  // 6. INSERT INTO site_content ... ON DUPLICATE KEY UPDATE
  if (normalizedSql.includes('INSERT INTO site_content')) {
    const [section_key, content] = params;
    const existingIndex = db.site_content.findIndex((c: any) => c.section_key === section_key);
    if (existingIndex !== -1) {
      db.site_content[existingIndex].content = typeof content === 'string' ? JSON.parse(content) : content;
      db.site_content[existingIndex].updated_at = new Date().toISOString();
    } else {
      const nextId = db.site_content.length > 0 ? Math.max(...db.site_content.map((c: any) => c.id)) + 1 : 1;
      db.site_content.push({
        id: nextId,
        section_key,
        content: typeof content === 'string' ? JSON.parse(content) : content,
        updated_at: new Date().toISOString()
      });
    }
    writeMockDb(db);
    return { affectedRows: 1 };
  }

  // 7. INSERT INTO messages
  if (normalizedSql.includes('INSERT INTO messages')) {
    const [name, email, phone, message, category] = params;
    const nextId = db.messages.length > 0 ? Math.max(...db.messages.map((m: any) => m.id)) + 1 : 1;
    db.messages.push({
      id: nextId,
      name,
      email,
      phone,
      message,
      category: category || 'contact',
      is_read: false,
      created_at: new Date().toISOString()
    });
    writeMockDb(db);
    return { affectedRows: 1 };
  }

  // 8. SELECT FROM messages
  if (normalizedSql.includes('SELECT id, name, email, phone, message, is_read, category, created_at FROM messages')) {
    return [...db.messages].sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  // 9. UPDATE messages SET is_read = TRUE WHERE id = ?
  if (normalizedSql.includes('UPDATE messages SET is_read = TRUE WHERE id = ?')) {
    const id = Number(params[0]);
    const msg = db.messages.find((m: any) => m.id === id);
    if (msg) {
      msg.is_read = true;
      writeMockDb(db);
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  // 10. DELETE FROM messages WHERE id = ?
  if (normalizedSql.includes('DELETE FROM messages WHERE id = ?')) {
    const id = Number(params[0]);
    const initialLen = db.messages.length;
    db.messages = db.messages.filter((m: any) => m.id !== id);
    if (db.messages.length < initialLen) {
      writeMockDb(db);
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  console.warn(`[Mock DB] Unknown query: ${sql}`);
  return [];
}

export async function query<T extends RowDataPacket[] | ResultSetHeader | OkPacket>(
  sql: string,
  params?: unknown[],
): Promise<T> {
  if (mockQueryFn) {
    return mockQueryFn(sql, params) as Promise<T>;
  }

  // Fallback to local JSON database if DATABASE_HOST environment variable is not defined
  if (!process.env.DATABASE_HOST) {
    return runMockQuery(sql, params as any[]) as Promise<T>;
  }

  const db = getPool();
  const [rows] = await db.execute<T>(sql, params as any);
  return rows;
}

export default getPool;
