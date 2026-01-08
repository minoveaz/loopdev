'use client';

import React from 'react';
import { EngineeringSealProps } from './types';
import { useEngineeringSeal } from './useEngineeringSeal';

/**
 * @component EngineeringSeal
 * @description Átomo oficial que certifica la autoridad técnica y versión de un módulo.
 * @category Primitives
 * @phase 1
 */
export const EngineeringSeal: React.FC<EngineeringSealProps> = (props) => {
  const { version } = props;
  const { label, containerClasses, identityClasses, versionClasses } = useEngineeringSeal(props);

  return (
    <div className={containerClasses} role="status" aria-label={`Versión del sistema: ${version}`}>
      {/* Bloque de Identidad Estructural */}
      <div className={identityClasses}>
        {label}
      </div>
      
      {/* Bloque de Versión con Sintaxis de Brackets */}
      <div className={versionClasses}>
        {`{ ${version} }`}
      </div>
    </div>
  );
};
