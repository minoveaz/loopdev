import { TechnicalLabelProps } from './types';

export const TECHNICAL_LABEL_FIXTURES: Record<string, TechnicalLabelProps> = {
  group: {
    variant: 'muted',
    size: 'nano',
    children: 'Operativo'
  },
  highlight: {
    variant: 'primary',
    size: 'xs',
    children: 'System Active'
  },
  subtle: {
    variant: 'subtle',
    size: 'nano',
    children: 'v1.0.4'
  }
};
