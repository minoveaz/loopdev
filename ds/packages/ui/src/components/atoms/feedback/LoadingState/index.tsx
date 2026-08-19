import React from 'react';
import { Skeleton } from '../Skeleton';
import { LpdText } from '../../foundations/Typography';
import type { LoadingStateProps } from './types';

export const LoadingState: React.FC<LoadingStateProps> = ({
  label = 'Loading',
  lines = 3,
  className = '',
  ...rest
}) => (
  <div className={`space-y-3 ${className}`} role="status" aria-busy="true" {...rest}>
    <LpdText size="sm" className="sr-only">
      {label}
    </LpdText>
    {Array.from({ length: Math.max(1, lines) }, (_, index) => (
      <Skeleton key={index} className={index === 0 ? 'h-5 w-2/5' : 'h-4 w-full'} />
    ))}
  </div>
);

export type { LoadingStateProps } from './types';
