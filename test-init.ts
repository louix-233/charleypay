import 'dotenv/config';
import { initializePostgreSQLTables } from './src/api/config/database';

const testInit = async () => {
  try {
    console.log('🔄 Calling initializePostgreSQLTables...');
    await initializePostgreSQLTables();
    console.log('✅ initializePostgreSQLTables completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ initializePostgreSQLTables failed:', err);
    process.exit(1);
  }
};

testInit();
