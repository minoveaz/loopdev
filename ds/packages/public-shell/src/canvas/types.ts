import type { PublicCompositionRegion, PublicViewComposition } from '@loopdev/contracts';
import type { ReactNode } from 'react';

export interface PublicCanvasProps {
  composition: PublicViewComposition;
  children: ReactNode;
  className?: string;
}

export interface PublicCanvasRegionProps {
  id: string;
  regionSpec?: PublicCompositionRegion;
  children: ReactNode;
  className?: string;
}
