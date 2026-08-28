'use client';

import React from 'react';
import { clsx } from 'clsx';
import { Calendar, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { CrewAvatarGroup } from './CrewAvatarGroup';
import type { ActivityCardProps } from './types';

const levelBadgeStyles = {
  Principiante: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Intermedio: 'bg-blue-50 text-blue-700 border-blue-200',
  Avanzado: 'bg-purple-50 text-purple-700 border-purple-200',
  'Todos los niveles': 'bg-slate-50 text-slate-700 border-slate-200',
} as const;

export const ActivityCard: React.FC<ActivityCardProps> = ({
  data,
  onJoin,
  onSelect,
  isSelected = false,
  className,
}) => {
  const isFull = data.currentMembers.length >= data.maxMembers;
  const levelStyle = levelBadgeStyles[data.level] ?? levelBadgeStyles['Todos los niveles'];

  return (
    <article
      onClick={() => onSelect?.(data.id)}
      className={clsx(
        'group relative bg-white border rounded-2xl p-5 transition-all duration-200 cursor-pointer',
        'hover:shadow-md hover:border-slate-300',
        isSelected
          ? 'border-[var(--lpd-brand-primary)] ring-2 ring-[var(--lpd-brand-primary)]/20 shadow-md'
          : 'border-slate-200/90 shadow-sm',
        className,
      )}
    >
      {/* Header: Sport Tag + Level Badge */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--lpd-brand-primary)]">
          {data.sport}
        </span>
        <span className={clsx('px-2.5 py-0.5 text-xs font-semibold rounded-full border', levelStyle)}>
          {data.level}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-base font-bold text-slate-900 group-hover:text-[var(--lpd-brand-primary)] transition-colors line-clamp-1 mb-2">
        {data.title}
      </h3>

      {/* Details: Date, Time & Location */}
      <div className="flex flex-col gap-1.5 text-xs text-slate-600 mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span>{data.date}</span>
          <span className="text-slate-300">•</span>
          <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span>{data.time}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="line-clamp-1">{data.location}</span>
        </div>
      </div>

      {/* Footer: Crew Members & CTA Button */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
        <div className="flex items-center gap-2">
          <CrewAvatarGroup members={data.currentMembers} size="sm" />
          <span className="text-xs font-medium text-slate-500">
            {data.currentMembers.length}/{data.maxMembers}
          </span>
        </div>

        {data.isJoined ? (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-[var(--lpd-brand-primary)]">
            <CheckCircle2 className="w-4 h-4" />
            Unido
          </span>
        ) : (
          <button
            type="button"
            disabled={isFull}
            onClick={(e) => {
              e.stopPropagation();
              onJoin?.(data.id);
            }}
            className={clsx(
              'px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all shadow-sm min-h-[36px]',
              isFull
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-[var(--lpd-brand-primary)] hover:bg-[var(--lpd-brand-primary-hover)] text-white active:scale-95',
            )}
          >
            {isFull ? 'Lleno' : 'Unirme'}
          </button>
        )}
      </div>
    </article>
  );
};
