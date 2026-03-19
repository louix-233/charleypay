const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function testVoidFunctionality() {
  try {
    // Open database connection
    const db = await open({
      filename: './payroll.db',
      driver: sqlite3.Database
    });

    console.log('🔍 Testing Void Functionality - Debug Script');
    console.log('==========================================');

    // 1. Check payroll runs
    console.log('\n1. Checking payroll runs:');
    const runs = await db.all('SELECT id, month, year, status FROM payroll_runs ORDER BY created_at DESC');
    console.log('Payroll runs:', runs);

    if (runs.length === 0) {
      console.log('❌ No payroll runs found!');
      return;
    }

    // Find a processed run to test void on
    const processedRun = runs.find(r => r.status === 'Processed');
    const voidRun = runs.find(r => r.status === 'Void');
    const testRun = processedRun || voidRun || runs[0];
    
    console.log(`\n📋 Testing with run: ${testRun.id} (${testRun.month} ${testRun.year}) - Status: ${testRun.status}`);

    // 2. Check payroll entries
    console.log('\n2. Checking payroll entries:');
    const entries = await db.all('SELECT id, employee_id, employee_name FROM payroll_entries WHERE run_id = ?', [testRun.id]);
    console.log(`Found ${entries.length} payroll entries:`, entries);

    // 3. Check payslips
    console.log('\n3. Checking payslips:');
    const payslips = await db.all('SELECT id, employee_id, run_id, pay_period_month, pay_period_year FROM payslips WHERE run_id = ?', [testRun.id]);
    console.log(`Found ${payslips.length} payslips with run_id:`, payslips);

    // Also check payslips by month/year
    const payslipsByPeriod = await db.all('SELECT id, employee_id, run_id FROM payslips WHERE pay_period_month = ? AND pay_period_year = ?', [testRun.month, testRun.year]);
    console.log(`Found ${payslipsByPeriod.length} payslips by period:`, payslipsByPeriod);

    // 4. Check payroll history
    console.log('\n4. Checking payroll history:');
    const history = await db.all('SELECT id, month, year, status FROM payroll_history WHERE month = ? AND year = ?', [testRun.month, testRun.year]);
    console.log(`Found ${history.length} payroll history records:`, history);

    // 5. Check contribution tables
    console.log('\n5. Checking contribution data:');
    const contribHistory = await db.all('SELECT id, run_id, pay_period_month, pay_period_year FROM ContributionHistory WHERE run_id = ? OR (pay_period_month = ? AND pay_period_year = ?)', [testRun.id, testRun.month, testRun.year]);
    console.log(`Found ${contribHistory.length} contribution history records:`, contribHistory);

    const contribReports = await db.all('SELECT id, run_id, pay_period_month, pay_period_year FROM contribution_reports WHERE run_id = ? OR (pay_period_month = ? AND pay_period_year = ?)', [testRun.id, testRun.month, testRun.year]);
    console.log(`Found ${contribReports.length} contribution reports:`, contribReports);

    // 6. If this is a void run, test deletion manually
    if (testRun.status === 'Void' && (payslips.length > 0 || history.length > 0)) {
      console.log('\n🧪 MANUAL DELETION TEST (since data still exists after void):');
      
      // Test payslip deletion
      console.log('\n6a. Testing payslip deletion:');
      const deletePayslipsResult = await db.run('DELETE FROM payslips WHERE run_id = ?', [testRun.id]);
      console.log('Delete payslips result:', deletePayslipsResult);
      
      // Test history deletion
      console.log('\n6b. Testing history deletion:');
      const deleteHistoryResult = await db.run('DELETE FROM payroll_history WHERE month = ? AND year = ?', [testRun.month, testRun.year]);
      console.log('Delete history result:', deleteHistoryResult);
      
      // Verify deletions
      const remainingPayslips = await db.all('SELECT COUNT(*) as count FROM payslips WHERE run_id = ?', [testRun.id]);
      const remainingHistory = await db.all('SELECT COUNT(*) as count FROM payroll_history WHERE month = ? AND year = ?', [testRun.month, testRun.year]);
      
      console.log(`\n✅ After manual deletion:`);
      console.log(`Remaining payslips: ${remainingPayslips[0].count}`);
      console.log(`Remaining history: ${remainingHistory[0].count}`);
    }

    await db.close();
    console.log('\n✅ Database connection closed');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the test
testVoidFunctionality();