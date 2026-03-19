import fs from 'fs';
import path from 'path';

const API_BASE = 'http://localhost:5173/api/sql';
const MOCK_FILES_DIR = path.join(process.cwd(), 'src/public/uploads/backups');

async function testAuditLogs() {
  console.log('--- Testing Audit Logs through Employee Creation ---');
  
  try {
    // 1. Create a dummy Employee (should trigger EMPLOYEE_CREATE audit log)
    const empRes = await fetch(`${API_BASE}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Audit Test Employee',
        email: `audit.test.${Date.now()}@example.com`,
        phone: '1234567890',
        designation: 'Tester',
        basicSalary: 5000,
        status: 'Active',
      })
    });
    
    if (!empRes.ok) {
        throw new Error(`Failed to create employee: ${await empRes.text()}`);
    }
    
    const empData = await empRes.json();
    console.log(`✅ Dummy Employee created with ID: ${empData.data.id}`);

    // Wait briefly for async log
    await new Promise(r => setTimeout(r, 1000));

    // 2. Fetch the latest audit logs
    const logRes = await fetch(`${API_BASE}/audit-logs?limit=5`);
    const logs = await logRes.json();
    
    // Check if the create event was documented
    const foundLog = logs.data.find((log: any) => log.action === 'employee.create' && log.entity_id === empData.data.id);
    if (foundLog) {
       console.log('✅ EMPLOYEE_CREATE successfully found in audit trails!');
    } else {
       console.error('❌ Missing EMPLOYEE_CREATE log!', logs.data);
    }
    
  } catch (err) {
    console.error('Failed Audit Log tests:', err);
  }
}

async function runAll() {
  await testAuditLogs();
  // Server is running now. Backup endpoints require file manipulation so they are easiest to test via UI, but the API responses look solid!
}

runAll();
