import 'dotenv/config';
import AWS from 'aws-sdk';

// Configure AWS
AWS.config.update({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const dynamoDB = new AWS.DynamoDB();

// Table definitions
const tables = [
  {
    TableName: 'payroll-users',
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
    BillingMode: 'PAY_PER_REQUEST'
  },
  {
    TableName: 'payroll-employees',
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
    BillingMode: 'PAY_PER_REQUEST'
  },
  {
    TableName: 'payroll-periods',
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
    BillingMode: 'PAY_PER_REQUEST'
  },
  {
    TableName: 'payroll-records',
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
    BillingMode: 'PAY_PER_REQUEST'
  },
  {
    TableName: 'payroll-allowance-types',
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
    BillingMode: 'PAY_PER_REQUEST'
  },
  {
    TableName: 'payroll-employee-allowances',
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
    BillingMode: 'PAY_PER_REQUEST'
  },
  {
    TableName: 'payroll-payslips',
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
    BillingMode: 'PAY_PER_REQUEST'
  },
  {
    TableName: 'payroll-companies',
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
    BillingMode: 'PAY_PER_REQUEST'
  },
  {
    TableName: 'payroll-departments',
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
    BillingMode: 'PAY_PER_REQUEST'
  },
  {
    TableName: 'payroll-audit-logs',
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
    BillingMode: 'PAY_PER_REQUEST'
  }
];

async function createTable(tableDefinition) {
  try {
    await dynamoDB.createTable(tableDefinition).promise();
    console.log(`✅ Created table: ${tableDefinition.TableName}`);
    
    // Wait for table to be active
    await dynamoDB.waitFor('tableExists', { TableName: tableDefinition.TableName }).promise();
    console.log(`✅ Table ${tableDefinition.TableName} is now active`);
  } catch (error) {
    if (error.code === 'ResourceInUseException') {
      console.log(`ℹ️  Table ${tableDefinition.TableName} already exists`);
    } else {
      console.error(`❌ Error creating table ${tableDefinition.TableName}:`, error.message);
      throw error;
    }
  }
}

async function createAllTables() {
  console.log('🚀 Starting table creation...');
  console.log('📊 AWS Region:', process.env.AWS_REGION || 'us-east-1');
  console.log('🔑 AWS Access Key:', process.env.AWS_ACCESS_KEY_ID ? '✅ Set' : '❌ Not set');
  console.log('🔐 AWS Secret Key:', process.env.AWS_SECRET_ACCESS_KEY ? '✅ Set' : '❌ Not set');
  console.log('');

  try {
    for (const table of tables) {
      await createTable(table);
    }
    
    console.log('');
    console.log('🎉 All tables created successfully!');
    console.log('');
    console.log('📋 Created tables:');
    tables.forEach(table => {
      console.log(`   • ${table.TableName}`);
    });
    console.log('');
    console.log('✅ You can now start the application with: npm run dev');
    
  } catch (error) {
    console.error('❌ Failed to create tables:', error);
    process.exit(1);
  }
}

// Run the script
createAllTables();
