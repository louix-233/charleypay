import dotenv from 'dotenv';
dotenv.config();
import { dbUtils } from './src/api/config/database-adapter';

async function listTenants() {
  try {
    console.log('Using database type:', process.env.DB_TYPE || 'sqlite');
    const tenants = await dbUtils.query('SELECT * FROM tenants');
    console.log('All Tenants:', JSON.stringify(tenants, null, 2));
    
    // Also list the users in public schema
    const users = await dbUtils.query('SELECT id, email, role, status FROM users');
    console.log('Public Users:', JSON.stringify(users, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('Error listing tenants:', error.message);
    process.exit(1);
  }
}

listTenants();
