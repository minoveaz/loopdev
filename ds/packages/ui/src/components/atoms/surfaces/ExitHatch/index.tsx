'use client';

import React from 'react';
import * as LucideIcons from 'lucide-react';
import { LpdText } from '../..';
import { ExitHatchProps } from './types';
import { useExitHatch } from './useExitHatch';

/**
 * @component ExitHatch
 * @description Átomo oficial para la navegación de retorno al Launchpad.
 * Implementa la estética de "Puerta de Salida" minimalista.
 * @category Foundations
 * @phase 1
 */
export const ExitHatch: React.FC<ExitHatchProps> = (props) => {
  const { label, icon = 'ArrowLeft', onClick } = props;
  const { containerClasses, iconClasses, textClasses, isRail } = useExitHatch(props);

  // Resolver icono de Lucide
  const IconComponent = (LucideIcons as any)[icon] || LucideIcons.ArrowLeft;

  return (
    <button 
      onClick={onClick}
      className={containerClasses}
      role="link"
      aria-label={label}
    >
      <IconComponent className={iconClasses} />
      
      {!isRail && (
        <LpdText size="nano" className={textClasses}>
          {label}
        </LpdText>
      )}
    </button>
  );
};
