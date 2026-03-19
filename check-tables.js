import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('./payroll.db');

console.log('Checking database tables...');

db.all('SELECT name FROM sqlite_master WHERE type="table"', [], (err, rows) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Tables in database:');
    rows.forEach((row, i) => {
      console.log(`${i + 1}. ${row.name}`);
    });

    // Check employees table specifically
    db.get('SELECT COUNT(*) as count FROM employees', [], (err, row) => {
      if (err) {
        console.error('Error checking employees:', err);
      } else {
        console.log(`\nEmployees table has ${row.count} records`);
      }
      db.close();
    });
  }
});