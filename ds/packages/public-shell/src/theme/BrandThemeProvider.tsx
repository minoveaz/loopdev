'use client';

import React, { createContext, useEffect, useMemo } from 'react';
import type { BrandThemeContextValue, BrandThemeProviderProps } from './types';

export const BrandThemeContext = createContext<BrandThemeContextValue | null>(null);

export const BrandThemeProvider: React.FC<BrandThemeProviderProps> = ({ theme, children }) => {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    root.style.setProperty('--lpd-brand-primary', theme.colors.primary);
    root.style.setProperty('--lpd-brand-primary-hover', theme.colors.primaryHover);
    root.style.setProperty('--lpd-brand-secondary', theme.colors.secondary);
    root.style.setProperty('--lpd-brand-accent', theme.colors.accent);
    root.style.setProperty('--lpd-brand-background', theme.colors.background);
    root.style.setProperty('--lpd-brand-surface', theme.colors.surface);
    root.style.setProperty('--lpd-brand-text-main', theme.colors.textMain);
    root.style.setProperty('--lpd-brand-text-secondary', theme.colors.textSecondary);
    root.style.setProperty('--lpd-brand-font-family', theme.typography.fontFamily);
  }, [theme]);

  const value = useMemo<BrandThemeContextValue>(() => ({ theme }), [theme]);

  return <BrandThemeContext.Provider value={value}>{children}</BrandThemeContext.Provider>;
};
