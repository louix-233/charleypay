import { dbUtils } from './src/api/config/database.ts';

async function testEmployeeCreation() {
  try {
    console.log('Testing employee creation...');

    // Test data
    const testEmployee = {
      id: 'TEST001',
      name: 'Test Employee',
      first_name: 'Test',
      last_name: 'Employee',
      designation: 'Software Developer',
      email: 'test@example.com',
      phone: '+233 24 123 4567',
      basicSalary: 50000,
      status: 'Active',
      department: 'Engineering',
      hireDate: '2024-01-01',
      address: 'Test Address, Accra',
      emergencyContact: '+233 24 123 4568',
      dateOfBirth: '1990-01-01',
      gender: 'Male',
      maritalStatus: 'Single',
      isSsnitContributor: true,
      isTier3Contributor: false,
      tier3ContributionPercentage: 5,
      portal_access: false,
      residencyStatus: 'resident',
      nationality: 'Ghanaian'
    };

    // Build national IDs JSON
    const nationalIds = {
      ssnitNumber: '1234567890',
      taxIdentificationNumber: 'TIN123456789'
    };

    console.log('Inserting test employee...');
    const result = await dbUtils.insert(
      `INSERT INTO employees (
        id, name, first_name, other_names, last_name, designation, email, phone, basic_salary, status, department,
        hire_date, address, emergency_contact, date_of_birth, gender, marital_status,
        national_ids, ssnit_number, tax_identification_number, job_title, employment_type, work_location,
        is_ssnit_contributor, is_tier3_contributor, tier3_contribution_percentage, portal_access,
        residency_status, nationality, bank_account_number, bank_branch
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        testEmployee.id,
        testEmployee.name,
        testEmployee.first_name || null,
        null, // other_names
        testEmployee.last_name || null,
        testEmployee.designation,
        testEmployee.email,
        testEmployee.phone,
        testEmployee.basicSalary,
        testEmployee.status || 'Active',
        testEmployee.department,
        testEmployee.hireDate,
        testEmployee.address,
        testEmployee.emergencyContact,
        testEmployee.dateOfBirth,
        testEmployee.gender,
        testEmployee.maritalStatus,
        JSON.stringify(nationalIds),
        nationalIds.ssnitNumber || null,
        nationalIds.taxIdentificationNumber || null,
        null, // job_title
        null, // employment_type
        null, // work_location
        testEmployee.isSsnitContributor,
        testEmployee.isTier3Contributor,
        testEmployee.tier3ContributionPercentage,
        testEmployee.portal_access || false,
        testEmployee.residencyStatus || null,
        testEmployee.nationality || null,
        null, // bank_account_number
        null  // bank_branch
      ]
    );

    console.log('✅ Employee created successfully:', result);

    // Verify the employee was created
    const createdEmployee = await dbUtils.getRow('SELECT * FROM employees WHERE id = ?', [testEmployee.id]);
    console.log('✅ Retrieved created employee:', createdEmployee);

    // Clean up test data
    await dbUtils.delete('DELETE FROM employees WHERE id = ?', [testEmployee.id]);
    console.log('✅ Test employee cleaned up');

  } catch (error) {
    console.error('❌ Error during employee creation test:', error);
    console.error('Error stack:', error.stack);
  } finally {
    process.exit(0);
  }
}

testEmployeeCreation();