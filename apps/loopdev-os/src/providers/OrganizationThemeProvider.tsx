'use client';

import { useEffect } from 'react';
import { DynamicThemeProvider, type ThemeConfig } from '@loopdev/ui';
import { brandThemes, semanticColors } from '@loopdev/tokens';
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
    colors: brandThemes.estarProtegidos,
  },
  'protege-tu-salud': {
    colors: brandThemes.protegeTuSalud,
  },
  'protege-salud': {
    colors: brandThemes.protegeTuSalud,
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
  const slug = activeOrganization?.slug ?? '';
  const config = ORGANIZATION_THEMES[slug] ?? DEFAULT_THEME;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-estar-protegidos', 'theme-protege-tu-salud');
    if (slug === 'estar-protegidos') {
      root.classList.add('theme-estar-protegidos');
    } else if (slug === 'protege-tu-salud' || slug === 'protege-salud') {
      root.classList.add('theme-protege-tu-salud');
    }
  }, [slug]);

  return <DynamicThemeProvider config={config}>{children}</DynamicThemeProvider>;
}
