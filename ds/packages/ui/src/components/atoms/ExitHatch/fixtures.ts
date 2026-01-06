import { ExitHatchProps } from './types';

export const EXIT_HATCH_FIXTURES: Record<string, ExitHatchProps> = {
  default: {
    label: 'Back to OS',
    icon: 'ArrowLeft',
    onClick: () => console.log('OS Exit')
  },
  rail: {
    label: 'Exit',
    icon: 'ArrowLeft',
    isRail: true,
    onClick: () => console.log('Rail Exit')
  }
};
