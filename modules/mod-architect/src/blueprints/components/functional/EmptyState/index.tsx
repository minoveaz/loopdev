import React from 'react';
import { EmptyStateContainer, EmptyStateIcon, EmptyStateContent } from './components';

export interface EmptyStateProps {
  icon?: string;
  title: string;
  description: React.ReactNode;
  action?: React.ReactNode;
  iconBadge?: string; // e.g. "?" or "!"
  className?: string;
  size?: 'sm' | 'md';
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon = 'search_off', 
  title, 
  description, 
  action, 
  iconBadge,
  className = '',
  size = 'md'
}) => {
  return (
    <EmptyStateContainer className={className} size={size}>
      <EmptyStateIcon icon={icon} badge={iconBadge} size={size} />
      <EmptyStateContent title={title} description={description} size={size} />
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </EmptyStateContainer>
  );
};