async function checkImports() {
  console.log('🔍 Checking API module imports...');
  try {
    console.log('Importing tenant-database.ts...');
    await import('./src/api/config/tenant-database.ts'); 
    console.log('✅ tenant-database loaded');

    console.log('Importing tenant-management.ts...');
    await import('./src/api/routes/tenant-management.ts');
    console.log('✅ tenant-management loaded');

    console.log('Importing tenantMiddleware.ts...');
    await import('./src/api/middleware/tenantMiddleware.ts');
    console.log('✅ tenantMiddleware loaded');

  } catch (error) {
    console.error('❌ Import failed:');
    console.error(error);
    process.exit(1);
  }
}

checkImports();
