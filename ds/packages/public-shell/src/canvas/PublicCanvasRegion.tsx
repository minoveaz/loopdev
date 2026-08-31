'use client';

import React, { useContext } from 'react';
import { clsx } from 'clsx';
import { PublicCanvasContext } from './PublicCanvas';
import type { PublicCanvasRegionProps } from './types';

const colSpanDesktop: Record<number, string> = {
  1: 'lg:col-span-1',
  2: 'lg:col-span-2',
  3: 'lg:col-span-3',
  4: 'lg:col-span-4',
  5: 'lg:col-span-5',
  6: 'lg:col-span-6',
  7: 'lg:col-span-7',
  8: 'lg:col-span-8',
  9: 'lg:col-span-9',
  10: 'lg:col-span-10',
  11: 'lg:col-span-11',
  12: 'lg:col-span-12',
};

const colSpanTablet: Record<number, string> = {
  1: 'md:col-span-1',
  2: 'md:col-span-2',
  3: 'md:col-span-3',
  4: 'md:col-span-4',
  5: 'md:col-span-5',
  6: 'md:col-span-6',
  7: 'md:col-span-7',
  8: 'md:col-span-8',
  9: 'md:col-span-9',
  10: 'md:col-span-10',
  11: 'md:col-span-11',
  12: 'md:col-span-12',
};

export const PublicCanvasRegion: React.FC<PublicCanvasRegionProps> = ({
  id,
  regionSpec,
  children,
  className,
}) => {
  const canvasContext = useContext(PublicCanvasContext);
  const spec =
    regionSpec ??
    canvasContext?.composition.regions.find((r) => r.id === id);

  if (!spec) {
    return <div id={id} className={clsx('col-span-12', className)}>{children}</div>;
  }

  const colSpan = Math.min(12, Math.max(1, spec.colSpan));
  const desktopClass = colSpanDesktop[colSpan] ?? 'lg:col-span-12';

  // Responsive Tablet Resolution
  let tabletClass = 'md:col-span-12';
  if (spec.responsive?.tablet === 'preserve') {
    tabletClass = colSpanTablet[colSpan] ?? 'md:col-span-12';
  } else if (spec.responsive?.tablet === 'drawer') {
    tabletClass = 'hidden md:hidden lg:block';
  } else if (spec.responsive?.tablet === 'full' || spec.responsive?.tablet === 'stack') {
    tabletClass = 'md:col-span-12';
  }

  // Responsive Mobile Resolution
  let mobileClass = 'col-span-12';
  if (spec.responsive?.mobile === 'hidden' || spec.responsive?.mobile === 'sheet' || spec.responsive?.mobile === 'modal') {
    mobileClass = 'hidden lg:block';
  } else if (spec.responsive?.mobile === 'stack') {
    mobileClass = 'col-span-12';
  }

  // Sizing & Overflow
  const overflowClass =
    spec.overflow === 'auto-y'
      ? 'overflow-y-auto'
      : spec.overflow === 'hidden'
      ? 'overflow-hidden'
      : spec.overflow === 'auto-x'
      ? 'overflow-x-auto'
      : 'overflow-visible';

  const sizingClass =
    spec.sizing === 'fill'
      ? 'h-full min-h-0'
      : spec.sizing === 'fixed'
      ? 'flex-shrink-0'
      : 'h-auto';

  return (
    <section
      id={id}
      data-slot={spec.slot}
      className={clsx(
        mobileClass,
        tabletClass,
        desktopClass,
        overflowClass,
        sizingClass,
        className,
      )}
    >
      {children}
    </section>
  );
};
