import axios from 'axios';

const API_BASE = 'http://localhost:5173/api';

async function runTests() {
  console.log('🚀 Starting Multi-Tenant Isolation Tests...');

  try {
    // 1. Initialize Master DB
    console.log('Step 1: Initializing Master DB...');
    await axios.post(`${API_BASE}/tenants/initialize`);

    // 2. Signup Org A
    console.log('Step 2: Signing up Org A...');
    const orgASignup = await axios.post(`${API_BASE}/tenants/signup`, {
      companyName: 'Org A Corp',
      subdomain: `orga-${Date.now()}`,
      contactEmail: `admin@orga-${Date.now()}.com`,
      adminFirstName: 'Admin',
      adminLastName: 'A',
      adminPassword: 'password123'
    });
    const tokenA = orgASignup.data.data.token;
    const tenantIdA = orgASignup.data.data.tenant.id;

    // 3. Signup Org B
    console.log('Step 3: Signing up Org B...');
    const orgBSignup = await axios.post(`${API_BASE}/tenants/signup`, {
      companyName: 'Org B Ltd',
      subdomain: `orgb-${Date.now()}`,
      contactEmail: `admin@orgb-${Date.now()}.com`,
      adminFirstName: 'Admin',
      adminLastName: 'B',
      adminPassword: 'password123'
    });
    const tokenB = orgBSignup.data.data.token;
    const tenantIdB = orgBSignup.data.data.tenant.id;

    // 4. Create Employee in Org A
    console.log('Step 4: Creating employee in Org A...');
    await axios.post(`${API_BASE}/sql/employees`, {
      id: `emp-a-${Date.now()}`,
      name: 'John Doe (Org A)',
      firstName: 'John',
      lastName: 'Doe',
      email: `john@orga-${Date.now()}.com`,
      basicSalary: 5000,
      designation: 'Developer',
      phone: '1234567890'
    }, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });

    // 5. Verify Org B cannot see Org A's employee
    console.log('Step 5: Verifying Org B isolation...');
    const orgBEmployees = await axios.get(`${API_BASE}/sql/employees`, {
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    
    const foundInB = orgBEmployees.data.data.find((e: any) => e.name.includes('Org A'));
    if (foundInB) {
      throw new Error('❌ TEST FAILED: Org B can see Org A\'s data!');
    }
    console.log('✅ Org B isolation confirmed (0 employees found).');

    // 6. Verify Org A can see its own employee
    console.log('Step 6: Verifying Org A data access...');
    const orgAEmployees = await axios.get(`${API_BASE}/sql/employees`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    
    const foundInA = orgAEmployees.data.data.find((e: any) => e.name.includes('Org A'));
    if (!foundInA) {
      throw new Error('❌ TEST FAILED: Org A cannot see its own data!');
    }
    console.log('✅ Org A data access confirmed.');

    console.log('\n✨ ALL MULTI-TENANT ISOLATION TESTS PASSED! ✨');

  } catch (error: any) {
    console.error('❌ Test failed with error:', error.response?.data || error.message);
    process.exit(1);
  }
}

runTests();
