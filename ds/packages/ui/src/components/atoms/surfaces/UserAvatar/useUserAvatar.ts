import { UserAvatarProps, UserAvatarSize } from './types';

/**
 * @hook useUserAvatar
 * @description Lógica para la jerarquía de visualización y composición de estilos.
 */
export const useUserAvatar = (props: UserAvatarProps) => {
  const { 
    src, 
    name, 
    initials: explicitInitials, 
    size = 'md', 
    className = '' 
  } = props;

  // 1. Algoritmo de extracción de iniciales
  const getInitials = (userName?: string): string => {
    if (explicitInitials) return explicitInitials.substring(0, 2).toUpperCase();
    if (!userName) return '';
    
    const parts = userName.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const calculatedInitials = getInitials(name);

  // 2. Mapeo de Tamaños Industriales
  const sizeMap: Record<UserAvatarSize, { container: string; text: string; icon: number; status: string }> = {
    xs: { container: 'w-6 h-6', text: 'text-[8px]', icon: 12, status: 'bottom-0 right-0' },
    sm: { container: 'w-8 h-8', text: 'text-[10px]', icon: 14, status: 'bottom-0 right-0' },
    md: { container: 'w-10 h-10', text: 'text-xs', icon: 18, status: 'bottom-0 right-0' },
    lg: { container: 'w-12 h-12', text: 'text-sm', icon: 22, status: 'bottom-0 right-0' },
    xl: { container: 'w-16 h-16', text: 'text-lg', icon: 28, status: 'bottom-0 right-0' },
  };

  const currentSize = sizeMap[size];

  // 3. Composición de Clases (Bloque 0: Surface Soul)
  const containerClasses = `
    relative flex items-center justify-center rounded-full overflow-visible shrink-0
    bg-gradient-to-br from-primary to-accent-purple shadow-inner
    border border-black/5 dark:border-white/10
    ${currentSize.container}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  const textClasses = `
    font-black tracking-tighter text-white select-none
    ${currentSize.text}
  `.replace(/\s+/g, ' ').trim();

  return {
    showImage: !!src,
    showInitials: !src && !!calculatedInitials,
    showIcon: !src && !calculatedInitials,
    initials: calculatedInitials,
    containerClasses,
    textClasses,
    iconSize: currentSize.icon,
    statusPos: currentSize.status
  };
};
