'use client';

import React from 'react';
import { IdentityBar, TechnicalLabel } from '../../atoms';
import { SidebarIdentityProps } from './types';
import { useSidebarIdentity } from './useSidebarIdentity';

/**
 * @component SidebarIdentity
 * @description Cabecera oficial que unifica la marca y el contexto de suite. 
 * Implementa la lógica de densidad Rail/Expanded de forma automatizada.
 * @category Composites
 * @phase 1
 */
export const SidebarIdentity: React.FC<SidebarIdentityProps> = (props) => {
  const { logo, name, accentColor, isRail } = props;
  const { containerClasses, logoWrapperClasses, handleOnClick } = useSidebarIdentity(props);

  return (
    <section className={containerClasses}>
      {/* 1. Bloque de Logo / Isotipo */}
      <div className={logoWrapperClasses} onClick={handleOnClick}>
        {logo}
      </div>
      
      {/* 2. Bloque de Nombre y Orientación (Oculto en Rail) */}
      {!isRail && (
        <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-500">
          <IdentityBar color={accentColor} size="md" />
          <TechnicalLabel variant="white" size="nano" className="truncate">
            {name}
          </TechnicalLabel>
        </div>
      )}
    </section>
  );
};
