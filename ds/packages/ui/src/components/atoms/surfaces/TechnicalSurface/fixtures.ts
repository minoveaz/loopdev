import { TechnicalSurfaceProps } from './types';

export const TECHNICAL_SURFACE_FIXTURES: Record<string, TechnicalSurfaceProps> = {
  card: {
    variant: 'surface',
    depth: 'raised',
    withGrid: true,
  },
  panel: {
    variant: 'canvas',
    depth: 'flat',
  },
  modal: {
    variant: 'glass',
    depth: 'overlay',
  }
};
