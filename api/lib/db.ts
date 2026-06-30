import mysql from 'mysql2/promise';
import type { Pool, RowDataPacket, ResultSetHeader, OkPacket } from 'mysql2/promise';

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

export async function query<T extends RowDataPacket[] | ResultSetHeader | OkPacket>(
  sql: string,
  params?: unknown[],
): Promise<T> {
  if (mockQueryFn) {
    return mockQueryFn(sql, params) as Promise<T>;
  }
  const db = getPool();
  const [rows] = await db.execute<T>(sql, params as any);
  return rows;
}

export default getPool;
