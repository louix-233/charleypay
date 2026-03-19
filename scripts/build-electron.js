import { build } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function buildElectron() {
  console.log('🔨 Building Electron main process...');
  
  // Build main process
  await build({
    configFile: resolve(__dirname, '../electron/vite.config.electron.ts'),
  });

  console.log('🔨 Building Electron preload script...');
  
  // Build preload script
  await build({
    configFile: resolve(__dirname, '../electron/vite.config.preload.ts'),
  });

  console.log('🔨 Building API server...');
  
  // Build API server
  await build({
    configFile: resolve(__dirname, '../vite.config.server.ts'),
  });

  console.log('✅ Electron build complete!');
}

buildElectron().catch(console.error);

