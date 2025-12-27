import type { Config } from 'tailwindcss';

const config: Config = {
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        background: 'var(--color-background)',
        text: 'var(--color-text)',
      },
      borderRadius: {
        DEFAULT: 'var(--radius-default)',
        lg: 'var(--radius-lg)',
      },
    },
  },
  plugins: [],
};

export default config;
