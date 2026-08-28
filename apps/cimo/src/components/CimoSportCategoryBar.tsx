import React from 'react';
import { clsx } from 'clsx';

export interface CimoSportCategoryBarProps {
  selectedSport: string;
  onSelectSport: (sport: string) => void;
  className?: string;
}

const categories = [
  { id: 'Todos', label: 'Todos', emoji: '✨' },
  { id: 'running', label: 'Running', emoji: '🏃' },
  { id: 'padel', label: 'Pádel', emoji: '🎾' },
  { id: 'hiking', label: 'Hiking', emoji: '🥾' },
  { id: 'crossfit', label: 'Crossfit', emoji: '🏋️' },
  { id: 'cycling', label: 'Ciclismo', emoji: '🚴' },
];

export const CimoSportCategoryBar: React.FC<CimoSportCategoryBarProps> = ({
  selectedSport,
  onSelectSport,
  className,
}) => {
  return (
    <div className={clsx('flex items-center gap-3 overflow-x-auto no-scrollbar py-2', className)}>
      {categories.map((cat) => {
        const isSelected = selectedSport.toLowerCase() === cat.id.toLowerCase();
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectSport(cat.id)}
            className={clsx(
              'flex flex-col items-center gap-1.5 pb-2 border-b-2 transition-all cursor-pointer whitespace-nowrap min-w-[64px] shrink-0',
              isSelected
                ? 'border-[#1F4E5F] text-[#1F4E5F] font-black'
                : 'border-transparent text-[#1F4E5F]/60 hover:text-[#1F4E5F] hover:border-[#1F4E5F]/30 font-bold',
            )}
          >
            <span className="text-xl">{cat.emoji}</span>
            <span className="text-[11px]">{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
};
