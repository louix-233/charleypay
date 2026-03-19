import fs from 'fs';
import { initMasterDatabase } from './src/api/config/tenant-database';

async function checkMasterDB() {
  try {
    const master = await initMasterDatabase();
    
    const tenants = await master.all('SELECT * FROM tenants');
    const users = await master.all('SELECT * FROM tenant_users');
    
    fs.writeFileSync('tenant_dump.json', JSON.stringify({ tenants, users }, null, 2));
    console.log('Dumped to tenant_dump.json');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkMasterDB();
