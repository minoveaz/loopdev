import type { Config } from 'tailwindcss';
import sharedConfig from '../../ds/packages/tailwind-config';

const config: Config = {
  presets: [sharedConfig],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    // Importante incluir el DS para que Tailwind encuentre las clases usadas allí
    '../../ds/packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--lpd-color-brand-primary, #135bec)',
          dark: '#0b46be',
          light: '#4f85f0',
        },
        surface: {
          light: '#ffffff',
          dark: 'var(--lpd-color-brand-surface, #181b21)', 
          glass: 'rgba(255, 255, 255, 0.03)',
        },
        background: {
          dark: '#05070a',
        },
        text: {
          main: 'var(--lpd-color-text-base, #0f172a)',
          muted: 'var(--lpd-color-text-muted, #64748b)',
          light: '#f8fafc',
        },
        danger: {
          DEFAULT: 'var(--lpd-color-status-error, #EF4444)',
          soft: 'rgba(239, 68, 68, 0.1)',
          vivid: '#f43f5e',
        },
        energy: {
          yellow: 'var(--lpd-color-brand-energy, #FFD025)',
        },
        'border-subtle': 'var(--lpd-color-border-subtle, #e2e8f0)',
      },
      // fontSize: Heredado del preset @loopdev/tailwind-config (Single Source of Truth)
    }
  }
};

export default config;
