
import { dbUtils } from './src/api/config/database';

async function test() {
  process.env.DATABASE_TYPE = 'postgresql';
  // Mock some env vars if needed
  
  const sql = 'INSERT INTO employees (id, name, is_ssnit_contributor) VALUES (?, ?, ?)';
  const params = ['TEST_EMP_001', 'Test Name', true];
  
  console.log('Testing dbUtils.insert with boolean true...');
  try {
    const result = await dbUtils.insert(sql, params);
    console.log('Success!', result);
  } catch (err: any) {
    console.error('Failed!', err.message);
    if (err.detail) console.error('Detail:', err.detail);
    if (err.where) console.error('Where:', err.where);
  }
}

test();
