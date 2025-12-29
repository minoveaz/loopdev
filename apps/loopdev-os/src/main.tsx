import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { LayoutProvider, TenantProvider } from '@loopdev/ui'
import AppRouter from '@/routes/AppRouter'
import './index.css'

// Importar Estilos del Design System
import '@loopdev/ui/styles/base-variables.css'
import '@loopdev/ui/styles/themes.css'
import '@loopdev/ui/styles/globals.css'

// Mock Tenant Data (In production this comes from URL or Auth)
const MOCK_TENANT = {
  id: 'demo-tenant',
  name: 'Demo Corp',
  brand: {
    colors: { primary: '#3b82f6', secondary: '#64748b' }
  }
};

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
