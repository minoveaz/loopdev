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
      <div className="p-4 bg-white border border-[#1F4E5F]/10 rounded-3xl flex items-center gap-3.5 shadow-2xs">
        <div className="w-10 h-10 rounded-2xl bg-[#7FB77E]/20 text-[#1F4E5F] flex items-center justify-center shrink-0 font-bold text-lg">
          💡
        </div>
        <div className="text-xs">
          <span className="font-extrabold text-[#1F4E5F] block text-sm">
            Match con entrenos, no con personas
          </span>
          <span className="text-[#1F4E5F]/70 text-xs">
            Únete a un Crew y conoce gente practicando deporte real en Madrid.
          </span>
        </div>
      </div>

      {/* Quick Sport Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {quickSports.map((sport) => {
          const isSelected = selectedSport.toLowerCase() === sport.id.toLowerCase();
          return (
            <button
              key={sport.id}
              type="button"
              onClick={() => onSelectSport(sport.id)}
              className={`px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#1F4E5F] text-white shadow-xs'
                  : 'bg-white border border-[#1F4E5F]/15 text-[#1F4E5F]/70 hover:bg-white'
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
          <div className="p-12 text-center bg-white rounded-3xl border border-[#1F4E5F]/10 text-slate-400 text-xs">
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
