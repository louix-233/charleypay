import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { dbUtils } from './src/api/config/database';

const testLogin = async () => {
  const email = 'admin@payrollsmith.gh';
  const password = 'admin123';

  try {
    console.log(`🔍 Testing login for: ${email}`);
    const user = await dbUtils.getRow('SELECT * FROM users WHERE email = ?', [email]);
    
    if (!user) {
      console.log('❌ User not found in database');
      process.exit(1);
    }

    console.log('👤 User found:', user.email);
    console.log('🔐 Hashed password from DB:', user.password_hash);

    const isMatch = await bcrypt.compare(password, user.password_hash);
    console.log('✅ Password match result:', isMatch);

    if (isMatch) {
      console.log('🚀 Login successful simulation complete');
    } else {
      console.log('❌ Password mismatch');
    }
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during login test:', err);
    process.exit(1);
  }
};

testLogin();
