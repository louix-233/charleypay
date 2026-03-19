const { initializeTables, dbUtils } = require('./src/api/config/database.ts');

async function seedSQLiteData() {
  try {
    console.log('🌱 Starting SQLite database seeding...');

    // Initialize tables first
    await initializeTables();

    // Sample employees data
    const sampleEmployees = [
      {
        id: 'EMP001',
        first_name: 'Kwame',
        last_name: 'Mensah',
        other_names: '',
        name: 'Kwame Mensah',
        designation: 'Senior Software Engineer',
        email: 'kwame.mensah@company.gh',
        phone: '+233 24 123 4567',
        basic_salary: 8000.00,
        status: 'Active',
        department: 'Engineering',
        hire_date: '2022-01-15',
        address: '123 High Street, Accra',
        emergency_contact: '+233 20 987 6543',
        date_of_birth: '1985-03-15',
        gender: 'Male',
        marital_status: 'Married',
        national_ids: 'GHA-123456789',
        ssnit_number: 'C1234567890',
        tax_identification_number: 'GH123456789',
        job_title: 'Senior Software Engineer',
        employment_type: 'Full-time',
        work_location: 'Accra',
        is_ssnit_contributor: 1,
        is_tier3_contributor: 0,
        tier3_contribution_percentage: 5.0,
        portal_access: 0,
        residency_status: 'Resident',
        nationality: 'Ghanaian',
        bank_name: 'Ghana Commercial Bank',
        bank_account_number: '1234567890'
      },
      {
        id: 'EMP002',
        first_name: 'Ama',
        last_name: 'Osei',
        other_names: '',
        name: 'Ama Osei',
        designation: 'Marketing Manager',
        email: 'ama.osei@company.gh',
        phone: '+233 20 987 6543',
        basic_salary: 12000.00,
        status: 'Active',
        department: 'Marketing',
        hire_date: '2021-06-01',
        address: '456 Ring Road, Kumasi',
        emergency_contact: '+233 24 555 1234',
        date_of_birth: '1990-07-22',
        gender: 'Female',
        marital_status: 'Single',
        national_ids: 'GHA-987654321',
        ssnit_number: 'C0987654321',
        tax_identification_number: 'GH098765432',
        job_title: 'Marketing Manager',
        employment_type: 'Full-time',
        work_location: 'Kumasi',
        is_ssnit_contributor: 1,
        is_tier3_contributor: 1,
        tier3_contribution_percentage: 5.0,
        portal_access: 1,
        portal_password: '$2a$10$hashedpasswordhere', // This would be properly hashed
        residency_status: 'Resident',
        nationality: 'Ghanaian',
        bank_name: 'Ecobank Ghana',
        bank_account_number: '0987654321'
      },
      {
        id: 'EMP003',
        first_name: 'Kofi',
        last_name: 'Addo',
        other_names: '',
        name: 'Kofi Addo',
        designation: 'Sales Representative',
        email: 'kofi.addo@company.gh',
        phone: '+233 26 555 1234',
        basic_salary: 6000.00,
        status: 'Active',
        department: 'Sales',
        hire_date: '2023-03-10',
        address: '789 Tamale Road, Tamale',
        emergency_contact: '+233 20 111 2222',
        date_of_birth: '1988-11-08',
        gender: 'Male',
        marital_status: 'Married',
        national_ids: 'GHA-112233445',
        ssnit_number: 'C1122334455',
        tax_identification_number: 'GH112233445',
        job_title: 'Sales Representative',
        employment_type: 'Full-time',
        work_location: 'Tamale',
        is_ssnit_contributor: 1,
        is_tier3_contributor: 0,
        tier3_contribution_percentage: 5.0,
        portal_access: 0,
        residency_status: 'Resident',
        nationality: 'Ghanaian',
        bank_name: 'Stanbic Bank Ghana',
        bank_account_number: '1122334455'
      },
      {
        id: 'EMP004',
        first_name: 'Efua',
        last_name: 'Sarpong',
        other_names: '',
        name: 'Efua Sarpong',
        designation: 'HR Specialist',
        email: 'efua.sarpong@company.gh',
        phone: '+233 27 777 8888',
        basic_salary: 9000.00,
        status: 'Active',
        department: 'Human Resources',
        hire_date: '2022-09-20',
        address: '321 Cape Coast Road, Cape Coast',
        emergency_contact: '+233 24 999 0000',
        date_of_birth: '1992-04-12',
        gender: 'Female',
        marital_status: 'Single',
        national_ids: 'GHA-556677889',
        ssnit_number: 'C5566778899',
        tax_identification_number: 'GH556677889',
        job_title: 'HR Specialist',
        employment_type: 'Full-time',
        work_location: 'Cape Coast',
        is_ssnit_contributor: 1,
        is_tier3_contributor: 1,
        tier3_contribution_percentage: 5.0,
        portal_access: 1,
        portal_password: '$2a$10$anotherhashedpassword', // This would be properly hashed
        residency_status: 'Resident',
        nationality: 'Ghanaian',
        bank_name: 'Fidelity Bank Ghana',
        bank_account_number: '5566778899'
      },
      {
        id: 'EMP005',
        first_name: 'Yaw',
        last_name: 'Darko',
        other_names: '',
        name: 'Yaw Darko',
        designation: 'Accountant',
        email: 'yaw.darko@company.gh',
        phone: '+233 23 444 5555',
        basic_salary: 10000.00,
        status: 'Active',
        department: 'Finance',
        hire_date: '2021-11-15',
        address: '654 Ho Road, Ho',
        emergency_contact: '+233 20 333 4444',
        date_of_birth: '1987-12-03',
        gender: 'Male',
        marital_status: 'Married',
        national_ids: 'GHA-998877665',
        ssnit_number: 'C9988776655',
        tax_identification_number: 'GH998877665',
        job_title: 'Accountant',
        employment_type: 'Full-time',
        work_location: 'Ho',
        is_ssnit_contributor: 1,
        is_tier3_contributor: 0,
        tier3_contribution_percentage: 5.0,
        portal_access: 0,
        residency_status: 'Resident',
        nationality: 'Ghanaian',
        bank_name: 'Cal Bank',
        bank_account_number: '9988776655'
      }
    ];

    // Insert sample employees
    for (const employee of sampleEmployees) {
      try {
        await dbUtils.execute(
          `INSERT OR REPLACE INTO employees (
            id, name, first_name, other_names, last_name, designation, email, phone,
            basic_salary, status, department, hire_date, address, emergency_contact,
            date_of_birth, gender, marital_status, national_ids, ssnit_number,
            tax_identification_number, job_title, employment_type, work_location,
            is_ssnit_contributor, is_tier3_contributor, tier3_contribution_percentage,
            portal_access, portal_password, residency_status, nationality, bank_name,
            bank_account_number, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            employee.id, employee.name, employee.first_name, employee.other_names, employee.last_name,
            employee.designation, employee.email, employee.phone, employee.basic_salary, employee.status,
            employee.department, employee.hire_date, employee.address, employee.emergency_contact,
            employee.date_of_birth, employee.gender, employee.marital_status, employee.national_ids,
            employee.ssnit_number, employee.tax_identification_number, employee.job_title,
            employee.employment_type, employee.work_location, employee.is_ssnit_contributor,
            employee.is_tier3_contributor, employee.tier3_contribution_percentage, employee.portal_access,
            employee.portal_password, employee.residency_status, employee.nationality, employee.bank_name,
            employee.bank_account_number, new Date().toISOString(), new Date().toISOString()
          ]
        );
        console.log(`✅ Inserted employee: ${employee.name}`);
      } catch (error) {
        console.error(`❌ Error inserting employee ${employee.name}:`, error);
      }
    }

    // Sample allowances
    const sampleAllowances = [
      { employee_id: 'EMP001', type: 'Housing', amount: 2000.00, frequency: 'Monthly' },
      { employee_id: 'EMP001', type: 'Transport', amount: 500.00, frequency: 'Monthly' },
      { employee_id: 'EMP002', type: 'Housing', amount: 2500.00, frequency: 'Monthly' },
      { employee_id: 'EMP002', type: 'Transport', amount: 600.00, frequency: 'Monthly' },
      { employee_id: 'EMP003', type: 'Transport', amount: 400.00, frequency: 'Monthly' },
      { employee_id: 'EMP004', type: 'Housing', amount: 1800.00, frequency: 'Monthly' },
      { employee_id: 'EMP005', type: 'Housing', amount: 2200.00, frequency: 'Monthly' },
      { employee_id: 'EMP005', type: 'Transport', amount: 550.00, frequency: 'Monthly' }
    ];

    // Insert sample allowances
    for (const allowance of sampleAllowances) {
      try {
        const allowanceId = `ALLOW_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await dbUtils.execute(
          `INSERT INTO allowances (id, employee_id, employee_name, type, amount, frequency, status, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            allowanceId, allowance.employee_id, '', allowance.type, allowance.amount,
            allowance.frequency, 'Active', new Date().toISOString(), new Date().toISOString()
          ]
        );
        console.log(`✅ Inserted allowance for employee ${allowance.employee_id}: ${allowance.type}`);
      } catch (error) {
        console.error(`❌ Error inserting allowance:`, error);
      }
    }

    // Sample deductions
    const sampleDeductions = [
      { employee_id: 'EMP001', type: 'Loan Repayment', amount: 300.00, is_percentage: 0, description: 'Personal Loan' },
      { employee_id: 'EMP002', type: 'Union Dues', amount: 50.00, is_percentage: 0, description: 'Monthly Union Fee' },
      { employee_id: 'EMP003', type: 'Insurance', amount: 200.00, is_percentage: 0, description: 'Health Insurance' }
    ];

    // Insert sample deductions
    for (const deduction of sampleDeductions) {
      try {
        const deductionId = `DEDUCT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await dbUtils.execute(
          `INSERT INTO deductions (id, employee_id, employee_name, type, amount, rate, is_percentage, description, status, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            deductionId, deduction.employee_id, '', deduction.type, deduction.amount,
            deduction.amount, deduction.is_percentage, deduction.description, 'Active',
            new Date().toISOString(), new Date().toISOString()
          ]
        );
        console.log(`✅ Inserted deduction for employee ${deduction.employee_id}: ${deduction.type}`);
      } catch (error) {
        console.error(`❌ Error inserting deduction:`, error);
      }
    }

    console.log('🎉 SQLite database seeding completed successfully!');
    console.log('📊 Added 5 sample employees with allowances and deductions');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedSQLiteData()
    .then(() => {
      console.log('✅ SQLite database seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 SQLite database seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedSQLiteData };