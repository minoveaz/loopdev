'use client';

import React from 'react';
import { TechnicalLabel } from '../..';
import { NavGroupProps } from './types';
import { useNavGroup } from './useNavGroup';

/**
 * @component NavGroup
 * @description Átomo encargado de agrupar ítems de navegación con tipografía técnica.
 * @category Foundations
 * @phase 1
 */
export const NavGroup: React.FC<NavGroupProps> = (props) => {
  const { label, children } = props;
  const { isRail, containerClasses } = useNavGroup(props);

  return (
    <div className={containerClasses}>
      {/* Etiqueta Técnica (Oculta en Rail Mode) */}
      {!isRail && (
        <div className="px-4 mb-1">
          <TechnicalLabel variant="muted">
            {label}
          </TechnicalLabel>
        </div>
      )}
      
      {/* Contenedor de Items */}
      <div className="space-y-0.5">
        {children}
      </div>
    </div>
  );
};
