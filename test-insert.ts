import 'dotenv/config';
import { dbUtils } from './src/api/config/database';

async function getNextRunNumber(month: string, year: number): Promise<number> {
  const runs = await dbUtils.getRows(
    'SELECT MAX(run_number) as "maxRun" FROM payroll_runs WHERE month = ? AND year = ?',
    [month, year]
  );
  
  console.log("Returned runs object from DB:", JSON.stringify(runs));
  
  // Handle PostgreSQL lowercase aliasing (maxrun instead of maxRun)
  const maxVal = runs && runs[0] ? (runs[0].maxRun !== undefined ? runs[0].maxRun : runs[0].maxrun) : null;
  const maxRun = maxVal ? Number(maxVal) : 0;
  
  console.log(`📟 Next run number for ${month} ${year}: ${maxRun + 1} (based on max existing: ${maxRun})`);
  return maxRun + 1;
}

async function testCreateEndpoint() {
  const month = 'March';
  const year = 2026;
  
  try {
    const runNumber = await getNextRunNumber(month, year);

    const id = 'run_test_' + Date.now();
    await dbUtils.insert(
      'INSERT INTO payroll_runs (id, month, year, run_number, run_type, status) VALUES (?, ?, ?, ?, ?, ?)',
      [id, month, year, runNumber, 'Regular', 'Draft']
    );
    
    console.log('✅ Created successfully');
    await dbUtils.delete("DELETE FROM payroll_runs WHERE id = ?", [id]);
    
  } catch (err: any) {
    console.error('❌ Insert failed:');
    console.error('Message:', err.message);
    console.error('Detail:', err.detail);
    console.error('Constraint:', err.constraint);
  }
}

testCreateEndpoint();
