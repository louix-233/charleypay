import 'dotenv/config';

async function runTest() {
  console.log('🔄 Diagnosing loadApiRoutes hang...');
  
  try {
    console.time('import-auth');
    await import('./src/api/routes/auth.ts');
    console.timeEnd('import-auth');

    console.time('import-employees');
    await import('./src/api/routes/employees.ts');
    console.timeEnd('import-employees');

    console.time('import-tenant-management');
    await import('./src/api/routes/tenant-management.ts');
    console.timeEnd('import-tenant-management');

    console.log('✅ All tested imports finished');
  } catch (err) {
    console.error('💥 Error during import:');
    console.error(err);
  }
}

runTest();
