import fs from 'fs';
import path from 'path';

async function test() {
  const routesDir = './src/api/routes';
  const files = fs.readdirSync(routesDir).filter(f => f.endsWith('.ts'));
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    console.log(`[${i+1}/${files.length}] Starting import of ${file}...`);
    try {
      await import(`./src/api/routes/${file}`);
      console.log(`[${i+1}/${files.length}] ✅ ${file} loaded successfully`);
    } catch (e: any) {
      console.log(`[${i+1}/${files.length}] ❌ ${file} failed: ${e.message}`);
    }
  }
  console.log('Done mapping all routes!');
  process.exit(0);
}

test().catch(e => {
  console.error(e);
  process.exit(1);
});
