import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('./payroll.db');
db.all(`SELECT name FROM sqlite_master WHERE type='table'`, [], (err, rows) => {
  if(err) console.error(err);
  else console.log('All tables:', rows.map(r => r.name));
  db.close();
});