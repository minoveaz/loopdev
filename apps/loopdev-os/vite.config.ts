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
      '@architect-data': path.resolve(__dirname, '../../modules/mod-architect/src/data'),
    },
  },
  server: {
    host: true,
    fs: {
      allow: ['..']
    },
    hmr: {
      overlay: true
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        sandbox: path.resolve(__dirname, 'sandbox.html'),
      },
    },
  },
})
