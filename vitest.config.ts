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
            '@loopdev/ui': path.resolve(root, 'ds/packages/ui/src/index.ts'),
            '@testing-library/react': path.resolve(root, 'node_modules/@testing-library/react'),
            '@radix-ui/react-dialog': path.resolve(root, 'node_modules/@radix-ui/react-dialog'),
            '@radix-ui/react-dropdown-menu': path.resolve(
              root,
              'node_modules/@radix-ui/react-dropdown-menu',
            ),
            '@radix-ui/react-popover': path.resolve(root, 'node_modules/@radix-ui/react-popover'),
            '@radix-ui/react-tooltip': path.resolve(root, 'node_modules/@radix-ui/react-tooltip'),
            'react-remove-scroll/dist/es5': path.resolve(
              root,
              'node_modules/react-remove-scroll/dist/es5/index.js',
            ),
            react: path.resolve(root, 'node_modules/react'),
            'react-dom': path.resolve(root, 'node_modules/react-dom'),
          },
          dedupe: ['react', 'react-dom'],
        },
        ssr: {
          noExternal: [/^@radix-ui\//, 'react-remove-scroll'],
        },
        test: {
          name: 'document-viewer',
          root: path.resolve(root, 'packages/document-viewer'),
          environment: 'jsdom',
          setupFiles: [path.resolve(root, 'ds/packages/ui/vitest.setup.ts')],
          server: {
            deps: {
              inline: [/^@radix-ui\//, 'react-remove-scroll'],
              fallbackCJS: true,
            },
          },
          include: ['src/**/*.{test,spec}.{ts,tsx}'],
        },
      },
      {
        resolve: {
          alias: {
            '@': path.resolve(root, 'apps/loopdev-os/src'),
            '@loopdev/contracts': path.resolve(root, 'packages/contracts/src/index.ts'),
            '@loopdev/tokens': path.resolve(root, 'ds/packages/tokens/src/index.ts'),
            '@loopdev/ui': path.resolve(root, 'ds/packages/ui/src/index.ts'),
            '@testing-library/react': path.resolve(root, 'node_modules/@testing-library/react'),
            '@radix-ui/react-dialog': path.resolve(root, 'node_modules/@radix-ui/react-dialog'),
            '@radix-ui/react-dropdown-menu': path.resolve(
              root,
              'node_modules/@radix-ui/react-dropdown-menu',
            ),
            '@radix-ui/react-popover': path.resolve(root, 'node_modules/@radix-ui/react-popover'),
            '@radix-ui/react-tooltip': path.resolve(root, 'node_modules/@radix-ui/react-tooltip'),
            'react-remove-scroll/dist/es5': path.resolve(
              root,
              'node_modules/react-remove-scroll/dist/es5/index.js',
            ),
            react: path.resolve(root, 'node_modules/react'),
            'react-dom': path.resolve(root, 'node_modules/react-dom'),
            'react-dom/client': path.resolve(root, 'node_modules/react-dom/client.js'),
            'react-hook-form': path.resolve(root, 'node_modules/react-hook-form'),
            'next/link': path.resolve(root, 'ds/packages/ui/src/test-mocks/next.tsx'),
          },
          dedupe: ['react', 'react-dom'],
        },
        test: {
          name: 'loopdev-os',
          environment: 'jsdom',
          setupFiles: [path.resolve(root, 'ds/packages/ui/vitest.setup.ts')],
          server: {
            deps: {
              inline: [/^@radix-ui\//, 'react-remove-scroll'],
              fallbackCJS: true,
            },
          },
          root: path.resolve(root, 'apps/loopdev-os'),
          include: ['src/{app,components,core,lib,services,suites}/**/*.{test,spec}.{ts,tsx}'],
        },
      },
    ],
  },
});
