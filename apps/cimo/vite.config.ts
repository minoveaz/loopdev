import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
  base: process.env.BASE_PATH || (process.env.GITHUB_ACTIONS ? '/CIMO/' : './'),
  server: {
    port: 3000,
  },
});
