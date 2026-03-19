import 'dotenv/config';
import { dbUtils } from './src/api/config/database';

const checkUsers = async () => {
  try {
    console.log('🔍 Checking users in PostgreSQL...');
    const users = await dbUtils.getRows('SELECT * FROM users');
    console.log('📋 Users found:', users.length);
    users.forEach(u => {
      console.log(`- ID: ${u.id}, Username: ${u.username}, Email: ${u.email}, Role: ${u.role}, Status: ${u.status}`);
    });
    process.exit(0);
  } catch (err) {
    console.error('❌ Error checking users:', err);
    process.exit(1);
  }
};

checkUsers();
