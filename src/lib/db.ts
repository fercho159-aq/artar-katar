import { Pool } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default pool;

export async function dbQuery(query: string, params: any[] = []) {
    const client = await pool.connect();
    try {
        const result = await client.query(query, params);
        return result.rows;
    } finally {
        client.release();
    }
}
