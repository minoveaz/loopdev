import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

const rootDir = path.resolve(__dirname, '../../../');

export default defineConfig({
  plugins: [react()],
  test: {
    root: rootDir,
    environment: 'jsdom',
    globals: true,
    setupFiles: [path.resolve(__dirname, './vitest.setup.ts')],
    css: true,
    alias: {
      '@': path.resolve(rootDir, 'apps/loopdev-os/src'),
      '@loopdev/ui': path.resolve(rootDir, 'ds/packages/ui/src'),
      '@testing-library/react': path.resolve(__dirname, 'node_modules/@testing-library/react'),
      'next/link': path.resolve(__dirname, 'src/test-mocks/next.tsx'),
      'next/navigation': path.resolve(__dirname, 'src/test-mocks/next.tsx'),
    },
    include: [
      'apps/loopdev-os/src/suites/marketing-studio/brand-hub/components/**/*.{test,spec}.{ts,tsx}'
    ],
  },
});
