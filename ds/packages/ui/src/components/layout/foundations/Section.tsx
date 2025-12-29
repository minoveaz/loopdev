import React from 'react';
import { cn } from '../../../helpers/cn';

export interface SectionProps {
  children: React.ReactNode;
  spacing?: 'default' | 'compact' | 'roomy' | 'none';
  as?: 'section' | 'div' | 'main' | 'header' | 'footer';
  className?: string;
}

const spacingClasses = {
  none: '',
  compact: 'py-8 md:py-12',
  default: 'py-12 md:py-20',
  roomy: 'py-20 md:py-32',
};

export const Section: React.FC<SectionProps> = ({
  children,
  spacing = 'default',
  as: Component = 'section',
  className,
}) => {
  return (
    <Component className={cn(spacingClasses[spacing], className)}>
      {children}
    </Component>
  );
};
