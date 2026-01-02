import React from 'react';
import { cn } from '../../../helpers/cn';

export interface ErrorMessageProps {
  children: React.ReactNode;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ children, className }) => {
  return (
    <p className={cn("text-[11px] font-bold text-red-500 animate-in fade-in slide-in-from-top-1 duration-200", className)}>
      {children}
    </p>
  );
};
