import { defineWorkspace } from 'vitest/config'
import path from 'path'

export default defineWorkspace([
  'ds/packages/ui/vitest.config.ts',
  {
    test: {
      name: 'apps',
      root: path.resolve(__dirname, './apps/loopdev-os'),
      environment: 'jsdom',
      globals: true,
      setupFiles: [path.resolve(__dirname, './ds/packages/ui/vitest.setup.ts')],
      include: ['src/suites/marketing-studio/brand-hub/components/**/*.{test,spec}.{ts,tsx}'],
      alias: {
        '@': path.resolve(__dirname, './apps/loopdev-os/src'),
        '@loopdev/ui': path.resolve(__dirname, './ds/packages/ui/src')
      }
    }
  }
])