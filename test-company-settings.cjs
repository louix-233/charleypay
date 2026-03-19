const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Test database connection
const dbPath = path.join(process.cwd(), 'payroll.db');
const db = new sqlite3.Database(dbPath);

console.log('Testing company settings...');

// Test 1: Check if company_settings table exists
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='company_settings'", (err, row) => {
  if (err) {
    console.error('Error checking table:', err);
    return;
  }
  
  if (row) {
    console.log('✅ company_settings table exists');
    
    // Test 2: Check if there's data in the table
    db.get("SELECT * FROM company_settings WHERE id = 1", (err, row) => {
      if (err) {
        console.error('Error fetching data:', err);
        return;
      }
      
      if (row) {
        console.log('✅ Company settings data found:', row);
      } else {
        console.log('⚠️ No company settings data found, creating default...');
        
        // Insert default settings
        db.run(`INSERT INTO company_settings (id, company_name, currency, tax_year, payday, auto_calculate, email_notifications, sms_notifications, backup_frequency, retention_period, logo_url, address, phone, email, website) 
                VALUES (1, 'PayrollSmith Ghana', 'GHS', '2024', '25', 1, 1, 0, 'daily', '7', NULL, '', '', '', '')`, (err) => {
          if (err) {
            console.error('Error inserting default settings:', err);
          } else {
            console.log('✅ Default company settings created');
          }
          db.close();
        });
      }
    });
  } else {
    console.log('❌ company_settings table does not exist');
    db.close();
  }
});
