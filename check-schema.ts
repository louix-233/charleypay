
import { Pool } from 'pg';
import 'dotenv/config';

async function check() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || process.env.DATABASE_URL_EXTERNAL,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'payrollsmith_gh',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
  });

  try {
    const res = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'employees' 
      AND column_name IN ('is_ssnit_contributor', 'is_tier3_contributor', 'portal_access', 'must_change_password', 'first_login', 'secondary_employment', 'paid_ssnit')
    `);
    console.log('📋 Column Types:', JSON.stringify(res.rows, null, 2));
  } catch (err: any) {
    console.error('❌ Error checking schema:', err.message);
  } finally {
    await pool.end();
  }
}

check();
