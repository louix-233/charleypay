import 'dotenv/config';
import { migrateDynamoDBToPostgres } from './src/api/config/migrate-dynamodb-to-postgres';

const testMigration = async () => {
  try {
    console.log('🚀 Calling migrateDynamoDBToPostgres...');
    await migrateDynamoDBToPostgres();
    console.log('✅ migrateDynamoDBToPostgres completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ migrateDynamoDBToPostgres failed:', err);
    process.exit(1);
  }
};

testMigration();
