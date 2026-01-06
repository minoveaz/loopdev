import { IdentityBarProps } from './types';

export const IDENTITY_BAR_FIXTURES: Record<string, IdentityBarProps> = {
  marketing: {
    color: 'var(--lpd-color-brand-primary)',
    orientation: 'vertical',
    size: 'md',
    withGlow: true
  },
  finance: {
    color: '#10B981', // Success Green
    orientation: 'vertical',
    size: 'md'
  },
  rail_indicator: {
    color: 'var(--lpd-color-brand-primary)',
    orientation: 'vertical',
    size: 'lg'
  }
};
