import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist-electron',
    lib: {
      entry: resolve(__dirname, 'main.ts'),
      formats: ['cjs'],
      fileName: 'main',
    },
    rollupOptions: {
      external: ['electron'],
    },
    minify: false,
    emptyOutDir: true,
  },
});

