// Simple test to verify the void API works properly
console.log('🚀 Starting void API test...');

// Test the void endpoint
const testVoidAPI = async () => {
  try {
    console.log('📞 Testing void API endpoint...');
    
    // First get the payroll runs
    const runsResponse = await fetch('http://localhost:5173/api/sql/payroll-runs');
    const runsData = await runsResponse.json();
    
    if (!runsData.success) {
      throw new Error('Failed to fetch payroll runs');
    }
    
    console.log('📋 Payroll runs:', runsData.data);
    
    // Find a processed run to void
    const processedRun = runsData.data.find(run => run.status === 'Processed');
    
    if (!processedRun) {
      console.log('⚠️ No processed payroll runs found to test void');
      return;
    }
    
    console.log(`🎯 Testing void on: ${processedRun.id} (${processedRun.month} ${processedRun.year})`);
    
    // Call void API
    const voidResponse = await fetch(`http://localhost:5173/api/sql/payroll-runs/${processedRun.id}/void`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        reason: 'Test void from API test script'
      })
    });
    
    const voidData = await voidResponse.json();
    
    console.log('🎉 Void API response:', voidData);
    
    if (voidData.success) {
      console.log('✅ VOID SUCCESSFUL!');
      console.log(`📊 Deletion results: ${JSON.stringify(voidData.data.deletionResults, null, 2)}`);
      console.log(`🔍 Verification: ${JSON.stringify(voidData.data.verification, null, 2)}`);
      console.log(`🎯 Cleanup successful: ${voidData.data.isCleanupSuccessful}`);
    } else {
      console.log('❌ VOID FAILED:', voidData.error);
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error);
  }
};

// Wait a bit and then test
setTimeout(testVoidAPI, 1000);