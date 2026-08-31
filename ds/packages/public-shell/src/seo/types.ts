import type { PublicBrandTheme, PublicSeoMetadata } from '@loopdev/contracts';

export interface PublicSeoHeadProps {
  seo: PublicSeoMetadata;
  brand?: PublicBrandTheme;
}
