'use client';

import React from 'react';
import { cn } from '../../../../helpers/cn';
import { LpdText } from '../../../atoms/foundations/Typography';
import { SystemNoticeRailProps } from './index';
import { useSystemNoticeRail } from './useSystemNoticeRail';

/**
 * @component SystemNoticeRail
 * @description Consola de gobernanza. Fix: Hover unificado para botones secundarios.
 */
export const SystemNoticeRail: React.FC<SystemNoticeRailProps> = (props) => {
  const { onViewAll, className = '' } = props;
  const { topNotice, hasMultiple, handleDismiss, activeNotices } = useSystemNoticeRail(props);

  if (!topNotice) return null;

  const isWarning = topNotice.severity === 'warning';
  const isDanger = topNotice.severity === 'danger';

  const containerStyles = cn(
    "flex items-center justify-between gap-4 px-4 h-10 rounded-xl border transition-all duration-300",
    "bg-slate-200/60 shadow-inner border-slate-300/40",
    "dark:bg-white/5 dark:shadow-none dark:border-white/5",
    isWarning && "border-energy-yellow/60 dark:border-energy-yellow/30",
    isDanger && "border-danger/60 dark:border-danger/30"
  );

  // Clases unificadas para botones de texto (Secondary y More)
  const textButtonClasses = "text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded transition-all hover:bg-primary hover:text-white dark:hover:text-white text-slate-500 dark:text-white/60";

  return (
    <div className={cn("w-full px-8 py-1 bg-transparent shrink-0", className)}>
      <div className={containerStyles}>
        
        {/* IZQUIERDA: Identidad */}
        <div className="flex items-center gap-3 overflow-hidden">
          <div className={cn(
            "w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-colors duration-500",
            isWarning ? "bg-energy-yellow text-slate-900" : 
            isDanger ? "bg-danger text-white" : "bg-primary/10 text-primary"
          )}>
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'wght' 500" }}>
              {topNotice.icon || (isDanger ? 'report' : isWarning ? 'warning' : 'info')}
            </span>
          </div>
          <div className="flex items-center gap-2 overflow-hidden">
            <LpdText size="xs" weight="bold" className="text-slate-900 dark:text-white truncate">
              {topNotice.title}
            </LpdText>
            {topNotice.description && (
              <LpdText size="nano" className="text-slate-500 dark:text-slate-400 truncate font-mono italic hidden md:block opacity-80">
                | {topNotice.description}
              </LpdText>
            )}
          </div>
        </div>

        {/* DERECHA: Cluster de Control */}
        <div className="flex items-center gap-2 shrink-0 h-full">
          
          {topNotice.secondaryAction && (
            <button 
              onClick={topNotice.secondaryAction.onClick}
              className={textButtonClasses}
            >
              {topNotice.secondaryAction.label}
            </button>
          )}

          {/* Acción Principal */}
          <button 
            onClick={topNotice.primaryAction.onClick}
            className={cn(
              "h-7 px-3 rounded-lg border text-[9px] font-black uppercase tracking-widest transition-all",
              isWarning 
                ? "bg-energy-yellow/20 border-energy-yellow/80 text-slate-900 hover:bg-energy-yellow hover:text-black dark:text-energy-yellow dark:hover:text-black dark:bg-energy-yellow/10 dark:border-energy-yellow/40" 
                : isDanger 
                ? "bg-danger/10 border-danger/60 text-danger hover:bg-danger hover:text-white dark:border-danger/40"
                : "bg-primary/10 border-primary/60 text-primary hover:bg-primary hover:text-white dark:border-primary/40"
            )}
          >
            {topNotice.primaryAction.label}
          </button>

          {(hasMultiple || topNotice.dismissible) && <div className="h-4 w-px bg-slate-300 dark:bg-white/10 mx-1" />}

          {/* Contador */}
          {hasMultiple && (
            <button 
              onClick={onViewAll}
              className={textButtonClasses}
            >
              {`+${activeNotices.length - 1} More`}
            </button>
          )}

          {/* Cierre */}
          {topNotice.dismissible && (
            <button 
              onClick={() => handleDismiss(topNotice.id)}
              className="text-slate-400 dark:text-slate-500 hover:text-danger transition-colors p-1"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
