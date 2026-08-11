'use client';

import { DynamicThemeProvider, type ThemeConfig } from '@loopdev/ui';
import { useOrganization } from '@/hooks/useOrganization';

const ORGANIZATION_THEMES: Record<string, ThemeConfig> = {
  loopdev: {
    colors: { primary: '#135bec', accent: '#FFD025', energy: '#FFD025' },
  },
  'estar-protegidos': {
    colors: { primary: '#57C19A', accent: '#00745A', energy: '#57C19A' },
  },
  'protege-tu-salud': {
    colors: { primary: '#22C7A9', accent: '#22C7A9', energy: '#22C7A9' },
  },
  'protege-salud': {
    colors: { primary: '#22C7A9', accent: '#22C7A9', energy: '#22C7A9' },
  },
};

const DEFAULT_THEME: ThemeConfig = {
  colors: { primary: '#135bec', accent: '#FFD025', energy: '#FFD025' },
};

export function OrganizationThemeProvider({ children }: { children: React.ReactNode }) {
  const { activeOrganization } = useOrganization();
  const config = ORGANIZATION_THEMES[activeOrganization?.slug ?? ''] ?? DEFAULT_THEME;

  return <DynamicThemeProvider config={config}>{children}</DynamicThemeProvider>;
}