export type BrandLogoVariant = 'full' | 'isotype' | 'logotype';
export type BrandLogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type TechnicalIsotypeTone = 'primary' | 'energy' | 'innovation' | 'neutral';

export interface BrandLogoContract {
  variant?: BrandLogoVariant;
  size?: BrandLogoSize;
  colorMode?: 'light' | 'dark';
}

export type SystemStatus = 'success' | 'warning' | 'danger' | 'error' | 'neutral' | 'energy';
export type SuiteAvailability = 'enabled' | 'disabled' | 'hidden';
export type SuiteMaturity = 'ready' | 'audit' | 'lab';

export interface SuiteCardContract {
  suiteId: string;
  title: string;
  description: string;
  status?: SuiteMaturity;
  availability: SuiteAvailability;
  requiresPermission?: string;
}

export interface SuiteAccessContract {
  suiteId: string;
  organizationId: string;
  availability: SuiteAvailability;
  permissions: string[];
  workspaceEnabled: boolean;
}
