'use client';

import { useContext } from 'react';
import { BrandThemeContext } from './BrandThemeProvider';
import type { BrandThemeContextValue } from './types';

export const useBrandTheme = (): BrandThemeContextValue => {
  const context = useContext(BrandThemeContext);
  if (!context) {
    throw new Error('useBrandTheme must be used within a <BrandThemeProvider>');
  }
  return context;
};
