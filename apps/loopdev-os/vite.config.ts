import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@mock-loopdev': path.resolve(__dirname, '../../../mock-loopdev'),
    },
  },
  server: {
    host: true,
    hmr: {
      overlay: true
    }
  }
})
