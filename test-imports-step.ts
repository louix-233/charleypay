console.log('1. Starting test...');
import sqlite3 from 'sqlite3';
console.log('2. sqlite3 imported');
import { open } from 'sqlite';
console.log('3. sqlite imported');
import path from 'path';
console.log('4. path imported');
import fs from 'fs';
console.log('5. fs imported');
import { Pool } from 'pg';
console.log('6. pg imported');

async function test() {
  console.log('7. About to import dynamodb...');
  const ddb = await import('./src/api/config/dynamodb.ts');
  console.log('8. dynamodb imported');
}

test();
