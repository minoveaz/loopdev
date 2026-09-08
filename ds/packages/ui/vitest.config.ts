import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

const rootDir = path.resolve(__dirname, '../../../');

export default defineConfig({
  plugins: [react()],
  ssr: {
    noExternal: [/^@radix-ui\//, 'react-remove-scroll'],
  },
  test: {
    root: rootDir,
    environment: 'jsdom',
    globals: true,
    setupFiles: [path.resolve(__dirname, './vitest.setup.ts')],
    server: {
      deps: {
        inline: [/^@radix-ui\//, 'react-remove-scroll'],
        fallbackCJS: true,
      },
    },
    css: true,
    alias: {
      '@': path.resolve(rootDir, 'apps/loopdev-os/src'),
      '@loopdev/ui': path.resolve(rootDir, 'ds/packages/ui/src'),
      '@testing-library/react': path.resolve(rootDir, 'node_modules/@testing-library/react'),
      'react-remove-scroll/dist/es5': path.resolve(
        rootDir,
        'node_modules/react-remove-scroll/dist/es5/index.js',
      ),
      '@radix-ui/react-dialog': path.resolve(rootDir, 'node_modules/@radix-ui/react-dialog'),
      '@radix-ui/react-dropdown-menu': path.resolve(
        rootDir,
        'node_modules/@radix-ui/react-dropdown-menu',
      ),
      '@radix-ui/react-popover': path.resolve(rootDir, 'node_modules/@radix-ui/react-popover'),
      '@radix-ui/react-tooltip': path.resolve(rootDir, 'node_modules/@radix-ui/react-tooltip'),
      react: path.resolve(rootDir, 'node_modules/react'),
      'react-dom': path.resolve(rootDir, 'node_modules/react-dom'),
      'next/link': path.resolve(__dirname, 'src/test-mocks/next.tsx'),
      'next/navigation': path.resolve(__dirname, 'src/test-mocks/next.tsx'),
    },
    include: [
      'ds/packages/ui/src/**/*.{test,spec}.{ts,tsx}',
      'apps/loopdev-os/src/suites/marketing-studio/brand-hub/components/**/*.{test,spec}.{ts,tsx}',
    ],
  },
});
