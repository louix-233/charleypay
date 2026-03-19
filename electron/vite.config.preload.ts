import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist-electron',
    lib: {
      entry: resolve(__dirname, 'preload.ts'),
      formats: ['cjs'],
      fileName: 'preload',
    },
    rollupOptions: {
      external: ['electron'],
    },
    minify: false,
    emptyOutDir: false,
  },
});

