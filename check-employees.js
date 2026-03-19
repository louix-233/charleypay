import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('./payroll.db');

console.log('Checking employee data...');

// First, get total count
db.get(`SELECT COUNT(*) as count FROM employees`, [], (err, row) => {
  if (err) {
    console.error('Error getting count:', err);
  } else {
    console.log(`\nTotal employees in database: ${row.count}`);
  }

  // Then get recent employees
  db.all(`SELECT id, name, first_name, last_name, designation, email, status, created_at FROM employees ORDER BY created_at DESC LIMIT 20`, [], (err, rows) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log('\nRecent employees in database:');
      if (rows.length === 0) {
        console.log('No employees found.');
      } else {
        rows.forEach((row, i) => {
          const fullName = row.name || `${row.first_name || ''} ${row.last_name || ''}`.trim();
          console.log(`${i + 1}. ${row.id}: ${fullName} (${row.status}) - ${row.created_at}`);
        });
      }
    }
    db.close();
  });
});