'use client';

import React, { useRef } from 'react';
import { useToastItem } from './useToastItem';
import { ToastProps } from './types';
import { Icon } from '../Icon';
import { LogoSpinner } from '../LogoSpinner';
import { Button } from '../Button';
import { Text } from '../Typography';
import { toast } from './toastStore';

/**
 * @component ToastItem
 * @description Notificación industrial sincronizada con la estética validada del laboratorio.
 */
export const ToastItem: React.FC<ToastProps> = (props) => {
  const { title, description, variant = 'info', action, metadata, id, className = '' } = props;
  const { visualConfig, handleMouseEnter, handleMouseLeave } = useToastItem(props);

  const isWarning = variant === 'warning';
  const isAI = variant === 'loading';

  // Sincronización de clases con el laboratorio (mockv2)
  const iconBgClasses = isWarning ? 'bg-slate-950/10' : (visualConfig.iconBg || '');
  const titleColorClass = visualConfig.titleColor || '';
  const accentColorClass = visualConfig.accentColor || '';

  return (
    <div 
      id={id}
      role={variant === 'error' || variant === 'warning' ? 'alert' : 'status'}
      className={`
        relative overflow-hidden w-full max-w-[420px] pointer-events-auto
        ${isWarning ? 'bg-accent' : 'bg-white/95 dark:bg-[#161e2e]/90 backdrop-blur-xl'}
        border-l-4 ${visualConfig.borderColor} 
        border-y border-r ${isWarning ? 'border-y-slate-900/10 border-r-slate-900/10' : 'border-y-slate-200/50 border-r-slate-200/50 dark:border-y-white/10 dark:border-r-white/10'}
        rounded-xl shadow-2xl flex gap-4 p-4 group animate-in slide-in-from-right-full duration-300
        ${className}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 1. Dynamic Grid Texture - Sincronización Lab */}
      {visualConfig.gridType === 'blueprint' ? (
        <div className={`absolute inset-0 ${isWarning ? 'opacity-[0.1]' : 'opacity-[0.04] dark:opacity-[0.08]'} pointer-events-none`} 
             style={{ backgroundImage: `linear-gradient(var(--lpd-color-brand-primary) 1px, transparent 1px), linear-gradient(to bottom, var(--lpd-color-brand-primary) 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
      ) : (
        <div className="absolute inset-0 opacity-[0.12] dark:opacity-[0.08] pointer-events-none" 
             style={{ backgroundImage: `radial-gradient(var(--lpd-color-innovation-purple) 0.8px, transparent 0.8px)`, backgroundSize: '16px 16px' }} />
      )}

      {/* 2. Boxed Icon Section */}
      <div className="relative z-10 shrink-0">
        {isAI ? (
          <div className="w-12 h-12 flex items-center justify-center bg-innovation-soft-purple rounded-xl border border-innovation-purple/20 shadow-inner">
            <LogoSpinner size={32} />
          </div>
        ) : (
          <div className={`w-10 h-10 flex items-center justify-center ${iconBgClasses} rounded-lg border border-current/10`}>
            <Icon 
              name={visualConfig.iconName} 
              size="md" 
              className={isWarning ? 'text-slate-900' : visualConfig.borderColor.replace('border-l-', 'text-')}
            />
          </div>
        )}
      </div>

      {/* 3. Narrative Section */}
      <div className="relative z-10 flex-1 min-w-0 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <Text weight="black" size="sm" className={`truncate leading-tight ${titleColorClass}`}>
            {title}
          </Text>
          {/* Metadata Brackets */}
          {metadata && (
            <span className={`font-mono text-[10px] font-bold shrink-0 ${accentColorClass} flex items-center gap-1 px-1.5 py-0.5 rounded border ${visualConfig.metaBg}`}>
              <span className="text-xs font-black opacity-80">{"{"}</span> 
              <span className="tracking-widest uppercase">{metadata}</span> 
              <span className="text-xs font-black opacity-80">{"}"}</span>
            </span>
          )}
        </div>
        
        {description && (
          <Text size="xs" variant="muted" className={`leading-relaxed line-clamp-2 ${isWarning ? 'text-slate-800' : 'dark:text-slate-400'}`}>
            {description}
          </Text>
        )}

        {/* 4. Action Section */}
        {action && (
          <div className="pt-3">
            <Button 
              variant={visualConfig.buttonVariant} 
              size="sm" 
              onClick={action.onClick}
              className={`h-8 font-black uppercase text-[9px] tracking-widest ${isWarning ? 'bg-slate-950 text-white hover:bg-slate-900 border-none' : ''}`}
            >
              {action.label}
            </Button>
          </div>
        )}
      </div>

      {/* 5. Close Control */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          toast.dismiss(id);
        }} 
        className={`relative z-20 shrink-0 h-fit p-1 ${isWarning ? 'text-slate-800 hover:text-slate-950' : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'} transition-colors`}
        aria-label="Dismiss notification"
      >
        <Icon name="close" size="sm" />
      </button>
    </div>
  );
};
