'use client';

import React from 'react';
import { IdentityBarProps } from './types';
import { useIdentityBar } from './useIdentityBar';

/**
 * @component IdentityBar
 * @description Átomo marcador que inyecta el color de marca sutilmente para orientación.
 * @category Foundations
 * @phase 1
 */
export const IdentityBar: React.FC<IdentityBarProps> = (props) => {
  const { barClasses, style } = useIdentityBar(props);

  return (
    <div 
      className={barClasses} 
      style={style}
      role="presentation"
      aria-hidden="true"
    />
  );
};
