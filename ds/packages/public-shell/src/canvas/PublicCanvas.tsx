'use client';

import React, { createContext } from 'react';
import { clsx } from 'clsx';
import type { PublicViewComposition } from '@loopdev/contracts';
import type { PublicCanvasProps } from './types';

export const PublicCanvasContext = createContext<{ composition: PublicViewComposition } | null>(
  null,
);

const gapClasses = {
  none: 'gap-0',
  sm: 'gap-3',
  md: 'gap-6',
  lg: 'gap-8',
} as const;

const maxWidthClasses = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-[1720px]',
} as const;

const alignmentClasses = {
  start: 'items-start',
  stretch: 'items-stretch',
  center: 'items-center',
} as const;

export const PublicCanvas: React.FC<PublicCanvasProps> = ({ composition, children, className }) => {
  const gapClass = gapClasses[composition.grid.gap ?? 'md'];
  const maxWidthClass = maxWidthClasses[composition.grid.maxWidth ?? '7xl'];
  const alignClass = alignmentClasses[composition.grid.alignment ?? 'stretch'];
  const isStartAlign = composition.grid.alignment === 'start';
  const isViewportLocked =
    (composition.grid.scrollMode ?? 'viewport-contained') === 'viewport-contained';

  return (
    <PublicCanvasContext.Provider value={{ composition }}>
      <main
        className={clsx(
          'w-full max-w-full min-w-0 mx-auto px-3 sm:px-6 lg:px-8 xl:px-12 py-3 sm:py-5 overflow-x-clip lg:overflow-x-visible',
          'grid grid-cols-12',
          isViewportLocked &&
            'lg:h-[calc(100vh-4.5rem)] lg:max-h-[calc(100vh-4.5rem)] lg:overflow-hidden',
          isStartAlign ? 'auto-rows-min' : 'auto-rows-fr',
          alignClass,
          gapClass,
          maxWidthClass,
          className,
        )}
      >
        {children}
      </main>
    </PublicCanvasContext.Provider>
  );
};
