import 'dotenv/config';
import { Pool } from 'pg';

const testConnection = async () => {
  const connectionString = process.env.DATABASE_URL;
  console.log('🔍 Testing connection with DATABASE_URL:', connectionString ? '✅ Found' : '❌ Not found');
  
  if (!connectionString) {
    console.log('DB_HOST:', process.env.DB_HOST || 'localhost');
    console.log('DB_PORT:', process.env.DB_PORT || '5432');
    console.log('DB_NAME:', process.env.DB_NAME || 'payrollsmith_gh');
    console.log('DB_USER:', process.env.DB_USER || 'postgres');
  }

  const poolConfig: any = connectionString ? { connectionString } : {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'payrollsmith_gh',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || ''
  };

  const pool = new Pool(poolConfig);
  
  try {
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL successfully!');
    const res = await client.query('SELECT current_database(), current_user, version()');
    console.log('📊 DB Info:', res.rows[0]);
    client.release();
    await pool.end();
    return true;
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    await pool.end();
    return false;
  }
};

testConnection();
