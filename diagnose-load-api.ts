import 'dotenv/config';
import { loadApiRoutes } from './server.ts';

async function runTest() {
  console.log('🔄 Calling loadApiRoutes()...');
  try {
    const success = await loadApiRoutes();
    console.log('Result:', success);
    
    // Check global variables in server.ts unit (we can't easily, but we can check the return of import)
    // Actually, let's just use the server health check logic
  } catch (err) {
    console.error('💥 CRASHED:');
    console.error(err);
  }
}

runTest();
