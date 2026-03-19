import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist-server',
    lib: {
      entry: resolve(__dirname, 'server.ts'),
      formats: ['cjs'],
      fileName: 'server',
    },
    rollupOptions: {
      external: [
        'electron',
        'pg',
        'sqlite3',
        'sqlite',
        'bcryptjs',
        'express',
        'cors',
        'helmet',
        'morgan',
        'express-rate-limit',
        'express-validator',
        'dotenv',
        'aws-sdk',
        'path',
        'fs',
        'url',
        'http',
        'https',
      ],
    },
    target: 'node18',
    minify: false,
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
