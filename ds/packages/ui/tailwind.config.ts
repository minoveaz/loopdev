import type { Config } from 'tailwindcss';
import sharedConfig from '@loopdev/tailwind-config';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  presets: [sharedConfig],
};

export default config;