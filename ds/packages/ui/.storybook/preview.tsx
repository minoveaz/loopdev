import React from "react";
import type { Preview } from "@storybook/react";

// Importamos Tailwind
import "../src/styles/globals.css";

// Importamos los tokens en orden: Base primero, luego los temas
import "../../tokens/src/css/base.css";
import "../../tokens/src/css/theme-estar-protegidos.css";
import "../../tokens/src/css/theme-client-b.css";

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  globalTypes: {
    client: {
      name: "Client",
      description: "Global theme for the components",
      defaultValue: "estar-protegidos",
      toolbar: {
        icon: "circlehollow",
        items: [
          { value: "estar-protegidos", title: "Estar Protegidos" },
          { value: "client-b", title: "Cliente B" },
        ],
        showName: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const client = context.globals.client || 'estar-protegidos';
      const themeClass = `theme-${client}`;
      
      return (
        <div className={themeClass} style={{ 
          padding: '3rem', 
          minWidth: '300px', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          justifyContent: 'center', 
          background: 'var(--brand-surface, #fff)',
          minHeight: '100vh',
          width: '100vw'
        }}>
          <Story />
          <div style={{ marginTop: '2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Client: <span style={{ fontWeight: 'bold', color: 'var(--brand-primary)' }}>{client}</span> | 
            Font: <span style={{ fontWeight: 'bold' }}>{client === 'client-b' ? 'Poppins' : 'Inter'}</span>
          </div>
        </div>
      );
    },
  ],
};

export default preview;
