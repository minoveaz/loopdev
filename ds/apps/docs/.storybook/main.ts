import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import path from 'path';

const config: StorybookConfig = {
  stories: [
    '../../../packages/ui/src/**/*.mdx',
    '../../../packages/ui/src/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-onboarding',
    '@storybook/addon-vitest',
    '@storybook/addon-themes'
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  docs: {
    autodocs: true
  },
  viteFinal: async (config) => {
    return mergeConfig(config, {
      resolve: {
        alias: {
          '@loopdev/ui': path.resolve(__dirname, '../../../packages/ui/src'),
        },
      },
      server: {
        fs: {
          // Permitir servir archivos desde la raíz del monorepo (necesario para packages/ui)
          allow: [
            path.resolve(__dirname, '../../..'),
          ],
        },
      },
    });
  },
};
export default config;
