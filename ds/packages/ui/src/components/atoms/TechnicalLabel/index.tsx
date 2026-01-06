'use client';

import React from 'react';
import { Text as LpdText } from '../Typography';
import { TechnicalLabelProps } from './types';
import { useTechnicalLabel } from './useTechnicalLabel';

/**
 * @component TechnicalLabel
 * @description Átomo tipográfico para micro-metadatos y clasificación técnica.
 * Implementa el estándar de autoridad técnica v3.8.
 * @category Foundations
 * @phase 1
 */
export const TechnicalLabel: React.FC<TechnicalLabelProps> = (props) => {
  const { children } = props;
  const { labelClasses } = useTechnicalLabel(props);

  return (
    <span className={labelClasses}>
      {children}
    </span>
  );
};
