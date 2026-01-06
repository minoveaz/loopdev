'use client';

import React from 'react';
import * as LucideIcons from 'lucide-react';
import { StatusPulse } from '../StatusPulse';
import { IdentityBar } from '../IdentityBar';
import { TechnicalTooltip } from '../TechnicalTooltip';
import { NavSidebarItemProps } from './types';
import { useNavSidebarItem } from './useNavSidebarItem';

/**
 * @component NavSidebarItem
 * @description Átomo oficial de navegación para el SuiteSidebar. 
 * Gestiona la identidad modular, el gobierno de acceso y el momentum.
 * @category Foundations
 * @phase 1
 */
export const NavSidebarItem: React.FC<NavSidebarItemProps> = (props) => {
  const { icon, label, accentColor, telemetry } = props;
  const { 
    isRail, 
    isActive, 
    isDisabled, 
    isComingSoon,
    containerClasses, 
    contentClasses, 
    technicalTooltip,
    handleClick 
  } = useNavSidebarItem(props);

  // Resolver icono de Lucide
  const IconComponent = (LucideIcons as any)[icon] || LucideIcons.HelpCircle;

  const ItemContent = (
    <div 
      onClick={handleClick}
      className={containerClasses}
      role="menuitem"
      aria-current={isActive ? 'page' : undefined}
      aria-disabled={isDisabled || isComingSoon}
    >
      {/* 1. Indicador Lateral (Exclusivo Rail Mode) */}
      {isActive && isRail && (
        <IdentityBar 
          color={accentColor} 
          size="technical" 
          className="absolute left-[-4px] top-3 bottom-3" 
        />
      )}

      {/* 2. Icono Principal */}
      <IconComponent 
        size={isRail ? 20 : 18} 
        className={`${contentClasses} shrink-0`} 
      />
      
      {/* 3. Etiqueta de Texto (Oculta en Rail) */}
      {!isRail && (
        <span className={`${contentClasses} text-sm truncate flex-1`}>
          {label}
        </span>
      )}

      {/* 4. Momentum Dot (Contexto Vivo - Solo en Expanded) */}
      {isActive && !isRail && (
        <div className="flex items-center justify-center shrink-0 w-4 h-4">
          <StatusPulse variant="energy" size="sm" />
        </div>
      )}

      {/* 5. Telemetría / Badges */}
      {telemetry && !isRail && !isActive && (
        <div className="bg-primary text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-sm">
          {telemetry.value}
        </div>
      )}

      {/* 6. Iconografía de Estado (Candado o Reloj) */}
      {!isRail && (
        <>
          {isDisabled && <LucideIcons.Lock size={12} className="text-text-muted" />}
          {isComingSoon && <LucideIcons.Clock size={12} className="text-text-muted opacity-60" />}
        </>
      )}
    </div>
  );

  // Si estamos en Rail, envolvemos en el Tooltip Técnico
  if (isRail && technicalTooltip) {
    return (
      <TechnicalTooltip content={technicalTooltip} side="right">
        {ItemContent}
      </TechnicalTooltip>
    );
  }

  return ItemContent;
};
