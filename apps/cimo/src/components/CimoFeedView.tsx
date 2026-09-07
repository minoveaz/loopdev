import React from 'react';
import { ActivityCard, type ActivityCardData } from '@loopdev/public-blocks';

export interface CimoFeedViewProps {
  activities: ActivityCardData[];
  selectedActivityId?: string;
  onSelectActivity: (id: string) => void;
  onJoinActivity: (id: string) => void;
  selectedSport: string;
  onSelectSport: (sport: string) => void;
}

const quickSports = [
  { id: 'Todos', label: 'Todas', emoji: '' },
  { id: 'running', label: 'Running', emoji: '🏃' },
  { id: 'padel', label: 'Pádel', emoji: '🎾' },
  { id: 'hiking', label: 'Hiking', emoji: '🥾' },
  { id: 'crossfit', label: 'Crossfit', emoji: '🏋️' },
];

export const CimoFeedView: React.FC<CimoFeedViewProps> = ({
  activities,
  selectedActivityId,
  onSelectActivity,
  onJoinActivity,
  selectedSport,
  onSelectSport,
}) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Banner Philosophy */}
      <div className="shadow-2xs flex items-center gap-3.5 rounded-3xl border border-[#1F4E5F]/10 bg-white p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#7FB77E]/20 text-lg font-bold text-[#1F4E5F]">
          💡
        </div>
        <div className="text-xs">
          <span className="block text-sm font-extrabold text-[#1F4E5F]">
            Match con entrenos, no con personas
          </span>
          <span className="text-xs text-[#1F4E5F]/70">
            Únete a un Crew y conoce gente practicando deporte real en Madrid.
          </span>
        </div>
      </div>

      {/* Quick Sport Selector Bar */}
      <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1">
        {quickSports.map((sport) => {
          const isSelected = selectedSport.toLowerCase() === sport.id.toLowerCase();
          return (
            <button
              key={sport.id}
              type="button"
              onClick={() => onSelectSport(sport.id)}
              className={`flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-xs font-extrabold transition-all ${
                isSelected
                  ? 'shadow-xs bg-[#1F4E5F] text-white'
                  : 'border border-[#1F4E5F]/15 bg-white text-[#1F4E5F]/70 hover:bg-white'
              }`}
            >
              {sport.emoji && <span>{sport.emoji}</span>}
              <span>{sport.label}</span>
            </button>
          );
        })}
      </div>

      {/* Activity Cards List */}
      <div className="flex flex-col gap-4">
        {activities.length === 0 ? (
          <div className="rounded-3xl border border-[#1F4E5F]/10 bg-white p-12 text-center text-xs text-slate-400">
            No se encontraron planes para los filtros seleccionados.
          </div>
        ) : (
          activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              data={activity}
              isSelected={activity.id === selectedActivityId}
              onSelect={onSelectActivity}
              onJoin={onJoinActivity}
            />
          ))
        )}
      </div>
    </div>
  );
};
