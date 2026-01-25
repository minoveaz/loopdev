import { LogoAsset } from '@loopdev/contracts';

export interface LogoVariantCardProps {
  /** The logo asset to display */
  logo: LogoAsset;
  /** Label for the variant (e.g., "Horizontal Lockup") */
  label: string;
  /** Context description */
  description?: string;
  /** Visual theme for the card preview area */
  theme?: 'light' | 'dark' | 'brand';
}
