import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@loopdev/contracts': path.resolve(root, '../../packages/contracts/src/index.ts'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
