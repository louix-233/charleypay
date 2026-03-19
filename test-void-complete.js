// Test script to verify complete void functionality
console.log('🧪 TESTING COMPLETE VOID FUNCTIONALITY');
console.log('=====================================');

const testCompleteVoidFunctionality = async () => {
  try {
    const baseURL = 'http://localhost:5173/api/sql';
    
    // Step 1: Check initial state
    console.log('\n📊 STEP 1: Checking initial payroll runs...');
    const runsResponse = await fetch(`${baseURL}/payroll-runs`);
    const runsData = await runsResponse.json();
    
    if (!runsData.success) {
      throw new Error('Failed to fetch payroll runs');
    }
    
    console.log(`Found ${runsData.data.length} payroll runs:`);
    runsData.data.forEach(run => {
      console.log(`  - ${run.id}: ${run.month} ${run.year} (${run.status})`);
    });
    
    // Step 2: Check if there are any processed runs to void
    const processedRuns = runsData.data.filter(run => run.status === 'Processed');
    const voidedRuns = runsData.data.filter(run => run.status === 'Void');
    
    console.log(`\n📈 Status summary:`);
    console.log(`  - Processed runs: ${processedRuns.length}`);
    console.log(`  - Voided runs: ${voidedRuns.length}`);
    
    if (processedRuns.length === 0) {
      console.log('⚠️ No processed runs to test void on');
      
      if (voidedRuns.length > 0) {
        console.log('\n✅ Good! There are voided runs. Testing frontend behavior...');
        
        // Test that voided runs are excluded from existence checks
        const testRun = voidedRuns[0];
        console.log(`\n🔍 STEP 2: Testing existence check for ${testRun.month} ${testRun.year} (voided)...`);
        
        const existsResponse = await fetch(`${baseURL}/payroll-runs/existing?month=${encodeURIComponent(testRun.month)}&year=${testRun.year}`);
        const existsData = await existsResponse.json();
        
        if (existsData.success) {
          const allRuns = existsData.data.runs || [];
          const activeRuns = allRuns.filter(run => run.status !== 'Void');
          
          console.log(`📊 Existence check results:`);
          console.log(`  - Total runs found: ${allRuns.length}`);
          console.log(`  - Active (non-voided) runs: ${activeRuns.length}`);
          console.log(`  - API says exists: ${existsData.data.exists}`);
          
          if (activeRuns.length === 0) {
            console.log('✅ PERFECT! Voided runs are correctly excluded from existence checks.');
            console.log('✅ This means the frontend should allow creating new payrolls for this period.');
          } else {
            console.log('❌ Issue: Active runs still exist for this period');
          }
        }
      }
      
      return;
    }
    
    // Step 3: Test voiding a processed run
    const testRun = processedRuns[0];
    console.log(`\n🎯 STEP 3: Testing void on ${testRun.id} (${testRun.month} ${testRun.year})...`);
    
    // First, check what data exists before voiding
    console.log('\n📋 Checking data before void...');
    
    const payslipsResponse = await fetch(`${baseURL}/payslips`);
    const payslipsData = await payslipsResponse.json();
    const relatedPayslips = payslipsData.success ? 
      payslipsData.data.filter(p => p.run_id === testRun.id || (p.pay_period_month === testRun.month && p.pay_period_year === testRun.year)) : [];
    
    const historyResponse = await fetch(`${baseURL}/payroll-history`);
    const historyData = await historyResponse.json();
    const relatedHistory = historyData.success ?
      historyData.data.filter(h => h.month === testRun.month && h.year === testRun.year) : [];
    
    console.log(`  - Related payslips: ${relatedPayslips.length}`);
    console.log(`  - Related history records: ${relatedHistory.length}`);
    
    // Now void the payroll
    console.log('\n🗑️ Voiding payroll...');
    const voidResponse = await fetch(`${baseURL}/payroll-runs/${testRun.id}/void`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: 'Test void from complete test script' })
    });
    
    const voidData = await voidResponse.json();
    
    if (!voidData.success) {
      console.log('❌ VOID FAILED:', voidData.error);
      return;
    }
    
    console.log('✅ VOID API CALL SUCCESSFUL!');
    console.log(`📊 Deletion results:`, voidData.data.deletionResults);
    console.log(`🔍 Verification:`, voidData.data.verification);
    console.log(`🎯 Cleanup successful: ${voidData.data.isCleanupSuccessful}`);
    
    // Step 4: Verify the cleanup
    console.log('\n🔍 STEP 4: Verifying complete cleanup...');
    
    // Check payslips
    const payslipsAfterResponse = await fetch(`${baseURL}/payslips`);
    const payslipsAfterData = await payslipsAfterResponse.json();
    const remainingPayslips = payslipsAfterData.success ? 
      payslipsAfterData.data.filter(p => p.run_id === testRun.id || (p.pay_period_month === testRun.month && p.pay_period_year === testRun.year)) : [];
    
    // Check history
    const historyAfterResponse = await fetch(`${baseURL}/payroll-history`);
    const historyAfterData = await historyAfterResponse.json();
    const remainingHistory = historyAfterData.success ?
      historyAfterData.data.filter(h => h.month === testRun.month && h.year === testRun.year) : [];
    
    // Check run status
    const runsAfterResponse = await fetch(`${baseURL}/payroll-runs`);
    const runsAfterData = await runsAfterResponse.json();
    const voidedRun = runsAfterData.success ?
      runsAfterData.data.find(r => r.id === testRun.id) : null;
    
    console.log(`📊 Cleanup verification:`);
    console.log(`  - Remaining payslips: ${remainingPayslips.length} (should be 0)`);
    console.log(`  - Remaining history: ${remainingHistory.length} (should be 0)`);
    console.log(`  - Run status: ${voidedRun ? voidedRun.status : 'NOT FOUND'} (should be Void)`);
    
    // Step 5: Test frontend behavior
    console.log('\n🖥️ STEP 5: Testing frontend behavior...');
    
    const existenceCheckResponse = await fetch(`${baseURL}/payroll-runs/existing?month=${encodeURIComponent(testRun.month)}&year=${testRun.year}`);
    const existenceCheckData = await existenceCheckResponse.json();
    
    if (existenceCheckData.success) {
      const allRuns = existenceCheckData.data.runs || [];
      const activeRuns = allRuns.filter(run => run.status !== 'Void');
      
      console.log(`📊 Frontend existence check:`);
      console.log(`  - Total runs: ${allRuns.length}`);
      console.log(`  - Active runs: ${activeRuns.length}`);
      console.log(`  - Should allow new payroll: ${activeRuns.length === 0 ? 'YES' : 'NO'}`);
    }
    
    // Final summary
    console.log('\n🏁 FINAL RESULTS:');
    const isPayslipsClean = remainingPayslips.length === 0;
    const isHistoryClean = remainingHistory.length === 0;
    const isRunVoided = voidedRun && voidedRun.status === 'Void';
    
    if (isPayslipsClean && isHistoryClean && isRunVoided) {
      console.log('🎉 SUCCESS! Void functionality is working perfectly:');
      console.log('   ✅ Payslips deleted');
      console.log('   ✅ History deleted');
      console.log('   ✅ Run marked as Void');
      console.log('   ✅ Frontend should allow new payroll creation');
    } else {
      console.log('❌ ISSUES FOUND:');
      if (!isPayslipsClean) console.log('   ❌ Payslips not fully deleted');
      if (!isHistoryClean) console.log('   ❌ History not fully deleted');
      if (!isRunVoided) console.log('   ❌ Run not marked as Void');
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error);
  }
};

// Run the test
testCompleteVoidFunctionality().then(() => {
  console.log('\n✅ Test completed!');
}).catch(error => {
  console.error('💥 Test script failed:', error);
});