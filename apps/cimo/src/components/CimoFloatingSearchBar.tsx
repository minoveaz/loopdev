import React, { useState } from 'react';
import { ChevronDown, MapPin, Search } from 'lucide-react';

export interface CimoFloatingSearchBarProps {
  selectedSport: string;
  onSelectSport: (sport: string) => void;
  selectedDay: string;
  onSelectDay: (day: string) => void;
  selectedZone: string;
  onSelectZone: (zone: string) => void;
  selectedLevel: string;
  onSelectLevel: (lvl: string) => void;
  onSearch?: () => void;
}

const sportsOptions = ['Todos', 'Running', 'Pádel', 'Hiking', 'Crossfit', 'Ciclismo'];
const daysOptions = ['Cualquier día', 'Hoy', 'Mañana', 'Este fin de semana', 'Próxima semana'];
const zonesOptions = ['Toda la ciudad', 'Retiro / Centro', 'Chamartín', 'Chamberí', 'Madrid Río', 'Sierra'];
const levelsOptions = ['Cualquier nivel', 'Principiante', 'Intermedio', 'Avanzado'];

export const CimoFloatingSearchBar: React.FC<CimoFloatingSearchBarProps> = ({
  selectedSport,
  onSelectSport,
  selectedDay,
  onSelectDay,
  selectedZone,
  onSelectZone,
  selectedLevel,
  onSelectLevel,
  onSearch,
}) => {
  const [activeDropdown, setActiveDropdown] = useState<'sport' | 'day' | 'zone' | 'level' | null>(null);

  return (
    <div className="relative w-full max-w-2xl">
      {/* Floating Capsule in Header */}
      <div className="bg-white border border-[#1F4E5F]/15 rounded-full pl-3 pr-1.5 py-1 shadow-xs hover:shadow-md transition-all duration-200 flex items-center justify-between text-[#1F4E5F]">
        {/* Sport Segment */}
        <div
          onClick={() => setActiveDropdown(activeDropdown === 'sport' ? null : 'sport')}
          className={`px-3 py-1 rounded-full cursor-pointer transition-colors relative ${
            activeDropdown === 'sport' ? 'bg-[#F7F7F7]' : 'hover:bg-[#F7F7F7]/60'
          }`}
        >
          <span className="text-[9px] font-black uppercase tracking-wider text-[#1F4E5F]/50 block leading-none">
            Deporte
          </span>
          <span className="text-xs font-extrabold text-[#1F4E5F] truncate block mt-0.5">
            {selectedSport === 'Todos' ? 'Todos' : selectedSport}
          </span>

          {activeDropdown === 'sport' && (
            <div
              className="absolute top-full left-0 mt-2 w-44 bg-white border border-[#1F4E5F]/15 rounded-2xl p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              {sportsOptions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    onSelectSport(s);
                    setActiveDropdown(null);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs font-bold rounded-xl hover:bg-[#F7F7F7] text-[#1F4E5F] transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="h-5 w-[1px] bg-[#1F4E5F]/10 shrink-0" />

        {/* Dates Segment */}
        <div
          onClick={() => setActiveDropdown(activeDropdown === 'day' ? null : 'day')}
          className={`px-3 py-1 rounded-full cursor-pointer transition-colors relative ${
            activeDropdown === 'day' ? 'bg-[#F7F7F7]' : 'hover:bg-[#F7F7F7]/60'
          }`}
        >
          <span className="text-[9px] font-black uppercase tracking-wider text-[#1F4E5F]/50 block leading-none">
            Cuándo
          </span>
          <span className="text-xs font-extrabold text-[#1F4E5F] truncate block mt-0.5">
            {selectedDay}
          </span>

          {activeDropdown === 'day' && (
            <div
              className="absolute top-full left-0 mt-2 w-48 bg-white border border-[#1F4E5F]/15 rounded-2xl p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              {daysOptions.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    onSelectDay(d);
                    setActiveDropdown(null);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs font-bold rounded-xl hover:bg-[#F7F7F7] text-[#1F4E5F] transition-colors"
                >
                  {d}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="h-5 w-[1px] bg-[#1F4E5F]/10 shrink-0 hidden sm:block" />

        {/* Zone Segment */}
        <div
          onClick={() => setActiveDropdown(activeDropdown === 'zone' ? null : 'zone')}
          className={`px-3 py-1 rounded-full cursor-pointer transition-colors relative hidden sm:block ${
            activeDropdown === 'zone' ? 'bg-[#F7F7F7]' : 'hover:bg-[#F7F7F7]/60'
          }`}
        >
          <span className="text-[9px] font-black uppercase tracking-wider text-[#1F4E5F]/50 block leading-none">
            Zona
          </span>
          <span className="text-xs font-extrabold text-[#1F4E5F] truncate block mt-0.5">
            {selectedZone}
          </span>

          {activeDropdown === 'zone' && (
            <div
              className="absolute top-full left-0 mt-2 w-48 bg-white border border-[#1F4E5F]/15 rounded-2xl p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              {zonesOptions.map((z) => (
                <button
                  key={z}
                  type="button"
                  onClick={() => {
                    onSelectZone(z);
                    setActiveDropdown(null);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs font-bold rounded-xl hover:bg-[#F7F7F7] text-[#1F4E5F] transition-colors"
                >
                  {z}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="h-5 w-[1px] bg-[#1F4E5F]/10 shrink-0 hidden lg:block" />

        {/* Level Segment */}
        <div
          onClick={() => setActiveDropdown(activeDropdown === 'level' ? null : 'level')}
          className={`px-3 py-1 rounded-full cursor-pointer transition-colors relative hidden lg:block ${
            activeDropdown === 'level' ? 'bg-[#F7F7F7]' : 'hover:bg-[#F7F7F7]/60'
          }`}
        >
          <span className="text-[9px] font-black uppercase tracking-wider text-[#1F4E5F]/50 block leading-none">
            Nivel
          </span>
          <span className="text-xs font-extrabold text-[#1F4E5F] truncate block mt-0.5">
            {selectedLevel}
          </span>

          {activeDropdown === 'level' && (
            <div
              className="absolute top-full right-0 mt-2 w-44 bg-white border border-[#1F4E5F]/15 rounded-2xl p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              {levelsOptions.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => {
                    onSelectLevel(l);
                    setActiveDropdown(null);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs font-bold rounded-xl hover:bg-[#F7F7F7] text-[#1F4E5F] transition-colors"
                >
                  {l}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Circular Button */}
        <button
          type="button"
          onClick={onSearch}
          aria-label="Buscar entrenamientos"
          className="w-8 h-8 rounded-full bg-[#00B894] hover:bg-[#009678] text-white flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-xs shrink-0 cursor-pointer ml-1"
        >
          <Search className="w-3.5 h-3.5 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
