import React from 'react';
import { clsx } from 'clsx';
import { Filter, Search } from 'lucide-react';
import { CIMO_LEVELS_CATALOG, CIMO_SPORTS_CATALOG } from '../data/spanishCitiesCatalog';

export interface CimoSportFiltersProps {
  selectedSport: string;
  onSelectSport: (sport: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedLevel: string;
  onSelectLevel: (lvl: string) => void;
  selectedDay?: string;
  onSelectDay?: (day: string) => void;
}

const sportsList = [
  { id: 'Todos', label: 'Todas', emoji: '⭐' },
  ...CIMO_SPORTS_CATALOG.map((s) => ({ id: s.id, label: s.label, emoji: s.emoji })),
];

const daysList = ['Todos', 'Hoy', 'Mañana', 'Sábado', 'Domingo'];
const levelsList = ['Todos', ...CIMO_LEVELS_CATALOG.filter((l) => l.id !== 'Cualquier nivel').map((l) => l.id)];

export const CimoSportFilters: React.FC<CimoSportFiltersProps> = ({
  selectedSport,
  onSelectSport,
  searchQuery,
  onSearchChange,
  selectedLevel,
  onSelectLevel,
  selectedDay = 'Todos',
  onSelectDay,
}) => {
  return (
    <aside
      aria-label="Filtros de actividades"
      className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-5 shadow-xs flex flex-col gap-5 sticky top-20 text-[#1F4E5F]"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#1F4E5F]/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#7FB77E]/15 flex items-center justify-center text-[#1F4E5F]">
            <Filter className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]">
            Filtros de Activities
          </span>
        </div>
      </div>

      {/* Search Input */}
      <div>
        <label htmlFor="cimo-search-input" className="text-[11px] font-extrabold text-[#1F4E5F]/70 uppercase tracking-wider block mb-1.5">
          Buscar por zona o club
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-[#1F4E5F]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="cimo-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Retiro, Chamartín, Chamberí..."
            className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#F7F7F7] border border-[#1F4E5F]/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00B894] focus:bg-white transition-all min-h-[40px] text-[#1F4E5F]"
          />
        </div>
      </div>

      {/* Sports Categories */}
      <div>
        <span className="text-[11px] font-extrabold text-[#1F4E5F]/70 uppercase tracking-wider block mb-2">
          Deportes
        </span>
        <div className="flex flex-col gap-1.5">
          {sportsList.map((sport) => {
            const isSelected = selectedSport.toLowerCase() === sport.id.toLowerCase();
            return (
              <button
                key={sport.id}
                type="button"
                onClick={() => onSelectSport(sport.id)}
                className={clsx(
                  'w-full text-left px-3.5 py-2 rounded-2xl text-xs font-extrabold transition-all flex items-center justify-between min-h-[38px] cursor-pointer',
                  isSelected
                    ? 'bg-[#1F4E5F] text-white shadow-xs'
                    : 'bg-[#F7F7F7] border border-[#1F4E5F]/5 text-[#1F4E5F]/80 hover:bg-[#1F4E5F]/5',
                )}
              >
                <div className="flex items-center gap-2">
                  <span>{sport.emoji}</span>
                  <span>{sport.label}</span>
                </div>
                {isSelected && <span className="w-2 h-2 rounded-full bg-[#00B894]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Day Filter */}
      <div>
        <span className="text-[11px] font-extrabold text-[#1F4E5F]/70 uppercase tracking-wider block mb-2">
          Día de entrenamiento
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          {daysList.map((day) => {
            const isSelected = selectedDay === day;
            return (
              <button
                key={day}
                type="button"
                onClick={() => onSelectDay?.(day)}
                className={clsx(
                  'py-2 px-2.5 rounded-xl text-xs font-bold transition-all text-center min-h-[34px] cursor-pointer',
                  isSelected
                    ? 'bg-[#1F4E5F] text-white shadow-xs'
                    : 'bg-[#F7F7F7] border border-[#1F4E5F]/10 text-[#1F4E5F]/70 hover:bg-[#1F4E5F]/5',
                )}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Level Filters */}
      <div>
        <span className="text-[11px] font-extrabold text-[#1F4E5F]/70 uppercase tracking-wider block mb-2">
          Nivel requerido
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          {levelsList.map((lvl) => {
            const isSelected = selectedLevel === lvl;
            return (
              <button
                key={lvl}
                type="button"
                onClick={() => onSelectLevel(lvl)}
                className={clsx(
                  'py-2 px-2 rounded-xl text-xs font-bold transition-all text-center min-h-[34px] cursor-pointer truncate',
                  isSelected
                    ? 'bg-[#1F4E5F] text-white shadow-xs'
                    : 'bg-[#F7F7F7] border border-[#1F4E5F]/10 text-[#1F4E5F]/70 hover:bg-[#1F4E5F]/5',
                )}
              >
                {lvl}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
