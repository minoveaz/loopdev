export type TenantId = 'loopdev' | 'estar-protegidos' | 'client-b';
export type SubbrandId = 'protege-salud' | 'protege-viaje' | 'protege-hogar' | 'protege-finanzas' | 'none';

export interface BrandStrategy {
  purpose: string;
  promise: string;
  personality: string[];
  voice: {
    base: string;
    traits: string[];
  };
  territory: string[];
}

export interface SubbrandConfig {
  id: SubbrandId;
  name: string;
  description: string;
  // Ya no hay strategy aquí, se hereda del Tenant
}

export interface LayoutSettings {
  sidebarDefaultVariant: 'expanded' | 'collapsed';
  /** Visual style for the sidebars: 'base' (white/subtle) or 'brand' (using tenant primary/secondary colors) */
  sidebarStyle: 'base' | 'brand';
  /** Visual style for the top header: 'base' or 'brand' */
  headerStyle: 'base' | 'brand';
  rightSidebarHasRail: boolean;
  primaryHeaderHeight: number;
}

export interface TenantConfig {
  id: TenantId;
  name: string;
  description?: string;
  logo: {
    light: string;
    dark: string;
  };
  strategy: BrandStrategy;
  subbrands?: Record<SubbrandId, SubbrandConfig>;
  features: string[];
  settings: {
    defaultSubbrand?: SubbrandId;
    allowCustomThemes: boolean;
    layout: LayoutSettings;
  };
}