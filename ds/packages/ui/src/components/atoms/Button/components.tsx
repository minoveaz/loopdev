import React from 'react';
import { Icon } from '../Icon';

interface ButtonContentProps {
  isLoading?: boolean;
  icon?: string;
  children?: React.ReactNode;
}

export const ButtonContent: React.FC<ButtonContentProps> = ({ isLoading, icon, children }) => (
  <>
    {isLoading && (
      <Icon 
        name="progress_activity" 
        size="md" 
        className="animate-spin mr-2"
      />
    )}
    {icon && !isLoading && (
      <Icon name={icon} size="md" className="mr-2" />
    )}
    <span>{children}</span>
  </>
);