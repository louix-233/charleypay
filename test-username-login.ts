import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { dbUtils } from './src/api/config/database-adapter';

const testUsernameLogin = async () => {
  const username = 'admin'; // Testing username instead of email
  const password = 'admin123';

  try {
    console.log(`🔍 Testing login for username: ${username}`);
    
    // Logic from refactored auth.ts
    const sqlUser = await dbUtils.getRow(
      'SELECT * FROM users WHERE email = ? OR username = ?', 
      [username, username]
    );
    
    if (!sqlUser) {
      console.log('❌ User not found in PostgreSQL');
      process.exit(1);
    }

    console.log('👤 User found:', sqlUser.username, `(${sqlUser.email})`);
    
    const isMatch = await bcrypt.compare(password, sqlUser.password_hash);
    console.log('✅ Password match result:', isMatch);

    if (isMatch) {
      console.log('🚀 Username login successful simulation complete');
    } else {
      console.log('❌ Password mismatch');
    }
    process.exit(0);
  } catch (err) {
    console.error('❌ Simulation failed:', err);
    process.exit(1);
  }
};

testUsernameLogin();
