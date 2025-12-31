import React from 'react';
import { Skeleton } from './index';
import { Icon } from '../Icon';
import { TextSkeletonProps } from './types';

/**
 * @preset TextSkeleton
 * @description Genera líneas de texto con anchos aleatorios para simular párrafos.
 */
export const TextSkeleton: React.FC<TextSkeletonProps> = ({ 
  lines = 3, 
  gap = '8px', 
  ...baseProps 
}) => {
  return (
    <div className="flex flex-col w-full" style={{ gap }}>
      {Array.from({ length: lines }).map((_, i) => {
        const isLast = i === lines - 1;
        const width = isLast ? '65%' : '100%';
        return (
          <Skeleton 
            key={i}
            variant="text" 
            height="1em"
            width={width}
            {...baseProps}
          />
        );
      })}
    </div>
  );
};

/**
 * @preset MediaSkeleton
 * @description Avatar + Texto (Título y Subtítulo)
 */
export const MediaSkeleton: React.FC = () => (
  <div className="flex items-center gap-4 w-full">
    <Skeleton variant="circle" width={48} height={48} />
    <div className="flex-1 space-y-2">
      <Skeleton variant="text" width="40%" height={14} />
      <Skeleton variant="text" width="70%" height={10} />
    </div>
  </div>
);

/**
 * @preset CardSkeleton
 * @description Layout de tarjeta para grids o dashboards.
 */
export const CardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-6 space-y-6 w-full">
    <Skeleton variant="rect" width="100%" height={160} radius="lg" />
    <div className="space-y-3">
      <Skeleton variant="text" width="60%" height={24} />
      <TextSkeleton lines={2} />
    </div>
    <div className="flex justify-between items-center">
      <Skeleton variant="button" width={100} height={36} />
      <Skeleton variant="circle" width={24} height={24} />
    </div>
  </div>
);

/**
 * @preset TableSkeleton
 * @description Estructura de fila de datos.
 */
export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="w-full space-y-4">
    {/* Header */}
    <div className="flex gap-4 border-b border-slate-200 dark:border-white/5 pb-4">
      {['20%', '40%', '20%', '20%'].map((w, i) => (
        <Skeleton key={i} variant="rect" width={w} height={16} />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4 py-2">
        <Skeleton variant="rect" width="20%" height={12} />
        <Skeleton variant="rect" width="40%" height={12} />
        <Skeleton variant="rect" width="20%" height={12} />
        <Skeleton variant="rect" width="20%" height={12} />
      </div>
    ))}
  </div>
);

/**
 * @preset KanbanSkeleton
 * @description El alma del CRM: Columnas con tarjetas.
 */
export const KanbanSkeleton: React.FC = () => (
  <div className="flex gap-6 w-full overflow-hidden">
    {[1, 2, 3].map((col) => (
      <div key={col} className="w-80 shrink-0 space-y-4">
        <Skeleton variant="rect" width="40%" height={20} className="mb-6" />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    ))}
  </div>
);

/**
 * @preset TimelineSkeleton
 * @description Registro de actividad técnica.
 */
export const TimelineSkeleton: React.FC = () => (
  <div className="space-y-8 pl-4 border-l-2 border-slate-100 dark:border-white/5">
    {[1, 2, 3].map((i) => (
      <div key={i} className="relative">
        <div className="absolute -left-[21px] top-1 w-4 h-4 bg-slate-200 dark:bg-white/10 rounded-full border-4 border-white dark:border-[#0F1115]" />
        <div className="space-y-2">
          <Skeleton variant="text" width={120} height={14} />
          <Skeleton variant="text" width="100%" height={10} />
        </div>
      </div>
    ))}
  </div>
);

/**
 * @preset WidgetSkeleton
 * @description Métrica gigante de Dashboard.
 */
export const WidgetSkeleton: React.FC = () => (
  <div className="p-6 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl space-y-4">
    <Skeleton variant="text" width="30%" height={12} />
    <Skeleton variant="rect" width="60%" height={48} />
    <Skeleton variant="text" width="40%" height={10} />
  </div>
);

/**
 * @preset ChatFeedSkeleton
 * @description Flujo de conversación.
 */
export const ChatFeedSkeleton: React.FC = () => (
  <div className="space-y-6 w-full">
    <div className="flex justify-start">
      <div className="bg-slate-100 dark:bg-white/5 p-4 rounded-2xl rounded-tl-none w-2/3">
        <TextSkeleton lines={2} />
      </div>
    </div>
    <div className="flex justify-end">
      <div className="bg-primary/5 p-4 rounded-2xl rounded-tr-none w-1/2 border border-primary/10">
        <TextSkeleton lines={1} />
      </div>
    </div>
  </div>
);

/**
 * @preset GenerativePreviewSkeleton
 * @description La firma de IA: Brillo morado neuronal. Permite icono personalizado.
 */
export const GenerativePreviewSkeleton: React.FC<{ icon?: string }> = ({ icon = 'auto_awesome' }) => (
  <div className="relative w-full h-64 bg-innovation-soft-purple rounded-[2.5rem] border border-innovation-purple/20 overflow-hidden flex flex-col items-center justify-center gap-4">
    <div className="absolute inset-0 opacity-[0.1]" 
         style={{ backgroundImage: 'radial-gradient(var(--lpd-color-innovation-purple) 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
    />
    <div className="w-16 h-16 rounded-full bg-innovation-purple/10 flex items-center justify-center animate-pulse">
       <Icon name={icon} size="xl" className="text-innovation-purple/40" />
    </div>
    <Skeleton variant="text" width={140} height={12} className="bg-innovation-purple/20" />
  </div>
);
