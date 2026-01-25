import { LogoAsset } from '@loopdev/contracts';

export interface LogoVariantCardProps {
  /** The logo asset to display */
  logo?: LogoAsset;
  /** Optional React Node to override the default rendering */
  logoNode?: React.ReactNode;
  /** Label for the variant (e.g., "Horizontal Lockup") */
  label: string;
  /** Context description */
  description?: string;
  /** Visual theme for the card preview area */
  theme?: 'light' | 'dark' | 'brand';
}
