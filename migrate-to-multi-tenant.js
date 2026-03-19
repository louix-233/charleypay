#!/usr/bin/env node

/**
 * Migration Script: Single-Tenant to Multi-Tenant
 * 
 * This script migrates your existing payroll.db to a multi-tenant architecture.
 * It will:
 * 1. Create the master database with tenant registry
 * 2. Create a "default" tenant for your existing data
 * 3. Move payroll.db to databases/tenant_default.db
 * 4. Create an admin user for the default tenant
 */

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log('\n🔄 PayrollSmith Multi-Tenant Migration\n');
  console.log('This script will convert your single-tenant database to multi-tenant architecture.\n');

  // Check if payroll.db exists
  if (!fs.existsSync('./payroll.db')) {
    console.log('❌ payroll.db not found. Nothing to migrate.');
    console.log('   If you\'re starting fresh, just run the server and create tenants via the API.');
    rl.close();
    return;
  }

  console.log('✅ Found existing payroll.db\n');

  // Get company details
  console.log('Let\'s set up your company account:\n');
  
  const companyName = await question('Company Name: ');
  const subdomain = await question('Subdomain (e.g., "acme-corp"): ');
  const contactEmail = await question('Admin Email: ');
  const adminFirstName = await question('Admin First Name: ');
  const adminLastName = await question('Admin Last Name: ');
  const adminPassword = await question('Admin Password: ');

  console.log('\n📋 Migration Summary:');
  console.log(`   Company: ${companyName}`);
  console.log(`   Subdomain: ${subdomain}`);
  console.log(`   Admin: ${adminFirstName} ${adminLastName} (${contactEmail})`);
  console.log(`   Database will be: databases/tenant_${subdomain}.db\n`);

  const confirm = await question('Proceed with migration? (yes/no): ');
  
  if (confirm.toLowerCase() !== 'yes') {
    console.log('\n❌ Migration cancelled.');
    rl.close();
    return;
  }

  console.log('\n🚀 Starting migration...\n');

  try {
    // Step 1: Create databases directory
    const dbDir = './databases';
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
      console.log('✅ Created databases directory');
    }

    // Step 2: Create master database
    console.log('📝 Creating master database...');
    const masterDb = new sqlite3.Database(path.join(dbDir, 'master.db'));

    await new Promise((resolve, reject) => {
      masterDb.serialize(() => {
        // Create tenants table
        masterDb.run(`
          CREATE TABLE IF NOT EXISTS tenants (
            id TEXT PRIMARY KEY,
            company_name TEXT NOT NULL,
            subdomain TEXT UNIQUE NOT NULL,
            database_name TEXT NOT NULL,
            status TEXT DEFAULT 'active',
            plan_type TEXT DEFAULT 'trial',
            max_employees INTEGER DEFAULT 50,
            email_host TEXT,
            email_port INTEGER,
            email_user TEXT,
            email_pass TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            subscription_starts_at TEXT,
            subscription_ends_at TEXT,
            contact_email TEXT,
            contact_phone TEXT,
            address TEXT,
            logo_url TEXT,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Create tenant_users table
        masterDb.run(`
          CREATE TABLE IF NOT EXISTS tenant_users (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            email TEXT NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT DEFAULT 'admin',
            first_name TEXT,
            last_name TEXT,
            is_active INTEGER DEFAULT 1,
            last_login TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
            UNIQUE(tenant_id, email)
          )
        `, resolve);
      });
    });

    console.log('✅ Master database created');

    // Step 3: Generate IDs
    const tenantId = `tenant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const databaseName = `tenant_${subdomain.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

    // Step 4: Insert tenant record
    console.log('📝 Creating tenant record...');
    
    await new Promise((resolve, reject) => {
      masterDb.run(`
        INSERT INTO tenants (
          id, company_name, subdomain, database_name, contact_email,
          status, plan_type, subscription_starts_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        tenantId,
        companyName,
        subdomain,
        databaseName,
        contactEmail,
        'active',
        'trial',
        new Date().toISOString()
      ], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    console.log('✅ Tenant record created');

    // Step 5: Create admin user
    console.log('📝 Creating admin user...');
    
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    
    await new Promise((resolve, reject) => {
      masterDb.run(`
        INSERT INTO tenant_users (
          id, tenant_id, email, password_hash, role, first_name, last_name
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        userId,
        tenantId,
        contactEmail,
        passwordHash,
        'admin',
        adminFirstName,
        adminLastName
      ], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    console.log('✅ Admin user created');

    // Step 6: Move existing database
    console.log('📦 Moving existing database...');
    
    const newDbPath = path.join(dbDir, `${databaseName}.db`);
    
    // Copy instead of move to keep backup
    fs.copyFileSync('./payroll.db', newDbPath);
    
    console.log(`✅ Database copied to ${newDbPath}`);

    // Step 7: Backup original
    const backupPath = `./payroll.db.backup.${Date.now()}`;
    fs.renameSync('./payroll.db', backupPath);
    console.log(`✅ Original database backed up to ${backupPath}`);

    // Close databases
    masterDb.close();

    // Success!
    console.log('\n✅ Migration completed successfully!\n');
    console.log('📊 Next steps:\n');
    console.log('1. Start your server: npm run dev');
    console.log(`2. Access your app: http://${subdomain}.localhost:5173`);
    console.log(`3. Login with: ${contactEmail}`);
    console.log('\n💡 You can now create additional companies via the signup API.');
    console.log('   See MULTI_TENANCY_IMPLEMENTATION_GUIDE.md for details.\n');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('\nPlease restore your backup and try again.');
  }

  rl.close();
}

main().catch(console.error);

