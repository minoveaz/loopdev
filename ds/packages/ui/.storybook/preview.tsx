import React, { useEffect } from "react";
import type { Preview } from "@storybook/react";

// Estilos Globales
import "../src/styles/globals.css";
import "../src/styles/fonts.css";

// Foundations y Temas
import "../../tokens/src/css/base.css";

import { TenantProvider } from "../src/providers/tenant-provider";
import { LayoutProvider } from "../src/providers/layout-provider";
import { DynamicThemeProvider } from "../src/providers/dynamic-theme-provider";

// Componente Wrapper para manejar la lógica de los Globales de Storybook
const StoryWrapper = ({ children, context }: any) => {
  const { themeMode, primaryColor, energyColor } = context.globals;
  
  useEffect(() => {
    const html = document.documentElement;
    if (themeMode === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [themeMode]);

  // Sincronizamos con el DynamicThemeProvider
  const dbConfig = React.useMemo(() => ({
    colors: {
      primary: primaryColor,
      energy: energyColor,
      success: "#10B981",
      danger: "#EF4444"
    },
    borderRadius: "12px"
  }), [primaryColor, energyColor]);

  return (
    <DynamicThemeProvider config={dbConfig}>
      <TenantProvider tenant="loopdev">
        <LayoutProvider>
          <div 
            className={`${themeMode === 'dark' ? 'dark' : ''} bg-grid-40 min-h-screen w-full flex flex-col items-center justify-center transition-colors duration-300`}
            style={{ 
              fontFamily: 'Inter, sans-serif',
              padding: '2rem',
              position: 'relative'
            }}
          >
            {/* Inject Material Symbols configuration for the iframe */}
            <style>
              {`
                .material-symbols-outlined {
                  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
                }
              `}
            </style>
            {children}
          </div>
        </LayoutProvider>
      </TenantProvider>
    </DynamicThemeProvider>
  );
};

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    backgrounds: { disable: true }
  },
  globalTypes: {
    themeMode: {
      name: "Appearance",
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
    primaryColor: {
      name: "Primary Color (DB)",
      description: "Main Brand Color",
      defaultValue: "#135BEC",
      toolbar: { icon: "paintbrush", items: [
        { value: "#135BEC", title: "LoopDev Blue" },
        { value: "#9333EA", title: "Innovation Purple" },
        { value: "#EF4444", title: "Danger Red" },
        { value: "#10B981", title: "Success Green" },
      ]}
    },
    energyColor: {
      name: "AI Energy Color (DB)",
      description: "AI/Generative Highlights",
      defaultValue: "#FFD025",
      toolbar: { icon: "zap", items: [
        { value: "#FFD025", title: "Standard Energy" },
        { value: "#F43F5E", title: "Rose Pulse" },
        { value: "#0EA5E9", title: "Sky Flow" },
        { value: "#D946EF", title: "Fuchsia Mind" },
      ]}
    }
  },
  decorators: [
    (Story, context) => (
      <StoryWrapper context={context}>
        <Story />
      </StoryWrapper>
    ),
  ],
};

export default preview;
