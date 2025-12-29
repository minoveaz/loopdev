import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { TenantProvider, LayoutProvider } from '@loopdev/ui'
import AppRouter from '@/routes/AppRouter'
import './index.css'

// Importación de estilos
import '../../../ds/packages/ui/src/styles/base-variables.css'
import '../../../ds/packages/ui/src/styles/themes.css'
import '../../../ds/packages/ui/src/styles/globals.css'

// Error handling global para diagnóstico en pantalla
window.onerror = function(message, source, lineno, colno, error) {
  console.error('GLOBAL ERROR:', message, 'at', source, lineno, colno, error);
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="padding: 40px; background: #fff5f5; border: 2px solid #feb2b2; color: #c53030; font-family: sans-serif; border-radius: 8px; margin: 20px;">
        <h1 style="margin-top: 0;">Runtime Crash Detectado</h1>
        <p><strong>Error:</strong> ${message}</p>
        <p><strong>Ubicación:</strong> ${source}:${lineno}:${colno}</p>
        <div style="background: #1a202c; color: #fff; padding: 15px; border-radius: 4px; overflow: auto; font-family: monospace; font-size: 12px; margin-top: 20px;">
          ${error?.stack || 'No stack trace available'}
        </div>
        <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #c53030; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Reiniciar Aplicación
        </button>
      </div>
    `;
  }
};

const MOCK_TENANT = 'loopdev';
console.log('Main.tsx is executing with tenant:', MOCK_TENANT);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <TenantProvider tenant={MOCK_TENANT}>
        <LayoutProvider>
          <AppRouter />
        </LayoutProvider>
      </TenantProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
