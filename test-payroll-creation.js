// Test script to verify payroll creation works with voided runs
console.log('🧪 TESTING PAYROLL CREATION WITH VOIDED RUNS');
console.log('=============================================');

const testPayrollCreation = async () => {
  try {
    const baseURL = 'http://localhost:5173/api/sql';
    
    // Step 1: Check current payroll runs
    console.log('\n📊 STEP 1: Checking current payroll runs...');
    const runsResponse = await fetch(`${baseURL}/payroll-runs`);
    const runsData = await runsResponse.json();
    
    if (!runsData.success) {
      throw new Error('Failed to fetch payroll runs');
    }
    
    console.log(`Found ${runsData.data.length} payroll runs:`);
    runsData.data.forEach(run => {
      console.log(`  - ${run.id}: ${run.month} ${run.year} (${run.status}) Run #${run.runNumber}`);
    });
    
    // Step 2: Test payroll creation for October 2025
    const testMonth = 'October';
    const testYear = 2025;
    
    console.log(`\n🛠️ STEP 2: Testing payroll creation for ${testMonth} ${testYear}...`);
    
    // First check the existing endpoint
    const existingResponse = await fetch(`${baseURL}/payroll-runs/existing?month=${encodeURIComponent(testMonth)}&year=${testYear}`);
    const existingData = await existingResponse.json();
    
    console.log('Existing check result:', existingData);
    
    // Now try to create a new payroll run
    console.log('\n🚀 STEP 3: Attempting to create new payroll run...');
    
    const createResponse = await fetch(`${baseURL}/payroll-runs/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        month: testMonth,
        year: testYear,
        runType: 'Regular',
        confirm: true
      })
    });
    
    const createResult = await createResponse.json();
    
    console.log('\n📋 Creation result:');
    console.log(`  - Status: ${createResponse.status}`);
    console.log(`  - Success: ${createResult.success}`);
    
    if (createResult.success) {
      console.log('🎉 SUCCESS! Payroll run created successfully:');
      console.log(`  - Run ID: ${createResult.data.id}`);
      console.log(`  - Month/Year: ${createResult.data.month} ${createResult.data.year}`);
      console.log(`  - Run Number: ${createResult.data.run_number}`);
      console.log(`  - Status: ${createResult.data.status}`);
      
      // Clean up - delete the test run
      console.log('\n🧹 Cleaning up test run...');
      // Note: We would need a delete endpoint to clean up, but for now just log the success
      console.log('✅ Test completed successfully - payroll creation is working!');
    } else {
      console.log('❌ FAILED! Payroll creation blocked:');
      console.log(`  - Error: ${createResult.error}`);
      console.log(`  - Message: ${createResult.message}`);
      console.log(`  - Reason: ${createResult.data?.reason}`);
      
      if (createResult.data?.runs) {
        console.log('  - Blocking runs:');
        createResult.data.runs.forEach(run => {
          console.log(`    - Run #${run.run_number}: ${run.run_type || 'Regular'} (${run.status})`);
        });
      }
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error);
  }
};

// Run the test
testPayrollCreation().then(() => {
  console.log('\n✅ Test completed!');
}).catch(error => {
  console.error('💥 Test script failed:', error);
});