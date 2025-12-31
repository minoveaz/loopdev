import React from 'react';
import { Icon } from '../Icon';

interface ButtonContentProps {
  isLoading?: boolean;
  startIcon?: string;
  endIcon?: string;
  children?: React.ReactNode;
}

export const ButtonContent: React.FC<ButtonContentProps> = ({ 
  isLoading, 
  startIcon, 
  endIcon, 
  children 
}) => {
  // Loading tiene prioridad sobre startIcon
  const showStartIcon = !isLoading && startIcon;

  return (
    <>
      {isLoading && (
        <Icon 
          name="progress_activity" 
          size="md" 
          className="animate-spin mr-2"
        />
      )}
      
      {showStartIcon && (
        <Icon name={startIcon} size="md" className="mr-2" />
      )}
      
      <span>{children}</span>

      {endIcon && (
        <Icon name={endIcon} size="md" className="ml-2" />
      )}
    </>
  );
};
