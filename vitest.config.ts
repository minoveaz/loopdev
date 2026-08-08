import path from 'node:path';
import { defineConfig } from 'vitest/config';

const root = process.cwd();

export default defineConfig({
  test: {
    projects: [
      'ds/packages/ui/vitest.config.ts',
      {
        test: {
          name: 'contracts',
          root: path.resolve(root, 'packages/contracts'),
          include: ['src/**/*.{test,spec}.ts'],
        },
      },
      {
        resolve: {
          alias: { '@': path.resolve(root, 'apps/loopdev-os/src') },
        },
        test: {
          name: 'loopdev-os',
          environment: 'jsdom',
          setupFiles: [path.resolve(root, 'ds/packages/ui/vitest.setup.ts')],
          root: path.resolve(root, 'apps/loopdev-os'),
          include: ['src/{app,components,core,lib,services}/**/*.{test,spec}.{ts,tsx}'],
        },
      },
    ],
  },
});
