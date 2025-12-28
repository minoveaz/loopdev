/** @type {import('tailwindcss').Config} */
const preset = {
  darkMode: 'class',
  content: [], 
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
          blue: { 600: 'var(--lpd-color-blue-600)' },
          yellow: { 400: 'var(--lpd-color-yellow-400)' },
          slate: { 100: 'var(--lpd-color-slate-100)', 800: 'var(--lpd-color-slate-800)' }
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
        'lpd-space-10': 'var(--lpd-space-10)',
        'lpd-space-12': 'var(--lpd-space-12)',
      },
      borderRadius: {
        'lpd-sm': 'var(--lpd-radius-sm)',
        'lpd-md': 'var(--lpd-radius-md)',
        'lpd-lg': 'var(--lpd-radius-lg)',
      },
      fontFamily: {
        sans: ['var(--lpd-font-sans)', 'sans-serif'],
        mono: ['var(--lpd-font-mono)', 'monospace'],
      },
      fontSize: {
        'lpd-xs': 'var(--lpd-font-size-xs)',
        'lpd-sm': 'var(--lpd-font-size-sm)',
        'lpd-base': 'var(--lpd-font-size-base)',
        'lpd-2xl': 'var(--lpd-font-size-2xl)',
      },
      boxShadow: {
        'lpd-sm': 'var(--lpd-shadow-sm)',
        'lpd-md': 'var(--lpd-shadow-md)',
      }
    },
  },
  plugins: [],
};

module.exports = preset;