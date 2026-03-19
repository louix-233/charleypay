import 'dotenv/config';

async function testAuthDeps() {
  console.log('Testing auth.ts dependencies...');
  
  try {
    console.time('express');
    await import('express');
    console.timeEnd('express');

    console.time('bcryptjs');
    await import('bcryptjs');
    console.timeEnd('bcryptjs');

    console.time('jsonwebtoken');
    await import('jsonwebtoken');
    console.timeEnd('jsonwebtoken');

    console.time('express-validator');
    await import('express-validator');
    console.timeEnd('express-validator');

    console.time('uuid');
    await import('uuid');
    console.timeEnd('uuid');

    console.time('database-adapter');
    await import('./src/api/config/database-adapter.ts');
    console.timeEnd('database-adapter');

    console.time('auth-middleware');
    await import('./src/api/middleware/auth.ts');
    console.timeEnd('auth-middleware');

    console.time('environment');
    await import('./src/api/config/environment.ts');
    console.timeEnd('environment');

    console.log('✅ All auth.ts dependencies imported successfully.');
  } catch(e) {
    console.error('Failed:', e);
  }
}

testAuthDeps();
