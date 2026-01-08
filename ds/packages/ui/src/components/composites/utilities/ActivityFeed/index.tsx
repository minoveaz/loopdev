'use client';

import React from 'react';
import { ActivityFeedProps } from './types';
import { ActivityItem } from './ActivityItem';

/**
 * @component ActivityFeed
 * @description Listado cronológico de eventos con línea de tiempo vertical continua.
 * Réplica exacta del chasis de colaboración del Laboratory v2.4.
 */
export const ActivityFeed: React.FC<ActivityFeedProps> = (props) => {
  const { items, title = 'Project History', onViewAll, className = '' } = props;

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Header oficial del Lab */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-tight opacity-80">
          {title}
        </h3>
        {onViewAll && (
          <button 
            onClick={onViewAll}
            className="text-xs text-primary font-bold hover:underline uppercase tracking-widest"
          >
            View All
          </button>
        )}
      </div>

      {/* Contenedor de la Línea de Tiempo */}
      <div className="relative">
        {/* LA LÍNEA: 1px de grosor, color industrial reactivo */}
        <div className="absolute left-[15.5px] top-2 bottom-2 w-px bg-slate-200 dark:bg-slate-700" />

        <div className="flex flex-col">
          {items.map((item, idx) => (
            <ActivityItem 
              key={item.id} 
              {...item} 
              isLast={idx === items.length - 1} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};
