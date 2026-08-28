import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_PATH || (process.env.GITHUB_ACTIONS ? '/CIMO/' : './'),
  server: {
    port: 3000,
  },
});
