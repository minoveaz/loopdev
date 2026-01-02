import type { Config } from 'tailwindcss';

const preset: Config = {
  darkMode: 'class',
  content: [], // Se debe sobrescribir en cada app/paquete
  theme: {
    extend: {
      colors: {
        lpd: {
          brand: {
            primary: 'var(--lpd-color-brand-primary)',
            secondary: 'var(--lpd-color-brand-secondary)',
          },
          bg: {
            base: 'var(--lpd-color-bg-base)',
            surface: 'var(--lpd-color-bg-surface)',
            dark: 'var(--lpd-color-bg-surface-dark)',
          },
          text: {
            base: 'var(--lpd-color-text-base)',
            muted: 'var(--lpd-color-text-muted)',
            onPrimary: 'var(--lpd-color-text-on-primary)',
          },
          // Primitivos para uso directo si es necesario
          blue: {
            50: 'var(--lpd-color-blue-50)',
            100: 'var(--lpd-color-blue-100)',
            200: 'var(--lpd-color-blue-200)',
            300: 'var(--lpd-color-blue-300)',
            400: 'var(--lpd-color-blue-400)',
            500: 'var(--lpd-color-blue-500)',
            600: 'var(--lpd-color-blue-600)',
            700: 'var(--lpd-color-blue-700)',
            800: 'var(--lpd-color-blue-800)',
            900: 'var(--lpd-color-blue-900)',
            950: 'var(--lpd-color-blue-950)',
          },
          slate: {
            50: 'var(--lpd-color-slate-50)',
            800: 'var(--lpd-color-slate-800)',
            900: 'var(--lpd-color-slate-900)',
          },
          yellow: {
            400: 'var(--lpd-color-yellow-400)',
          }
        },
      },
      spacing: {
        'lpd-space-1': 'var(--lpd-space-1)',
        'lpd-space-2': 'var(--lpd-space-2)',
        'lpd-space-3': 'var(--lpd-space-3)',
        'lpd-space-4': 'var(--lpd-space-4)',
        'lpd-space-5': 'var(--lpd-space-5)',
        'lpd-space-6': 'var(--lpd-space-6)',
        'lpd-space-8': 'var(--lpd-space-8)',
        'lpd-space-12': 'var(--lpd-space-12)',
        'lpd-space-16': 'var(--lpd-space-16)',
      },
      borderRadius: {
        'lpd-xs': 'var(--lpd-radius-xs)',
        'lpd-sm': 'var(--lpd-radius-sm)',
        'lpd-md': 'var(--lpd-radius-md)',
        'lpd-lg': 'var(--lpd-radius-lg)',
        'lpd-xl': 'var(--lpd-radius-xl)',
        'lpd-full': 'var(--lpd-radius-full)',
      },
      fontFamily: {
        sans: ['var(--lpd-font-sans)', 'sans-serif'],
        mono: ['var(--lpd-font-mono)', 'monospace'],
      },
      fontSize: {
        'lpd-xs': 'var(--lpd-font-size-xs)',
        'lpd-sm': 'var(--lpd-font-size-sm)',
        'lpd-base': 'var(--lpd-font-size-base)',
        'lpd-lg': 'var(--lpd-font-size-lg)',
        'lpd-xl': 'var(--lpd-font-size-xl)',
        'lpd-2xl': 'var(--lpd-font-size-2xl)',
      },
      boxShadow: {
        'lpd-sm': 'var(--lpd-shadow-sm)',
        'lpd-md': 'var(--lpd-shadow-md)',
        'lpd-lg': 'var(--lpd-shadow-lg)',
      },
      zIndex: {
        'lpd-modal': 'var(--lpd-z-modal)',
        'lpd-overlay': 'var(--lpd-z-overlay)',
        'lpd-toast': 'var(--lpd-z-toast)',
      },
      aspectRatio: {
        'lpd-video': 'var(--lpd-ratio-video)',
        'lpd-square': 'var(--lpd-ratio-square)',
        'lpd-mobile': 'var(--lpd-ratio-mobile-video)',
      }
    },
  },
  plugins: [],
};

export default preset;