'use client';

import { DynamicThemeProvider, type ThemeConfig } from '@loopdev/ui';
import { semanticColors } from '@loopdev/tokens';
import { useOrganization } from '@/hooks/useOrganization';

const ORGANIZATION_THEMES: Record<string, ThemeConfig> = {
  loopdev: {
    colors: {
      primary: semanticColors.primary,
      accent: semanticColors.energy,
      energy: semanticColors.energy,
    },
  },
  'estar-protegidos': {
    colors: {
      primary: 'var(--lpd-color-brand-primary)',
      accent: 'var(--lpd-color-brand-secondary)',
      energy: 'var(--lpd-color-brand-primary)',
    },
  },
  'protege-tu-salud': {
    colors: {
      primary: 'var(--lpd-color-brand-primary)',
      accent: 'var(--lpd-color-brand-primary)',
      energy: 'var(--lpd-color-brand-primary)',
    },
  },
  'protege-salud': {
    colors: {
      primary: 'var(--lpd-color-brand-primary)',
      accent: 'var(--lpd-color-brand-primary)',
      energy: 'var(--lpd-color-brand-primary)',
    },
  },
};

const DEFAULT_THEME: ThemeConfig = {
  colors: {
    primary: semanticColors.primary,
    accent: semanticColors.energy,
    energy: semanticColors.energy,
  },
};

export function OrganizationThemeProvider({ children }: { children: React.ReactNode }) {
  const { activeOrganization } = useOrganization();
  const config = ORGANIZATION_THEMES[activeOrganization?.slug ?? ''] ?? DEFAULT_THEME;

  return <DynamicThemeProvider config={config}>{children}</DynamicThemeProvider>;
}
