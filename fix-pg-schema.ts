import 'dotenv/config';
import { dbUtils } from './src/api/config/database';

const forceSchemaFix = async () => {
  try {
    console.log('🔄 Force-updating PostgreSQL employees table schema...');
    
    // Check current columns
    const columnsResult = await dbUtils.getRows(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'employees'
    `);
    
    const existingColumns = columnsResult.map(c => c.column_name);
    console.log('📋 Existing columns:', existingColumns.join(', '));

    const columnsToAdd = [
      { name: 'password_hash', type: 'TEXT' },
      { name: 'portal_password', type: 'TEXT' },
      { name: 'bank_name', type: 'VARCHAR(255)' },
      { name: 'bank_account_number', type: 'VARCHAR(255)' },
      { name: 'bank_branch', type: 'VARCHAR(255)' },
      { name: 'must_change_password', type: 'INTEGER DEFAULT 1' },
      { name: 'first_login', type: 'INTEGER DEFAULT 1' },
      { name: 'last_login', type: 'VARCHAR(255)' },
      { name: 'password_changed_at', type: 'VARCHAR(255)' }
    ];

    for (const col of columnsToAdd) {
      if (!existingColumns.includes(col.name)) {
        console.log(`➕ Adding column: ${col.name}...`);
        try {
          await dbUtils.execute(`ALTER TABLE employees ADD COLUMN ${col.name} ${col.type}`);
          console.log(`✅ Column ${col.name} added.`);
        } catch (err) {
          console.error(`❌ Failed to add ${col.name}:`, err.message);
        }
      } else {
        console.log(`ℹ️ Column ${col.name} already exists.`);
      }
    }

    console.log('🚀 Schema fix complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Critical error during schema fix:', err);
    process.exit(1);
  }
};

forceSchemaFix();
