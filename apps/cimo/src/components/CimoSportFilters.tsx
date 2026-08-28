import React from 'react';
import { clsx } from 'clsx';
import { Search } from 'lucide-react';

export interface CimoSportFiltersProps {
  selectedSport: string;
  onSelectSport: (sport: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedLevel: string;
  onSelectLevel: (lvl: string) => void;
}

const sportsList = [
  'Todos',
  'Running',
  'Pádel',
  'Crossfit',
  'Ciclismo',
  'Senderismo',
  'Tenis',
  'Natación',
];

const levelsList = ['Todos', 'Principiante', 'Intermedio', 'Avanzado'];

export const CimoSportFilters: React.FC<CimoSportFiltersProps> = ({
  selectedSport,
  onSelectSport,
  searchQuery,
  onSearchChange,
  selectedLevel,
  onSelectLevel,
}) => {
  return (
    <aside
      aria-label="Filtros de actividades"
      className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm flex flex-col gap-5 sticky top-20"
    >
      {/* Search Input */}
      <div>
        <label htmlFor="cimo-search-input" className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1.5">
          Buscar planes
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="cimo-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Zona, parque o club..."
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--lpd-brand-primary)] focus:bg-white transition-all min-h-[38px]"
          />
        </div>
      </div>

      {/* Sports Categories */}
      <div>
        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
          Deportes
        </span>
        <div className="flex flex-wrap gap-1.5">
          {sportsList.map((sport) => {
            const isSelected = selectedSport === sport;
            return (
              <button
                key={sport}
                type="button"
                onClick={() => onSelectSport(sport)}
                className={clsx(
                  'px-3 py-1.5 text-xs font-semibold rounded-xl transition-all min-h-[34px]',
                  isSelected
                    ? 'bg-[var(--lpd-brand-primary)] text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100',
                )}
              >
                {sport}
              </button>
            );
          })}
        </div>
      </div>

      {/* Level Filters */}
      <div>
        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
          Nivel de exigencia
        </span>
        <div className="flex flex-col gap-1">
          {levelsList.map((lvl) => {
            const isSelected = selectedLevel === lvl;
            return (
              <button
                key={lvl}
                type="button"
                onClick={() => onSelectLevel(lvl)}
                className={clsx(
                  'w-full text-left px-3 py-2 text-xs font-medium rounded-lg transition-colors flex items-center justify-between min-h-[36px]',
                  isSelected
                    ? 'bg-[var(--lpd-brand-primary)]/10 text-[var(--lpd-brand-primary)] font-bold'
                    : 'text-slate-600 hover:bg-slate-50',
                )}
              >
                <span>{lvl}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[var(--lpd-brand-primary)]" />}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
