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

export interface TenantConfig {
  id: TenantId;
  name: string;
  description?: string;
  logo: {
    light: string;
    dark: string;
  };
  strategy: BrandStrategy; // Obligatorio y centralizado
  subbrands?: Record<SubbrandId, SubbrandConfig>;
  features: string[];
  settings: {
    defaultSubbrand?: SubbrandId;
    allowCustomThemes: boolean;
  };
}