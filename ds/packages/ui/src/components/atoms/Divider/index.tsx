'use client';

import React from 'react';
import { useDivider } from './useDivider';
import { LpdText } from '../Typography';
import { DividerProps } from './types';

/**
 * @component Divider (Technical Standard v1.1)
 * @description Separador visual de alta precisión. Soporta grosores de 0.5px.
 * @category Primitives
 */
export const Divider: React.FC<DividerProps> = (props) => {
  const {
    label,
    isHorizontal,
    containerClasses,
    lineClasses,
    labelWrapperClasses
  } = useDivider(props);

  if (!label) {
    return (
      <div 
        className={containerClasses}
        role="separator"
        aria-orientation={isHorizontal ? 'horizontal' : 'vertical'}
      >
        <div className={lineClasses} />
      </div>
    );
  }

  return (
    <div className={containerClasses} role="separator" aria-orientation="horizontal">
      <div className={lineClasses} />
      <LpdText as="span" size="nano" weight="black" className={`shrink-0 uppercase tracking-widest opacity-40 ${labelWrapperClasses}`}>
        {label}
      </LpdText>
      <div className={lineClasses} />
    </div>
  );
};
