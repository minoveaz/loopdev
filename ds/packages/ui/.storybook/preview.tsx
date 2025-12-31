import React, { useEffect } from "react";
import type { Preview } from "@storybook/react";

// Estilos Globales
import "../src/styles/globals.css";
import "../src/styles/fonts.css";

// Foundations y Temas
import "../../tokens/src/css/base.css";
import "../../tokens/src/css/theme-estar-protegidos.css";
import "../../tokens/src/css/theme-client-b.css";
import "../../tokens/src/css/theme-ep-subbrands.css";

import { TenantProvider } from "../src/providers/tenant-provider";
import { LayoutProvider } from "../src/providers/layout-provider";

const preview: Preview = {
  parameters: {
    layout: 'centered',
    backgrounds: {
      disable: true, // Disable default backgrounds to use our own logic
    }
  },
  globalTypes: {
    themeMode: {
      name: "Appearance",
      description: "Toggle between light and dark mode",
      defaultValue: "dark",
      toolbar: {
        icon: "mirror",
        items: [
          { value: "light", title: "Light Mode", icon: "sun" },
          { value: "dark", title: "Dark Mode", icon: "moon" },
        ],
        showName: true,
      },
    },
    tenant: {
      name: "Tenant",
      description: "Select the brand tenant",
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
  },
  decorators: [
    (Story, context) => {
      const { themeMode, tenant } = context.globals;
      
      // Update the class on the html element for Tailwind's 'class' dark mode strategy
      useEffect(() => {
        const html = document.documentElement;
        if (themeMode === 'dark') {
          html.classList.add('dark');
        } else {
          html.classList.remove('dark');
        }
      }, [themeMode]);

      const themeClass = tenant === 'loopdev' ? '' : `theme-${tenant}`;

      return (
        <TenantProvider tenant={tenant}>
          <LayoutProvider>
            <div 
              className={`${themeClass} ${themeMode === 'dark' ? 'dark' : ''}`}
              style={{ 
                fontFamily: 'Inter, sans-serif',
                color: 'var(--lpd-color-text-base)',
                background: 'var(--lpd-color-bg-base)',
                padding: '2rem',
                minHeight: '100vh',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.3s ease, color 0.3s ease'
              }}
            >
              <style>
                {`
                  .material-symbols-outlined {
                    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
                  }
                `}
              </style>
              <Story />
            </div>
          </LayoutProvider>
        </TenantProvider>
      );
    },
  ],
};

export default preview;