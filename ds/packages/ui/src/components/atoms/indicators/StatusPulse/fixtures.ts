import { StatusPulseProps } from './types';

export const STATUS_PULSE_FIXTURES: Record<string, StatusPulseProps> = {
  operational: {
    variant: 'success',
    size: 'sm',
    isAnimated: true
  },
  activeContext: {
    variant: 'energy',
    size: 'sm',
    isAnimated: true
  },
  error: {
    variant: 'danger',
    size: 'md',
    isAnimated: false
  }
};
