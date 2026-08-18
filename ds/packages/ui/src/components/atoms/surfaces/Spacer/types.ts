export type SpacerSize = 'sm' | 'md' | 'lg';
export type SpacerOrientation = 'horizontal' | 'vertical';

export interface SpacerProps {
  size?: SpacerSize;
  orientation?: SpacerOrientation;
  className?: string;
}
