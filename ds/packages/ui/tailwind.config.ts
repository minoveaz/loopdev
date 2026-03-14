import type { Config } from 'tailwindcss';
import sharedConfig from '@loopdev/tailwind-config';

const config: Config = {
  presets: [sharedConfig],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Forzamos el modo clase para Storybook y SaaS
  theme: {
    extend: {
            colors: {
                      primary: {
                        DEFAULT: 'rgb(var(--lpd-color-brand-primary-rgb, 19 91 236) / <alpha-value>)',
                        subtle: 'var(--lpd-color-bg-primary-subtle)',
                        dark: '#0b46be',
                        light: '#4f85f0',
                      },              accent: {
                DEFAULT: 'rgb(var(--lpd-color-brand-secondary-rgb, 255 208 37) / <alpha-value>)',
                hover: '#eac026',
              },
      
        energy: {
          DEFAULT: '#fbbf24', 
          vivid: 'var(--lpd-color-brand-energy, #FFD025)',   
        },
        background: {
          light: 'var(--lpd-color-bg-base, #f8f9fc)',
          dark: '#0f1115', 
          laboratory: 'var(--lpd-color-bg-laboratory, #0d121b)',
          subtle: '#f8fafc',
          'subtle-dark': '#181b21',
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
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, rgba(19, 91, 236, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(19, 91, 236, 0.05) 1px, transparent 1px)",
        'grid-pattern-dark': "linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
        'blueprint-grid': "linear-gradient(to right, rgba(19, 91, 236, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(19, 91, 236, 0.1) 1px, transparent 1px)",
        'blend-mesh': 'radial-gradient(at 0% 0%, rgba(19, 91, 236, 0.3) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(255, 208, 37, 0.2) 0px, transparent 50%)',
      }
    }
  }
};

export default config;