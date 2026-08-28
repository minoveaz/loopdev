'use client';

import React from 'react';
import type { SpacerProps } from './types';

const sizeClasses = {
  sm: {
    horizontal: 'h-full w-1',
    vertical: 'h-1 w-full',
  },
  md: {
    horizontal: 'h-full w-4',
    vertical: 'h-4 w-full',
  },
  lg: {
    horizontal: 'h-full w-6',
    vertical: 'h-6 w-full',
  },
} as const;

const sizePixels = {
  sm: 4,
  md: 16,
  lg: 24,
} as const;

export const Spacer: React.FC<SpacerProps> = ({
  size = 'md',
  orientation = 'vertical',
  className = '',
}) => {
  const classes = `${sizeClasses[size][orientation]} shrink-0`;
  const sizeStyle = orientation === 'vertical'
    ? { height: sizePixels[size], width: '100%' }
    : { height: '100%', width: sizePixels[size] };

  return <div aria-hidden="true" className={`${classes} bg-transparent ${className}`} style={sizeStyle} />;
};

export type { SpacerOrientation, SpacerProps, SpacerSize } from './types';
