import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Database configuration - using SQLite for simplicity
const dbPath = './payroll.db';

let db = null;

// Initialize database connection
const initDatabase = async () => {
  if (!db) {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
  }
  return db;
};

async function debugSeed() {
  try {
    console.log('🔍 Debugging database seeding...');

    const database = await initDatabase();

    // Check if tables exist
    const tables = await database.all("SELECT name FROM sqlite_master WHERE type='table'");
    console.log('Tables found:', tables.map(t => t.name));

    // Check employees table structure
    const employeesColumns = await database.all("PRAGMA table_info(employees)");
    console.log('Employees table columns:', employeesColumns.map(c => c.name));

    // Try to insert a simple employee
    console.log('Attempting to insert test employee...');
    const testEmployee = {
      id: 'TEST001',
      name: 'Test Employee',
      first_name: 'Test',
      last_name: 'Employee',
      designation: 'Tester',
      email: 'test@example.com',
      phone: '+233 24 123 4567',
      basic_salary: 5000.00,
      status: 'Active',
      department: 'Testing',
      hire_date: '2024-01-01',
      address: 'Test Address',
      emergency_contact: '+233 20 987 6543',
      date_of_birth: '1990-01-01',
      gender: 'Male',
      marital_status: 'Single',
      national_ids: 'TEST123',
      ssnit_number: 'T123456789',
      tax_identification_number: 'TEST123',
      job_title: 'Tester',
      employment_type: 'Full-time',
      work_location: 'Test Location',
      is_ssnit_contributor: 1,
      is_tier3_contributor: 0,
      tier3_contribution_percentage: 5.0,
      portal_access: 0,
      residency_status: 'Resident',
      nationality: 'Ghanaian',
      bank_name: 'Test Bank',
      bank_account_number: '1234567890'
    };

    await database.run(
      `INSERT INTO employees (
        id, name, first_name, last_name, designation, email, phone,
        basic_salary, status, department, hire_date, address, emergency_contact,
        date_of_birth, gender, marital_status, national_ids, ssnit_number,
        tax_identification_number, job_title, employment_type, work_location,
        is_ssnit_contributor, is_tier3_contributor, tier3_contribution_percentage,
        portal_access, residency_status, nationality, bank_name,
        bank_account_number, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        testEmployee.id, testEmployee.name, testEmployee.first_name, testEmployee.last_name,
        testEmployee.designation, testEmployee.email, testEmployee.phone, testEmployee.basic_salary,
        testEmployee.status, testEmployee.department, testEmployee.hire_date, testEmployee.address,
        testEmployee.emergency_contact, testEmployee.date_of_birth, testEmployee.gender,
        testEmployee.marital_status, testEmployee.national_ids, testEmployee.ssnit_number,
        testEmployee.tax_identification_number, testEmployee.job_title, testEmployee.employment_type,
        testEmployee.work_location, testEmployee.is_ssnit_contributor, testEmployee.is_tier3_contributor,
        testEmployee.tier3_contribution_percentage, testEmployee.portal_access,
        testEmployee.residency_status, testEmployee.nationality, testEmployee.bank_name,
        testEmployee.bank_account_number, new Date().toISOString(), new Date().toISOString()
      ]
    );

    console.log('✅ Test employee inserted successfully');

    // Check count after insertion
    const count = await database.get('SELECT COUNT(*) as count FROM employees');
    console.log(`Total employees after test insert: ${count.count}`);

    // Close database
    await database.close();

  } catch (error) {
    console.error('❌ Debug seeding failed:', error);
    throw error;
  }
}

// Run debug
debugSeed()
  .then(() => {
    console.log('✅ Debug seeding completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Debug seeding failed:', error);
    process.exit(1);
  });