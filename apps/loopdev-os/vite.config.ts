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
      // Alias directo a la carpeta de blueprints dentro del módulo
      '@blueprints': path.resolve(__dirname, '../../modules/mod-architect/src/blueprints'),
    },
  },
  server: {
    host: true,
    fs: {
      // Permitir que Vite sirva archivos de todo el monorepo
      allow: ['..']
    },
    hmr: {
      overlay: true
    }
  }
})
