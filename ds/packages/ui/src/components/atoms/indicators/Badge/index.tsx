import React from 'react';
import { useBadge } from './useBadge';
import { StatusDot } from './components';
import { Icon } from '../..';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'ghost' | 'solid' | 'outline' | 'glass';
  status?: 'neutral' | 'primary' | 'energy' | 'innovation' | 'success' | 'error';
  isLive?: boolean;
  isTechnical?: boolean;
  showDot?: boolean;
  icon?: string;
  className?: string;
}

/**
 * @component Badge
 * @description Indicador visual compacto para estados, contadores o etiquetas técnicas.
 * @category Primitives
 * @status beta
 */
export const Badge: React.FC<BadgeProps> = (props) => {
  const {
    finalClassName,
    children,
    showDot = true,
    status = 'neutral',
    isDotAnimated,
    icon
  } = useBadge(props);

  return (
    <span className={finalClassName}>
      {showDot && <StatusDot status={status} isAnimated={isDotAnimated} />}
      {icon && <Icon name={icon} size="sm" />}
      <span className="leading-none">{children}</span>
    </span>
  );
};