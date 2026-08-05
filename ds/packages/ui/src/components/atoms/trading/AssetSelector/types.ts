export type AssetCategory = 'crypto' | 'commodity' | 'forex' | 'index';

export interface Asset {
  symbol: string;
  name: string;
  category: AssetCategory;
  is_active?: boolean;
}

/**
 * @interface AssetSelectorProps
 * @description Contract for the industrial asset selection primitive.
 */
export interface AssetSelectorProps {
  /** List of available assets to select from */
  assets: Asset[];
  /** Currently selected symbol */
  value: string;
  /** Callback when an asset is selected */
  onChange: (symbol: string) => void;
  /** Label for the form field */
  label?: string;
  /** Whether the component is in a loading state */
  isLoading?: boolean;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}
