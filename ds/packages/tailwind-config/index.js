/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'var(--brand-primary)',
          secondary: 'var(--brand-secondary)',
          tertiary: 'var(--brand-tertiary)',
          'pastel-1': 'var(--brand-pastel-1)',
          'pastel-2': 'var(--brand-pastel-2)',
          surface: 'var(--brand-surface)',
          outline: 'var(--brand-outline)',
        },
        state: {
          success: 'var(--state-success)',
          error: 'var(--state-error)',
          warning: 'var(--state-warning)',
          info: 'var(--state-info)',
        },
        text: {
          heading: 'var(--text-heading)',
          body: 'var(--text-body)',
          'on-primary': 'var(--text-on-primary)',
        }
      },
      fontFamily: {
        heading: ['var(--font-family-heading)', 'sans-serif'],
        body: ['var(--font-family-body)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
