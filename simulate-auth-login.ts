import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { dbUtils } from './src/api/config/database-adapter';

const simulateAuthLogin = async () => {
  const email = 'admin@payrollsmith.gh';
  const password = 'admin123';

  try {
    console.log(`🔐 Simulating auth login for: ${email}`);
    
    // Exact logic from auth.ts
    const sqlUser = await dbUtils.getRow('SELECT * FROM users WHERE email = ?', [email]);
    
    if (!sqlUser) {
      console.log('❌ No user found in PostgreSQL');
      process.exit(1);
    }

    console.log('👤 User found in SQL:', sqlUser.email);
    
    const user = {
      id: sqlUser.id,
      name: `${sqlUser.first_name || ''} ${sqlUser.last_name || ''}`.trim() || sqlUser.username,
      email: sqlUser.email,
      password: sqlUser.password_hash,
      role: sqlUser.role,
      isActive: (sqlUser.status || '').toLowerCase() === 'active'
    };

    console.log('🔐 Checking password...');
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('✅ Password match:', isMatch);

    if (!user.isActive) {
      console.log('❌ User is inactive');
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Simulation failed:', err);
    process.exit(1);
  }
};

simulateAuthLogin();
