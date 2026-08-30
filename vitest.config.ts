import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    projects: [
      path.resolve(root, 'ds/packages/ui/vitest.config.ts'),
      {
        test: {
          name: 'contracts',
          root: path.resolve(root, 'packages/contracts'),
          include: ['src/**/*.{test,spec}.ts'],
        },
      },
      {
        resolve: {
          alias: {
            '@': path.resolve(root, 'apps/loopdev-os/src'),
            '@loopdev/contracts': path.resolve(root, 'packages/contracts/src/index.ts'),
            '@loopdev/tokens': path.resolve(root, 'ds/packages/tokens/src/index.ts'),
            '@loopdev/ui': path.resolve(root, 'ds/packages/ui/src/index.ts'),
          },
        },
        test: {
          name: 'loopdev-os',
          environment: 'jsdom',
          setupFiles: [path.resolve(root, 'ds/packages/ui/vitest.setup.ts')],
          server: {
            deps: {
              inline: true,
            },
          },
          root: path.resolve(root, 'apps/loopdev-os'),
          include: ['src/{app,components,core,lib,services}/**/*.{test,spec}.{ts,tsx}'],
        },
      },
    ],
  },
});
