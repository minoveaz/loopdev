'use client';

import React from 'react';
import { User } from 'lucide-react';
import { StatusPulse } from '../..';
import { UserAvatarProps } from './types';
import { useUserAvatar } from './useUserAvatar';

/**
 * @component UserAvatar
 * @description Átomo oficial de identidad de usuario. 
 * Gestiona la visualización de imágenes, iniciales y estados de presencia.
 * @category Foundations
 * @phase 1
 */
export const UserAvatar: React.FC<UserAvatarProps> = (props) => {
  const { src, withStatus = false, status = 'online' } = props;
  const { 
    showImage, 
    showInitials, 
    showIcon, 
    initials, 
    containerClasses, 
    textClasses, 
    iconSize,
    statusPos 
  } = useUserAvatar(props);

  return (
    <div className={containerClasses}>
      {/* 1. Imagen de Perfil */}
      {showImage && (
        <img 
          src={src!} 
          alt={initials} 
          className="w-full h-full object-cover rounded-full" 
        />
      )}

      {/* 2. Iniciales (Fallback 1) */}
      {showInitials && (
        <span className={textClasses}>{initials}</span>
      )}

      {/* 3. Icono Genérico (Fallback 2) */}
      {showIcon && (
        <User size={iconSize} className="text-white/80" />
      )}

      {/* 4. Indicador de Presencia (StatusPulse integrado) */}
      {withStatus && (
        <div className={`absolute ${statusPos} translate-x-1/4 translate-y-1/4 z-10 border-2 border-white dark:border-background-dark rounded-full`}>
          <StatusPulse 
            variant={status === 'online' ? 'success' : status === 'busy' ? 'danger' : 'energy'} 
            size="sm" 
          />
        </div>
      )}
    </div>
  );
};
