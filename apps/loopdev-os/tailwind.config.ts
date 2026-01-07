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
        shell: {
          canvas: 'var(--lpd-shell-canvas)',
          surface: 'var(--lpd-shell-surface)',
        },
        surface: {
          light: '#ffffff',
          dark: 'var(--lpd-color-brand-surface, #181b21)', 
          elevated: 'var(--lpd-color-bg-surface-elevated, #181b21)',
          glass: 'rgba(255, 255, 255, 0.03)',
        },
        background: {
          dark: '#05070a',
          laboratory: 'var(--lpd-color-bg-laboratory, #0d121b)',
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
        'innovation-purple': {
          DEFAULT: 'var(--lpd-color-innovation-purple, #9333EA)',
        },
        'innovation-soft-purple': {
          DEFAULT: 'var(--lpd-color-innovation-soft, rgba(147, 51, 234, 0.1))',
        },
        'border-subtle': 'var(--lpd-color-border-subtle, rgba(255, 255, 255, 0.08))',
        'border-technical': 'var(--lpd-color-border-technical, rgba(255, 255, 255, 0.05))',
      },
      fontSize: {
        technical: 'var(--lpd-font-size-technical, 10px)',
        micro: 'var(--lpd-font-size-micro, 9px)',
      },
      // fontSize: Heredado del preset @loopdev/tailwind-config (Single Source of Truth)
    }
  }
};

export default config;
