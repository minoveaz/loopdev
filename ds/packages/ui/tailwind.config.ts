import type { Config } from 'tailwindcss';
import sharedConfig from '@loopdev/tailwind-config';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  presets: [sharedConfig],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--lpd-color-brand-primary, #135bec)',
          dark: '#0b46be',
          light: '#4f85f0',
        },
        accent: {
          DEFAULT: 'var(--lpd-color-brand-energy, #FFD025)', 
          hover: '#eac026',
        },
        energy: {
          DEFAULT: '#fbbf24', 
          vivid: 'var(--lpd-color-brand-energy, #FFD025)',   
        },
        background: {
          light: 'var(--lpd-color-bg-base, #f8f9fc)',
          dark: '#0f1115', 
          subtle: '#f8fafc',
          'subtle-dark': '#181b21',
        },
        surface: {
          light: '#ffffff',
          dark: 'var(--lpd-color-brand-surface, #181b21)', 
          glass: 'rgba(255, 255, 255, 0.03)',
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
        'status-success': {
          DEFAULT: 'var(--lpd-color-status-success, #10B981)',
        },
        'innovation-purple': {
          DEFAULT: '#9333EA',
        },
        'innovation-soft-purple': {
          DEFAULT: 'rgba(147, 51, 234, 0.1)',
        },
        // Movido aquí para que bg-border-subtle funcione
        'border-subtle': 'var(--lpd-color-border-subtle, #e2e8f0)',
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, rgba(19, 91, 236, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(19, 91, 236, 0.05) 1px, transparent 1px)",
        'blend-mesh': 'radial-gradient(at 0% 0%, rgba(19, 91, 236, 0.3) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(255, 208, 37, 0.2) 0px, transparent 50%)',
      }
    }
  }
};

export default config;
