import React from 'react';
import { Icon } from '../Icon';

interface IconButtonContentProps {
  icon: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  ariaLabel?: string;
  color?: string;
}

export const IconButtonContent: React.FC<IconButtonContentProps> = ({ 
  icon, 
  size, 
  isLoading, 
  ariaLabel,
  color = 'currentColor'
}) => (
  <>
    {isLoading ? (
      <Icon 
        name="progress_activity" 
        size={size} 
        className="animate-spin" 
        color={color}
      />
    ) : (
      <Icon 
        name={icon} 
        size={size} 
        color={color}
      />
    )}
  </>
);