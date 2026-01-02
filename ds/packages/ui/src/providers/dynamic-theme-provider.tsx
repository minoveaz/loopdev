import React, { createContext, useContext, useEffect, useMemo } from 'react';

export interface ThemeConfig {
  colors?: {
    primary?: string;
    energy?: string;
    success?: string;
    danger?: string;
    background?: string;
    surface?: string;
    text?: string;
  };
  borderRadius?: string;
  fontFamily?: string;
}

interface DynamicThemeContextProps {
  config: ThemeConfig;
}

const DynamicThemeContext = createContext<DynamicThemeContextProps | undefined>(undefined);

/**
 * @provider DynamicThemeProvider
 * @description Orquestador global de personalización.
 * Inyecta tokens de base de datos en todas las capas del Design System.
 */
export const DynamicThemeProvider: React.FC<{ config: ThemeConfig; children: React.ReactNode }> = ({ config, children }) => {
  
  useEffect(() => {
    const root = document.documentElement;
    
    // Mapeo Maestro: Una sola fuente de verdad para múltiples variables
    const cssMap: Record<string, string | undefined> = {
      // 1. PRIMARY CHAIN (Azul Corporativo)
      '--lpd-color-brand-primary': config.colors?.primary,
      '--lpd-color-status-info': config.colors?.primary,
      '--comp-primary': config.colors?.primary,
      '--comp-primary-dark': config.colors?.primary, 
      '--comp-primary-soft': config.colors?.primary ? `${config.colors.primary}1A` : undefined,

      // 2. ENERGY CHAIN (Amarillo IA)
      '--lpd-color-brand-energy': config.colors?.energy,
      '--lpd-color-status-warning': config.colors?.energy,
      '--comp-energy': config.colors?.energy,

      // 3. SUCCESS CHAIN
      '--lpd-color-status-success': config.colors?.success,
      
      // 4. DANGER CHAIN
      '--lpd-color-status-error': config.colors?.danger,

      // 5. FOUNDATIONS
      '--lpd-radius-base': config.borderRadius,
      '--lpd-font-sans': config.fontFamily ? `'${config.fontFamily}', sans-serif` : undefined,
      '--lpd-color-bg-base': config.colors?.background,
      '--lpd-color-text-base': config.colors?.text,
    };

    Object.entries(cssMap).forEach(([variable, value]) => {
      if (value) {
        root.style.setProperty(variable, value);
      }
    });

  }, [config]);

  const value = useMemo(() => ({ config }), [config]);

  return (
    <DynamicThemeContext.Provider value={value}>
      {children}
    </DynamicThemeContext.Provider>
  );
};

export const useDynamicTheme = () => {
  const context = useContext(DynamicThemeContext);
  if (!context) {
    throw new Error('useDynamicTheme must be used within a DynamicThemeProvider');
  }
  return context;
};
