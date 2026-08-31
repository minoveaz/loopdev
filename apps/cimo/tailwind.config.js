/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../../ds/packages/ui/src/**/*.{js,ts,jsx,tsx}',
    '../../ds/packages/public-shell/src/**/*.{js,ts,jsx,tsx}',
    '../../ds/packages/public-blocks/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'var(--lpd-brand-primary, #00B894)',
          primaryHover: 'var(--lpd-brand-primary-hover, #009678)',
          secondary: 'var(--lpd-brand-secondary, #1F4E5F)',
          accent: 'var(--lpd-brand-accent, #7FB77E)',
          background: 'var(--lpd-brand-background, #F8F9FA)',
          surface: 'var(--lpd-brand-surface, #FFFFFF)',
          textMain: 'var(--lpd-brand-text-main, #161D1A)',
          textSecondary: 'var(--lpd-brand-text-secondary, #6C757D)',
        },
      },
    },
  },
  plugins: [],
};
