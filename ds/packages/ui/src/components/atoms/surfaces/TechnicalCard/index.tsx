'use client';

import React from 'react';
import { TechnicalSurface } from '../TechnicalSurface';
import { TechnicalCardProps } from './types';

/**
 * @component TechnicalCard
 * @description Átomo de superficie universal para LoopDev OS.
 * Implementa bordes de 0.5px, radio de 2xl y estados interactivos industriales.
 */
export const TechnicalCard: React.FC<TechnicalCardProps> = ({
  variant = 'flat',
  children,
  className,
  ...props
}) => {
  const isInteractive = variant === 'interactive';
  const isDisabled = variant === 'disabled';

  return (
    <TechnicalSurface
      {...props}
      className={`${isDisabled ? 'opacity-60' : ''} ${className ?? ''}`.trim()}
      depth={isInteractive ? 'raised' : 'flat'}
      interaction={isInteractive ? 'interactive' : 'static'}
      radius="xl"
      aria-disabled={isDisabled ? true : props['aria-disabled']}
      data-card-variant={variant}
      data-card-disabled={isDisabled || undefined}
    >
      {children}
    </TechnicalSurface>
  );
};
