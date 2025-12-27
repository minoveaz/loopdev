import type { Config } from 'tailwindcss';
import sharedConfig from '@myco/tailwind-config';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  presets: [sharedConfig],
};

export default config;
