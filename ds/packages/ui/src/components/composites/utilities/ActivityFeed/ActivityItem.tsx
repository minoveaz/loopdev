'use client';

import React from 'react';
import { Icon } from '../../../atoms';
import { ActivityItemProps } from './types';

/**
 * @component ActivityItem
 * @description Molécula de evento con hover aislado mediante Named Groups.
 */
export const ActivityItem: React.FC<ActivityItemProps> = (props) => {
  const { 
    icon, 
    action, 
    module, 
    timestamp, 
    description, 
    href, 
    tone = 'neutral', 
    isLast 
  } = props;

  const toneClasses = {
    primary: 'bg-blue-50 dark:bg-blue-900/20 text-primary border-blue-100 dark:border-blue-900/30',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-500 border-yellow-100 dark:border-yellow-900/30',
    success: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-500 border-green-100 dark:border-green-900/30',
    neutral: 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700',
  };

  return (
    <div className={`relative pl-12 ${isLast ? '' : 'pb-8'} group/item`}>
      
      {/* 1. NODO FLOTANTE */}
      <div className="absolute left-0 top-0 p-1 bg-surface-elevated z-10 rounded-full">
        <div className={`
          w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 group-hover/item:scale-110 shadow-sm
          ${toneClasses[tone]}
        `}>
          <Icon name={icon} size="sm" className="block" />
        </div>
      </div>

      {/* 2. CONTENIDO */}
      <div className="flex flex-col">
        <div className="flex justify-between items-start">
          <span 
            className="text-sm font-medium text-slate-900 dark:text-white group-hover/item:text-primary transition-colors cursor-pointer leading-tight"
            onClick={() => href && (window.location.href = href)}
          >
            {action}
          </span>
          <span className="text-xs text-slate-400 font-sans opacity-60">
            {timestamp}
          </span>
        </div>

        <p className="text-xs text-slate-500 mt-1 leading-relaxed dark:text-slate-400">
          {description ? (
            <>
              {description} <span className="text-slate-700 dark:text-slate-300 font-medium">{module}</span>.
            </>
          ) : (
            <>Action performed in <span className="text-slate-700 dark:text-slate-300 font-medium">{module}</span>.</>
          )}
        </p>
      </div>
    </div>
  );
};
