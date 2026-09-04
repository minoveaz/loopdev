import type { PublicBrandTheme } from '@loopdev/contracts';
import type { ReactNode } from 'react';

export interface BrandThemeContextValue {
  theme: PublicBrandTheme;
  updateTheme?: (newTheme: Partial<PublicBrandTheme>) => void;
}

export interface BrandThemeProviderProps {
  theme: PublicBrandTheme;
  children: ReactNode;
}
