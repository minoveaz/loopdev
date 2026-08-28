import React from 'react';
import { ActivityCard, type ActivityCardData } from '@loopdev/public-blocks';

export interface CimoFeedViewProps {
  activities: ActivityCardData[];
  selectedActivityId?: string;
  onSelectActivity: (id: string) => void;
  onJoinActivity: (id: string) => void;
}

export const CimoFeedView: React.FC<CimoFeedViewProps> = ({
  activities,
  selectedActivityId,
  onSelectActivity,
  onJoinActivity,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Planes de Hoy y Esta Semana</h1>
          <p className="text-xs text-slate-500 mt-0.5">Entrena en grupo y conecta con nuevos compañeros.</p>
        </div>
        <span className="text-xs font-bold text-[var(--lpd-brand-primary)] bg-[var(--lpd-brand-primary)]/10 px-2.5 py-1 rounded-full">
          {activities.length} planes
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {activities.map((activity) => (
          <ActivityCard
            key={activity.id}
            data={activity}
            isSelected={activity.id === selectedActivityId}
            onSelect={onSelectActivity}
            onJoin={onJoinActivity}
          />
        ))}
      </div>
    </div>
  );
};
