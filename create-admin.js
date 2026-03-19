import 'dotenv/config';
import AWS from 'aws-sdk';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// Configure AWS
AWS.config.update({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function createDefaultAdmin() {
  console.log('🔐 Creating default admin user...');
  
  try {
    // Check if admin user already exists
    const existingUsers = await dynamoDB.scan({
      TableName: 'payroll-users',
      FilterExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': 'admin@payrollsmith.gh'
      }
    }).promise();

    if (existingUsers.Items && existingUsers.Items.length > 0) {
      console.log('ℹ️  Admin user already exists');
      console.log('📧 Email: admin@payrollsmith.gh');
      console.log('🔑 Password: admin123');
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Create admin user
    const adminUser = {
      id: uuidv4(),
      name: 'Admin User',
      email: 'admin@payrollsmith.gh',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await dynamoDB.put({
      TableName: 'payroll-users',
      Item: adminUser
    }).promise();

    console.log('✅ Default admin user created successfully!');
    console.log('');
    console.log('📋 Admin Credentials:');
    console.log('   📧 Email: admin@payrollsmith.gh');
    console.log('   🔑 Password: admin123');
    console.log('   👤 Role: admin');
    console.log('');
    console.log('✅ You can now login to the application');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

// Run the script
createDefaultAdmin();
