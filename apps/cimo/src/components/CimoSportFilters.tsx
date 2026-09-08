import React from 'react';
import { clsx } from 'clsx';
import { Filter, Search } from 'lucide-react';
import { CIMO_LEVELS_CATALOG, CIMO_SPORTS_CATALOG } from '../data/sportsCatalog';

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
const levelsList = [
  'Todos',
  ...CIMO_LEVELS_CATALOG.filter((l) => l.id !== 'Cualquier nivel').map((l) => l.id),
];

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
      className="shadow-xs sticky top-20 flex flex-col gap-5 rounded-3xl border border-[#1F4E5F]/10 bg-white p-5 text-[#1F4E5F]"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1F4E5F]/10 pb-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#7FB77E]/15 text-[#1F4E5F]">
            <Filter className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]">
            Filtros de Activities
          </span>
        </div>
      </div>

      {/* Search Input */}
      <div>
        <label
          htmlFor="cimo-search-input"
          className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-[#1F4E5F]/70"
        >
          Buscar por zona o club
        </label>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1F4E5F]/40" />
          <input
            id="cimo-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Retiro, Chamartín, Chamberí..."
            className="min-h-[40px] w-full rounded-2xl border border-[#1F4E5F]/10 bg-[#F7F7F7] py-2.5 pl-10 pr-3.5 text-xs text-[#1F4E5F] transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7FB77E]"
          />
        </div>
      </div>

      {/* Sports Categories */}
      <div>
        <span className="mb-2 block text-[11px] font-extrabold uppercase tracking-wider text-[#1F4E5F]/70">
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
                  'flex min-h-[38px] w-full cursor-pointer items-center justify-between rounded-2xl px-3.5 py-2 text-left text-xs font-extrabold transition-all',
                  isSelected
                    ? 'shadow-xs bg-[#1F4E5F] text-white'
                    : 'border border-[#1F4E5F]/5 bg-[#F7F7F7] text-[#1F4E5F]/80 hover:bg-[#1F4E5F]/5',
                )}
              >
                <div className="flex items-center gap-2">
                  <span>{sport.emoji}</span>
                  <span>{sport.label}</span>
                </div>
                {isSelected && <span className="h-2 w-2 rounded-full bg-[#7FB77E]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Day Filter */}
      <div>
        <span className="mb-2 block text-[11px] font-extrabold uppercase tracking-wider text-[#1F4E5F]/70">
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
                  'min-h-[34px] cursor-pointer rounded-xl px-2.5 py-2 text-center text-xs font-bold transition-all',
                  isSelected
                    ? 'shadow-xs bg-[#1F4E5F] text-white'
                    : 'border border-[#1F4E5F]/10 bg-[#F7F7F7] text-[#1F4E5F]/70 hover:bg-[#1F4E5F]/5',
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
        <span className="mb-2 block text-[11px] font-extrabold uppercase tracking-wider text-[#1F4E5F]/70">
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
                  'min-h-[34px] cursor-pointer truncate rounded-xl px-2 py-2 text-center text-xs font-bold transition-all',
                  isSelected
                    ? 'shadow-xs bg-[#1F4E5F] text-white'
                    : 'border border-[#1F4E5F]/10 bg-[#F7F7F7] text-[#1F4E5F]/70 hover:bg-[#1F4E5F]/5',
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
