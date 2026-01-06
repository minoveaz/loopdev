'use client';

import React from 'react';
import { ScrollAreaProps } from './types';
import { useScrollArea } from './useScrollArea';

/**
 * @component ScrollArea
 * @description Utilidad para renderizar áreas con el scroll técnico de LoopDev.
 * @category Foundations
 * @phase 1
 */
export const ScrollArea: React.FC<ScrollAreaProps> = (props) => {
  const { children } = props;
  const { containerClasses } = useScrollArea(props);

  return (
    <div className={containerClasses}>
      {children}
    </div>
  );
};
