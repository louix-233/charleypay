const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./payroll.db');

console.log('🔍 Checking payroll runs for October 2025...\n');

db.all(
  "SELECT id, month, year, run_number, run_type, status, created_at FROM payroll_runs WHERE month = 'October' AND year = 2025 ORDER BY run_number",
  [],
  (err, rows) => {
    if (err) {
      console.error('❌ Error:', err);
      db.close();
      return;
    }
    
    console.log(`Found ${rows.length} payroll run(s):\n`);
    rows.forEach(row => {
      console.log(`  ID: ${row.id}`);
      console.log(`  Month/Year: ${row.month} ${row.year}`);
      console.log(`  Run #: ${row.run_number}`);
      console.log(`  Type: ${row.run_type}`);
      console.log(`  Status: ${row.status}`);
      console.log(`  Created: ${row.created_at}`);
      console.log('  ---');
    });
    
    const activeRuns = rows.filter(r => r.status !== 'Void');
    const voidedRuns = rows.filter(r => r.status === 'Void');
    
    console.log(`\n📊 Summary:`);
    console.log(`  Total runs: ${rows.length}`);
    console.log(`  Active runs: ${activeRuns.length}`);
    console.log(`  Voided runs: ${voidedRuns.length}`);
    
    if (activeRuns.length > 0) {
      console.log(`\n⚠️  Active runs still exist - this will block new payroll creation!`);
    } else {
      console.log(`\n✅ No active runs - new payroll creation should be allowed`);
    }
    
    db.close();
  }
);
