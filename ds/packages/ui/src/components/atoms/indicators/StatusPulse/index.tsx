'use client';

import React from 'react';
import { StatusPulseProps } from './types';
import { useStatusPulse } from './useStatusPulse';

/**
 * @component StatusPulse
 * @description Átomo oficial de telemetría visual. Indica actividad y salud del sistema.
 * @category Foundations
 * @phase 1
 */
export const StatusPulse: React.FC<StatusPulseProps> = (props) => {
  const { pulseClasses } = useStatusPulse(props);

  return (
    <div 
      className={pulseClasses} 
      role="presentation"
      aria-hidden="true"
    />
  );
};
