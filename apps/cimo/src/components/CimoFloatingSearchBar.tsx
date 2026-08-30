import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Calendar as CalendarIcon,
  Check,
  ChevronDown,
  Clock,
  MapPin,
  RotateCcw,
  Search,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import {
  CIMO_DATE_PRESETS,
  CIMO_LEVELS_CATALOG,
  CIMO_SPORTS_CATALOG,
  POPULAR_CITIES,
  SPANISH_CITIES,
} from '../data/spanishCitiesCatalog';

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

// Helper to normalize accents
function normalizeStr(str: string) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

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
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Filtered cities based on search input
  const filteredCities = useMemo(() => {
    const q = normalizeStr(citySearchQuery.trim());
    if (!q) {
      return SPANISH_CITIES.slice(0, 12);
    }
    return SPANISH_CITIES.filter((city) => {
      const name = normalizeStr(city.name);
      const prov = normalizeStr(city.province);
      const reg = normalizeStr(city.region);
      const matchesCp = city.postalCodes?.some((cp) => cp.includes(q));
      return name.includes(q) || prov.includes(q) || reg.includes(q) || matchesCp;
    }).slice(0, 14);
  }, [citySearchQuery]);

  // Calendar days generation for September 2026
  const calendarDays = useMemo(() => [
    { day: '', empty: true }, // Monday 31 Aug
    { day: 1, name: 'Mar 1 Sep' },
    { day: 2, name: 'Mié 2 Sep' },
    { day: 3, name: 'Jue 3 Sep' },
    { day: 4, name: 'Vie 4 Sep' },
    { day: 5, name: 'Sáb 5 Sep' },
    { day: 6, name: 'Dom 6 Sep' },
    { day: 7, name: 'Lun 7 Sep' },
    { day: 8, name: 'Mar 8 Sep' },
    { day: 9, name: 'Mié 9 Sep' },
    { day: 10, name: 'Jue 10 Sep' },
    { day: 11, name: 'Vie 11 Sep' },
    { day: 12, name: 'Sáb 12 Sep' },
    { day: 13, name: 'Dom 13 Sep' },
    { day: 14, name: 'Lun 14 Sep' },
    { day: 15, name: 'Mar 15 Sep' },
    { day: 16, name: 'Mié 16 Sep' },
    { day: 17, name: 'Jue 17 Sep' },
    { day: 18, name: 'Vie 18 Sep' },
    { day: 19, name: 'Sáb 19 Sep' },
    { day: 20, name: 'Dom 20 Sep' },
    { day: 21, name: 'Lun 21 Sep' },
    { day: 22, name: 'Mar 22 Sep' },
    { day: 23, name: 'Mié 23 Sep' },
    { day: 24, name: 'Jue 24 Sep' },
    { day: 25, name: 'Vie 25 Sep' },
    { day: 26, name: 'Sáb 26 Sep' },
    { day: 27, name: 'Dom 27 Sep' },
    { day: 28, name: 'Lun 28 Sep' },
    { day: 29, name: 'Mar 29 Sep' },
    { day: 30, name: 'Mié 30 Sep' },
  ], []);

  const hasActiveFilters =
    selectedSport !== 'Todos' ||
    selectedDay !== 'Cualquier día' ||
    (selectedZone !== 'Toda España' && selectedZone !== 'Toda la ciudad') ||
    selectedLevel !== 'Cualquier nivel';

  const resetAllFilters = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectSport('Todos');
    onSelectDay('Cualquier día');
    onSelectZone('Toda España');
    onSelectLevel('Cualquier nivel');
    setActiveDropdown(null);
  };

  const currentSportObj = CIMO_SPORTS_CATALOG.find((s) => s.id.toLowerCase() === selectedSport.toLowerCase() || s.label.toLowerCase() === selectedSport.toLowerCase());
  const currentSportEmoji = currentSportObj?.emoji ?? (selectedSport === 'Todos' ? '⭐' : '🏃');

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl">
      {/* Floating Capsule in Header */}
      <div className="bg-white border border-[#1F4E5F]/15 rounded-full pl-3 pr-1.5 py-1 shadow-xs hover:shadow-md transition-all duration-200 flex items-center justify-between text-[#1F4E5F]">
        {/* 🏃 1. Sport Segment */}
        <div
          onClick={() => setActiveDropdown(activeDropdown === 'sport' ? null : 'sport')}
          className={`px-3 py-1 rounded-full cursor-pointer transition-colors relative flex-1 text-left ${
            activeDropdown === 'sport' ? 'bg-[#1F4E5F]/10 text-[#1F4E5F]' : 'hover:bg-[#F7F7F7]/80'
          }`}
        >
          <span className="text-[9px] font-black uppercase tracking-wider text-[#1F4E5F]/60 block leading-none">
            Deporte
          </span>
          <span className="text-xs font-black text-[#1F4E5F] truncate block mt-0.5">
            {selectedSport === 'Todos' ? 'Todos' : `${currentSportEmoji} ${selectedSport}`}
          </span>
        </div>

        <div className="h-5 w-[1px] bg-[#1F4E5F]/10 shrink-0" />

        {/* 📅 2. Dates Segment */}
        <div
          onClick={() => setActiveDropdown(activeDropdown === 'day' ? null : 'day')}
          className={`px-3 py-1 rounded-full cursor-pointer transition-colors relative flex-1 text-left ${
            activeDropdown === 'day' ? 'bg-[#1F4E5F]/10 text-[#1F4E5F]' : 'hover:bg-[#F7F7F7]/80'
          }`}
        >
          <span className="text-[9px] font-black uppercase tracking-wider text-[#1F4E5F]/60 block leading-none">
            Cuándo
          </span>
          <span className="text-xs font-black text-[#1F4E5F] truncate block mt-0.5">
            {selectedDay}
          </span>
        </div>

        <div className="h-5 w-[1px] bg-[#1F4E5F]/10 shrink-0 hidden sm:block" />

        {/* 📍 3. City Segment */}
        <div
          onClick={() => setActiveDropdown(activeDropdown === 'zone' ? null : 'zone')}
          className={`px-3 py-1 rounded-full cursor-pointer transition-colors relative hidden sm:block flex-1 text-left ${
            activeDropdown === 'zone' ? 'bg-[#1F4E5F]/10 text-[#1F4E5F]' : 'hover:bg-[#F7F7F7]/80'
          }`}
        >
          <span className="text-[9px] font-black uppercase tracking-wider text-[#1F4E5F]/60 block leading-none">
            Ciudad
          </span>
          <span className="text-xs font-black text-[#1F4E5F] truncate block mt-0.5">
            {selectedZone}
          </span>
        </div>

        <div className="h-5 w-[1px] bg-[#1F4E5F]/10 shrink-0 hidden lg:block" />

        {/* ⚡ 4. Level Segment */}
        <div
          onClick={() => setActiveDropdown(activeDropdown === 'level' ? null : 'level')}
          className={`px-3 py-1 rounded-full cursor-pointer transition-colors relative hidden lg:block flex-1 text-left ${
            activeDropdown === 'level' ? 'bg-[#1F4E5F]/10 text-[#1F4E5F]' : 'hover:bg-[#F7F7F7]/80'
          }`}
        >
          <span className="text-[9px] font-black uppercase tracking-wider text-[#1F4E5F]/60 block leading-none">
            Nivel
          </span>
          <span className="text-xs font-black text-[#1F4E5F] truncate block mt-0.5">
            {selectedLevel}
          </span>
        </div>

        {/* Action Button: Reset if active filters, or Search Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetAllFilters}
            title="Limpiar filtros de búsqueda"
            className="p-2 rounded-full hover:bg-red-50 text-red-500 transition-colors cursor-pointer mr-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          type="button"
          onClick={onSearch}
          aria-label="Buscar entrenamientos"
          className="w-8 h-8 rounded-full bg-[#00B894] hover:bg-[#009678] text-white flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-xs shrink-0 cursor-pointer ml-0.5"
        >
          <Search className="w-3.5 h-3.5 stroke-[3]" />
        </button>
      </div>

      {/* 🌟 UNIFIED FULL-WIDTH PANEL (Identical width `w-full left-0 right-0` across all options) */}
      {activeDropdown && (
        <div
          className="absolute top-full left-0 right-0 w-full mt-2.5 bg-white border border-[#1F4E5F]/15 rounded-3xl p-5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 flex flex-col gap-4 text-[#1F4E5F]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Panel Navigation Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-[#1F4E5F]/10">
            <div className="flex items-center gap-1.5 p-1 bg-[#F7F7F7] rounded-full border border-[#1F4E5F]/5">
              <button
                type="button"
                onClick={() => setActiveDropdown('sport')}
                className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
                  activeDropdown === 'sport' ? 'bg-[#1F4E5F] text-white shadow-xs' : 'text-[#1F4E5F]/70 hover:text-[#1F4E5F]'
                }`}
              >
                🏃 Deporte
              </button>
              <button
                type="button"
                onClick={() => setActiveDropdown('day')}
                className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
                  activeDropdown === 'day' ? 'bg-[#1F4E5F] text-white shadow-xs' : 'text-[#1F4E5F]/70 hover:text-[#1F4E5F]'
                }`}
              >
                📅 Cuándo
              </button>
              <button
                type="button"
                onClick={() => setActiveDropdown('zone')}
                className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
                  activeDropdown === 'zone' ? 'bg-[#1F4E5F] text-white shadow-xs' : 'text-[#1F4E5F]/70 hover:text-[#1F4E5F]'
                }`}
              >
                📍 Ciudad
              </button>
              <button
                type="button"
                onClick={() => setActiveDropdown('level')}
                className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
                  activeDropdown === 'level' ? 'bg-[#1F4E5F] text-white shadow-xs' : 'text-[#1F4E5F]/70 hover:text-[#1F4E5F]'
                }`}
              >
                ⚡ Nivel
              </button>
            </div>

            <button
              type="button"
              onClick={() => setActiveDropdown(null)}
              className="p-1.5 rounded-full hover:bg-[#F7F7F7] text-[#1F4E5F]/50 hover:text-[#1F4E5F] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 🏃 CONTENT 1: DEPORTE */}
          {activeDropdown === 'sport' && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#1F4E5F]/70">
                  Disciplinas disponibles en CIMO
                </span>
                <span className="text-xs font-black text-[#00B894] bg-[#00B894]/10 px-2.5 py-0.5 rounded-full">
                  {selectedSport}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                {/* Option: Todos */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectSport('Todos');
                    setActiveDropdown(null);
                  }}
                  className={`p-3 rounded-2xl text-left transition-all cursor-pointer flex items-center justify-between ${
                    selectedSport === 'Todos'
                      ? 'bg-[#1F4E5F] text-white shadow-xs font-black ring-2 ring-[#00B894]/40'
                      : 'bg-[#F7F7F7] hover:bg-[#00B894]/10 text-[#1F4E5F] border border-transparent hover:border-[#00B894]/20'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-xl">⭐</span>
                    <span className="text-xs font-black truncate">Todos los deportes</span>
                  </div>
                  {selectedSport === 'Todos' && <Check className="w-4 h-4 text-[#00B894] shrink-0" />}
                </button>

                {/* Specific sports */}
                {CIMO_SPORTS_CATALOG.map((s) => {
                  const isSelected = selectedSport.toLowerCase() === s.id.toLowerCase() || selectedSport.toLowerCase() === s.label.toLowerCase();
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        onSelectSport(s.label);
                        setActiveDropdown(null);
                      }}
                      className={`p-3 rounded-2xl text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#1F4E5F] text-white shadow-xs font-black ring-2 ring-[#00B894]/40'
                          : 'bg-[#F7F7F7] hover:bg-[#00B894]/10 text-[#1F4E5F] border border-transparent hover:border-[#00B894]/20'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-xl">{s.emoji}</span>
                        <span className="text-xs font-black truncate">{s.label}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#00B894] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 📅 CONTENT 2: CUÁNDO (Side-by-Side Atajos + Calendario) */}
          {activeDropdown === 'day' && (
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
              {/* Left Column: Quick Options (5 cols) */}
              <div className="sm:col-span-5 flex flex-col gap-1.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#1F4E5F]/60 mb-1">
                  Atajos Rápidos
                </span>
                {CIMO_DATE_PRESETS.map((qd) => {
                  const isSelected = selectedDay === qd.value;
                  return (
                    <button
                      key={qd.value}
                      type="button"
                      onClick={() => {
                        onSelectDay(qd.value);
                        setActiveDropdown(null);
                      }}
                      className={`p-2.5 rounded-2xl text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#1F4E5F] text-white shadow-xs font-black ring-2 ring-[#00B894]/40'
                          : 'bg-[#F7F7F7] hover:bg-[#00B894]/10 text-[#1F4E5F]'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-black block leading-tight">{qd.label}</span>
                        <span className={`text-[10px] font-medium block mt-0.5 ${isSelected ? 'text-white/80' : 'text-[#1F4E5F]/55'}`}>
                          {qd.sub}
                        </span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#00B894] shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Visual Calendar (7 cols) */}
              <div className="sm:col-span-7 bg-[#F7F7F7] p-4 rounded-2xl border border-[#1F4E5F]/10 flex flex-col gap-2.5">
                <div className="flex items-center justify-between pb-1 border-b border-[#1F4E5F]/10">
                  <span className="text-xs font-black text-[#1F4E5F] uppercase tracking-wider">
                    Septiembre 2026
                  </span>
                  <span className="text-[10px] text-[#00B894] font-black">Haz clic en un día exacto</span>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center">
                  {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d) => (
                    <span key={d} className="text-[10px] font-black text-[#1F4E5F]/55 py-0.5">
                      {d}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((cd, idx) => {
                    if (cd.empty) {
                      return <div key={`empty-${idx}`} className="h-7" />;
                    }
                    const isSelected = selectedDay === cd.name;
                    return (
                      <button
                        key={cd.day}
                        type="button"
                        onClick={() => {
                          onSelectDay(cd.name!);
                          setActiveDropdown(null);
                        }}
                        className={`h-7 rounded-xl text-xs font-black transition-all flex items-center justify-center cursor-pointer ${
                          isSelected
                            ? 'bg-[#00B894] text-white scale-105 shadow-xs font-black ring-2 ring-white'
                            : 'bg-white hover:bg-[#00B894]/20 text-[#1F4E5F]'
                        }`}
                      >
                        {cd.day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 📍 CONTENT 3: CIUDAD & MUNICIPIO (Full Width Search & 2-Column Grid) */}
          {activeDropdown === 'zone' && (
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#1F4E5F]/70 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#00B894]" />
                  <span>Explorar por ciudad, municipio o barrio en toda España</span>
                </span>
                <span className="text-xs font-black text-[#00B894] bg-[#00B894]/10 px-2.5 py-0.5 rounded-full truncate max-w-[160px]">
                  {selectedZone}
                </span>
              </div>

              {/* Real-Time Live Search Input (Full Width & Spacious) */}
              <div className="relative">
                <input
                  type="text"
                  value={citySearchQuery}
                  onChange={(e) => setCitySearchQuery(e.target.value)}
                  placeholder="Escribe cualquier ciudad, barrio o municipio (ej. Pozuelo, Retiro, Granada, Alcobendas...)"
                  className="w-full pl-10 pr-9 py-3 bg-[#F7F7F7] focus:bg-white rounded-2xl border border-[#1F4E5F]/20 focus:border-[#00B894] focus:ring-2 focus:ring-[#00B894]/20 text-xs sm:text-sm font-bold text-[#1F4E5F] outline-none shadow-2xs transition-all"
                  autoFocus
                />
                <Search className="w-4 h-4 text-[#1F4E5F]/40 absolute left-3.5 top-3.5" />
                {citySearchQuery && (
                  <button
                    type="button"
                    onClick={() => setCitySearchQuery('')}
                    className="p-1.5 text-[#1F4E5F]/40 hover:text-[#1F4E5F] absolute right-3 top-2.5 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Popular Cities Chips */}
              {!citySearchQuery.trim() && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]/50">
                    Ciudades Populares
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_CITIES.map((pc) => {
                      const isSelected = selectedZone.toLowerCase() === pc.toLowerCase();
                      return (
                        <button
                          key={pc}
                          type="button"
                          onClick={() => {
                            onSelectZone(pc);
                            setActiveDropdown(null);
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#1F4E5F] text-white shadow-xs scale-102'
                              : 'bg-[#F7F7F7] hover:bg-[#00B894]/15 hover:text-[#1F4E5F] text-[#1F4E5F]/80 border border-[#1F4E5F]/5'
                          }`}
                        >
                          {pc}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Filtered Autocomplete Cities List (2-Column Grid) */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]/50">
                  {citySearchQuery.trim() ? `Resultados para "${citySearchQuery}"` : 'Todas las ubicaciones disponibles'}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                  {filteredCities.map((c) => {
                    const isSelected = selectedZone.toLowerCase() === c.name.toLowerCase();
                    return (
                      <button
                        key={`${c.name}-${c.province}`}
                        type="button"
                        onClick={() => {
                          onSelectZone(c.name);
                          setActiveDropdown(null);
                          setCitySearchQuery('');
                        }}
                        className={`p-3 rounded-2xl text-left transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#1F4E5F] text-white shadow-xs font-black ring-2 ring-[#00B894]/40'
                            : 'bg-[#F7F7F7] hover:bg-[#00B894]/10 text-[#1F4E5F] border border-transparent hover:border-[#00B894]/20'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 truncate">
                          <MapPin className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#00B894]' : 'text-[#7FB77E]'}`} />
                          <div className="truncate">
                            <span className="text-xs font-black block truncate">{c.name}</span>
                            <span className={`text-[10px] block truncate ${isSelected ? 'text-white/80' : 'text-[#1F4E5F]/55'}`}>
                              {c.province} • {c.region}
                            </span>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#00B894] shrink-0 ml-1.5" />}
                      </button>
                    );
                  })}
                </div>

                {/* Custom write-in option if typing something unique */}
                {citySearchQuery.trim() && !filteredCities.some((c) => c.name.toLowerCase() === citySearchQuery.toLowerCase()) && (
                  <button
                    type="button"
                    onClick={() => {
                      onSelectZone(citySearchQuery.trim());
                      setActiveDropdown(null);
                      setCitySearchQuery('');
                    }}
                    className="p-3 rounded-2xl text-left text-xs font-black text-[#00B894] bg-[#00B894]/10 hover:bg-[#00B894]/20 border border-dashed border-[#00B894] cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <MapPin className="w-4 h-4 text-[#00B894] shrink-0" />
                      <span className="truncate">Buscar en: "{citySearchQuery.trim()}"</span>
                    </div>
                    <span className="text-[10px] bg-[#00B894] text-white px-2 py-0.5 rounded-full shrink-0">
                      Personalizado
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ⚡ CONTENT 4: NIVEL */}
          {activeDropdown === 'level' && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#1F4E5F]/70">
                  Nivel técnico y exigencia del grupo
                </span>
                <span className="text-xs font-black text-[#00B894] bg-[#00B894]/10 px-2.5 py-0.5 rounded-full">
                  {selectedLevel}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {CIMO_LEVELS_CATALOG.map((l) => {
                  const isSelected = selectedLevel === l.id;
                  return (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => {
                        onSelectLevel(l.id);
                        setActiveDropdown(null);
                      }}
                      className={`p-3 rounded-2xl text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#1F4E5F] text-white shadow-xs font-black ring-2 ring-[#00B894]/40'
                          : 'bg-[#F7F7F7] hover:bg-[#00B894]/10 text-[#1F4E5F] border border-transparent hover:border-[#00B894]/20'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-black block">{l.label}</span>
                        <span className={`text-[10px] font-medium block mt-0.5 ${isSelected ? 'text-white/80' : 'text-[#1F4E5F]/60'}`}>
                          {l.desc}
                        </span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#00B894] shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
