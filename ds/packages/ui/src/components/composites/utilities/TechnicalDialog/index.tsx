'use client';

import React from 'react';
import { TechnicalDialogProps } from './types';
import { TechnicalSurface, Heading, LpdText, IconButton, Divider } from '../../../atoms';
import { cn } from '../../../../helpers/cn';

/**
 * @component TechnicalDialog
 * @description Standardized industrial modal for confirmations and alerts.
 * Features variant-based styling (Danger/Warning) and consistent layout.
 */
export const TechnicalDialog: React.FC<TechnicalDialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  actions,
  variant = 'default',
  size = 'md',
  className
}) => {
  
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw]'
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          border: 'border-rose-500/30',
          icon: 'error',
          iconColor: 'text-rose-500',
          iconBg: 'bg-rose-500/10 border-rose-500/20'
        };
      case 'warning':
        return {
          border: 'border-amber-500/30',
          icon: 'warning',
          iconColor: 'text-amber-500',
          iconBg: 'bg-amber-500/10 border-amber-500/20'
        };
      case 'success':
        return {
          border: 'border-emerald-500/30',
          icon: 'check_circle',
          iconColor: 'text-emerald-500',
          iconBg: 'bg-emerald-500/10 border-emerald-500/20'
        };
      default:
        return {
          border: 'border-border-technical',
          icon: 'info',
          iconColor: 'text-primary',
          iconBg: 'bg-primary/10 border-primary/20'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Dialog Container */}
      <TechnicalSurface 
        variant="surface" 
        depth="overlay" 
        className={cn(
          "relative z-10 w-full flex flex-col shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden",
          sizeClasses[size],
          styles.border,
          className
        )}
      >
        {/* Header */}
        <header className="p-6 border-b border-border-technical/30 flex items-start justify-between bg-background-subtle/30 shrink-0">
          <div className="flex items-center gap-4">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border shrink-0", styles.iconBg)}>
              <span className={cn("material-symbols-outlined text-xl font-bold", styles.iconColor)}>
                {styles.icon}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <Heading size="xs" weight="bold" className="uppercase tracking-tight leading-none">
                {title}
              </Heading>
              {description && (
                <LpdText size="xs" className="text-text-muted leading-tight">
                  {description}
                </LpdText>
              )}
            </div>
          </div>
          <IconButton icon="close" size="sm" onClick={onClose} className="shrink-0 -mr-2 -mt-2" />
        </header>

        {/* Content */}
        {children && (
          <div className="p-6 overflow-y-auto custom-scrollbar max-h-[60vh]">
            {children}
          </div>
        )}

        {/* Actions */}
        {actions && (
          <footer className="p-6 border-t border-border-technical/30 flex items-center justify-end gap-3 bg-background-subtle/10 shrink-0">
            {actions}
          </footer>
        )}
      </TechnicalSurface>
    </div>
  );
};
