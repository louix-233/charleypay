// Count columns in the INSERT statement
const insertQuery = `INSERT INTO employees (
  id, name, first_name, other_names, last_name, designation, email, phone, basic_salary, status, department,
  hire_date, address, emergency_contact, date_of_birth, gender, marital_status,
  national_ids, ssnit_number, tax_identification_number, job_title, employment_type, work_location,
  is_ssnit_contributor, is_tier3_contributor, tier3_contribution_percentage, portal_access,
  residency_status, nationality, bank_account_number, bank_branch, profile_picture
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

const columnMatch = insertQuery.match(/INSERT INTO employees \(([\s\S]*?)\)/);
const columns = columnMatch ? columnMatch[1].split(',').map(c => c.trim()).filter(c => c) : [];

const placeholders = insertQuery.match(/\?/g) || [];

console.log('Columns in INSERT statement:', columns.length);
console.log('Columns:', columns);
console.log('Placeholders in VALUES:', placeholders.length);
console.log('Match:', columns.length === placeholders.length);
console.log('');

if (columns.length !== placeholders.length) {
  console.log('❌ MISMATCH: Columns and placeholders do not match!');
}