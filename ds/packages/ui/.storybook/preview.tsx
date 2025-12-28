import React from "react";
import type { Preview } from "@storybook/react";

// Estilos Globales
import "../src/styles/globals.css";
import "../src/styles/fonts.css";

// Foundations y Temas
import "@loopdev/tokens/src/foundations/index.css";
import "@loopdev/tokens/src/css/theme-estar-protegidos.css";
import "@loopdev/tokens/src/css/theme-client-b.css";
import "@loopdev/tokens/src/css/theme-ep-subbrands.css";

import { TenantProvider, type Tenant, type Subbrand } from "../src/providers/tenant-provider";

const preview: Preview = {
  parameters: {
    layout: 'centered',
  },
  globalTypes: {
    theme: {
      name: "Tenant Principal",
      description: "Selecciona el cliente raíz",
      defaultValue: "loopdev",
      toolbar: {
        icon: "category",
        items: [
          { value: "loopdev", title: "LoopDev (Brand)" },
          { value: "estar-protegidos", title: "Estar Protegidos" },
          { value: "client-b", title: "Cliente B" },
        ],
        showName: true,
      },
    },
    subbrand: {
      name: "Sub-marca (EP Only)",
      description: "Sub-marcas específicas de Estar Protegidos",
      defaultValue: "none",
      toolbar: {
        icon: "structure",
        items: [
          { value: "none", title: "Ninguna / General" },
          { value: "protege-salud", title: "Protege tu Salud" },
          { value: "protege-viaje", title: "Protege tu Viaje" },
          { value: "protege-hogar", title: "Protege tu Hogar" },
          { value: "protege-finanzas", title: "Protege tus Finanzas" },
        ],
        showName: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const { theme, subbrand } = context.globals;
      const tenant = theme as Tenant;
      const activeSubbrand = (theme === 'estar-protegidos' && subbrand !== 'none') ? (subbrand as Subbrand) : 'none';
      
      const themeClass = theme === 'loopdev' ? '' : `theme-${theme}`;
      const isFullscreen = context.parameters.layout === 'fullscreen';
      
      return (
        <TenantProvider tenant={tenant} subbrand={activeSubbrand}>
          <div 
            className={themeClass} 
            data-subbrand={activeSubbrand !== 'none' ? activeSubbrand : undefined}
            style={{ 
              fontFamily: 'var(--lpd-font-sans)',
              color: 'var(--lpd-color-text-base)',
              background: 'var(--lpd-color-bg-base)',
              padding: isFullscreen ? '0' : 'var(--lpd-space-12)',
              minHeight: isFullscreen ? '0' : '100vh',
              width: '100%',
              display: isFullscreen ? 'block' : 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <div style={{ 
              position: 'relative', 
              width: '100%', 
              height: isFullscreen ? '100vh' : 'auto',
              display: isFullscreen ? 'block' : 'flex', 
              justifyContent: 'center' 
            }}>
              <Story />
              
              {/* Info Badge */}
              <div style={{ 
                position: 'fixed', bottom: '1rem', left: '1rem',
                fontSize: '10px', fontFamily: 'monospace', opacity: 0.5,
                pointerEvents: 'none', zIndex: 9999
              }}>
                Context: {tenant} {activeSubbrand !== 'none' ? `> ${activeSubbrand}` : ''}
              </div>
            </div>
          </div>
        </TenantProvider>
      );
    },
  ],
};

export default preview;