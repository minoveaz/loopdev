import { LogoAsset } from '@loopdev/contracts';

export interface LogoShowcaseProps {
  /** The core symbol to display (usually the Isotype) */
  logo: LogoAsset;
  /** Optional React Node to override the default rendering (e.g. certified BrandLogo) */
  logoNode?: React.ReactNode;
  /** Title for the showcase section (e.g. "The Isotype") */
  title?: string;
  /** Optional description or specs */
  description?: string;
  /** Whether to show the construction grid background */
  showGrid?: boolean;
}
