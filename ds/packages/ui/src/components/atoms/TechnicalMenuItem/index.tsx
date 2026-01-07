'use client';

import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as LucideIcons from 'lucide-react';
import { TechnicalLabel } from '../TechnicalLabel';
import { TechnicalMenuItemProps } from './types';
import { useTechnicalMenuItem } from './useTechnicalMenuItem';

/**
 * @component TechnicalMenuItem
 * @description Unidad básica de interacción para menús técnicos.
 * Implementa el estándar visual v3.9 con soporte para iconos y atajos.
 * @category Foundations
 * @phase 1
 */
export const TechnicalMenuItem: React.FC<TechnicalMenuItemProps> = (props) => {
  const { icon, label, shortcut, isActive, isDisabled, onClick } = props;
  const { containerClasses, shortcutClasses, iconSize } = useTechnicalMenuItem(props);

  // Resolver icono de Lucide
  const IconComponent = icon ? (LucideIcons as any)[icon] : null;

  return (
    <DropdownMenu.Item 
      onClick={onClick}
      disabled={isDisabled}
      className={containerClasses}
    >
      {/* 1. Icono (Si existe) */}
      {IconComponent && (
        <IconComponent size={iconSize} className="shrink-0" />
      )}

      {/* 2. Etiqueta Principal */}
      <span className="flex-1 truncate">
        {label}
      </span>

      {/* 3. Atajo de Teclado (Si existe) */}
      {shortcut && (
        <div className={shortcutClasses}>
          <TechnicalLabel variant="subtle" size="nano" isWide={false}>
            {shortcut}
          </TechnicalLabel>
        </div>
      )}

      {/* 4. Indicador de Actividad (Check sutil si es activo) */}
      {isActive && (
        <LucideIcons.Check size={14} className="text-primary ml-2 shrink-0" />
      )}
    </DropdownMenu.Item>
  );
};
