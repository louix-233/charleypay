import { dbUtils } from './src/api/config/database-adapter.js';

async function listTenants() {
  try {
    const tenants = await dbUtils.query('SELECT * FROM tenants');
    console.log('All Tenants:', JSON.stringify(tenants, null, 2));
  } catch (error) {
    console.error('Error listing tenants:', error.message);
  }
}

listTenants();
