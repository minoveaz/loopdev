import React from 'react';
import type { Preview } from '@storybook/react';

// Estilos globales de la aplicación de Docs
import '../src/tailwind.css';

// Estilos compartidos de la librería UI (vía alias configurado en main.ts)
import '@loopdev/ui/styles/base-variables.css';
import '@loopdev/ui/styles/themes.css';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      story: {
        inline: true,
        iframeHeight: 400,
      },
    },
  },
  
  globalTypes: {
    company: {
      name: 'Empresa',
      description: 'Selecciona la empresa principal',
      defaultValue: 'ep',
      toolbar: {
        icon: 'branch',
        items: [
          { value: 'ep', title: 'Estar Protegidos (Grupo)', icon: 'globe' },
          { value: 'client-b', title: 'Cliente B', icon: 'company' },
          { value: 'client-c', title: 'Cliente C', icon: 'company' },
        ],
        showName: true,
      },
    },
    brand: {
      name: 'Marca',
      description: 'Selecciona la sub-marca específica',
      defaultValue: 'estar-protegidos',
      toolbar: {
        icon: 'grid',
        items: [
          { value: 'estar-protegidos', title: 'Estar Protegidos (Main)' },
          { value: 'protege-tu-salud', title: 'Protege tu Salud' },
          { value: 'protege-tu-viaje', title: 'Protege tu Viaje' },
          { value: 'protege-tu-hogar', title: 'Protege tu Hogar' },
          { value: 'protege-tus-finanzas', title: 'Protege tus Finanzas' },
        ],
        showName: true,
      },
    },
  },

  decorators: [
    (Story, context) => {
      const { company, brand } = context.globals;
      const activeThemeClass = company === 'ep' ? `theme-${brand}` : `theme-${company}`;
      const isDocs = context.viewMode === 'docs';

      return (
        <div 
          className={activeThemeClass}
          style={{ 
            padding: isDocs ? '2rem 0' : '4rem', 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center', 
            gap: '2rem',
            background: isDocs ? 'transparent' : 'var(--background)',
            minHeight: isDocs ? 'auto' : '100%',
            width: '100%',
            transition: 'all 0.3s ease',
          }}
        >
          <div style={{ 
            padding: '2rem', 
            borderRadius: '1.5rem', 
            border: '1px solid var(--border)', 
            background: 'var(--background)', 
            boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1)',
            width: 'fit-content',
            minWidth: '250px',
            display: 'flex',
            justifyContent: 'center'
          }}>
             <Story />
          </div>

          <div style={{ 
            fontSize: '0.7rem', 
            color: 'var(--foreground)', 
            opacity: 0.8,
            fontFamily: 'var(--font-family-body)',
            textAlign: 'center',
            padding: '1rem',
            background: 'var(--background)',
            borderRadius: '1rem',
            border: '1px solid var(--border)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            <p style={{ margin: 0, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {company === 'ep' ? `Grupo: Estar Protegidos > ${brand}` : `Empresa: ${company}`}
            </p>
            <p style={{ margin: '4px 0 0 0', opacity: 0.6 }}>
              Font: <span style={{ fontFamily: 'var(--font-family-heading)' }}>Heading Font</span> | Body Font
            </p>
          </div>
        </div>
      );
    },
  ],
};

export default preview;