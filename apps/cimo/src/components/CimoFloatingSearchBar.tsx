import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  Calendar as CalendarIcon,
  Check,
  ChevronDown,
  Clock,
  Compass,
  Flame,
  Layers,
  MapPin,
  Mountain,
  RotateCcw,
  Search,
  Sparkles,
  Target,
  Trophy,
  X,
  Zap,
} from 'lucide-react';
import { POPULAR_CITIES, SPANISH_CITIES } from '../data/spanishCitiesCatalog';
import {
  CIMO_DATE_PRESETS,
  CIMO_LEVELS_CATALOG,
  CIMO_SPORTS_CATALOG,
} from '../data/sportsCatalog';

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

// Normalize accents helper
function normalizeStr(str: string) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

// Vector Sport Icon Helper
function getSportVectorIcon(sportId: string, className = 'w-4 h-4') {
  const norm = sportId.toLowerCase();
  if (norm.includes('run')) return <Activity className={className} />;
  if (norm.includes('pad') || norm.includes('pádel')) return <Target className={className} />;
  if (norm.includes('hik') || norm.includes('trek')) return <Mountain className={className} />;
  return <Layers className={className} />;
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

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl">
      {/* 🌟 Floating Capsule in Header (Clean, Light & Crisp) */}
      <div className="bg-white border border-slate-200/90 rounded-full pl-3 pr-1.5 py-1 shadow-sm hover:shadow-md hover:border-[#7FB77E]/60 transition-all duration-200 flex items-center justify-between text-[#1F4E5F]">
        {/* 1. Sport Segment */}
        <div
          onClick={() => setActiveDropdown(activeDropdown === 'sport' ? null : 'sport')}
          className={`px-3 py-1.5 rounded-full cursor-pointer transition-all relative flex-1 text-left ${
            activeDropdown === 'sport' ? 'bg-[#7FB77E]/15 ring-1 ring-[#7FB77E] text-[#1F4E5F]' : 'hover:bg-slate-100/70'
          }`}
        >
          <span className="text-[9px] font-black uppercase tracking-wider block leading-none text-[#1F4E5F]/60">
            Deporte
          </span>
          <span className="text-xs font-black truncate block mt-0.5 text-[#1F4E5F]">
            {selectedSport}
          </span>
        </div>

        <div className="h-4 w-[1px] bg-slate-200 shrink-0" />

        {/* 2. Dates Segment */}
        <div
          onClick={() => setActiveDropdown(activeDropdown === 'day' ? null : 'day')}
          className={`px-3 py-1.5 rounded-full cursor-pointer transition-all relative flex-1 text-left ${
            activeDropdown === 'day' ? 'bg-[#7FB77E]/15 ring-1 ring-[#7FB77E] text-[#1F4E5F]' : 'hover:bg-slate-100/70'
          }`}
        >
          <span className="text-[9px] font-black uppercase tracking-wider block leading-none text-[#1F4E5F]/60">
            Cuándo
          </span>
          <span className="text-xs font-black truncate block mt-0.5 text-[#1F4E5F]">
            {selectedDay}
          </span>
        </div>

        <div className="h-4 w-[1px] bg-slate-200 shrink-0 hidden sm:block" />

        {/* 3. City Segment */}
        <div
          onClick={() => setActiveDropdown(activeDropdown === 'zone' ? null : 'zone')}
          className={`px-3 py-1.5 rounded-full cursor-pointer transition-all relative hidden sm:block flex-1 text-left ${
            activeDropdown === 'zone' ? 'bg-[#7FB77E]/15 ring-1 ring-[#7FB77E] text-[#1F4E5F]' : 'hover:bg-slate-100/70'
          }`}
        >
          <span className="text-[9px] font-black uppercase tracking-wider block leading-none text-[#1F4E5F]/60">
            Ciudad
          </span>
          <span className="text-xs font-black truncate block mt-0.5 text-[#1F4E5F]">
            {selectedZone}
          </span>
        </div>

        <div className="h-4 w-[1px] bg-slate-200 shrink-0 hidden lg:block" />

        {/* 4. Level Segment */}
        <div
          onClick={() => setActiveDropdown(activeDropdown === 'level' ? null : 'level')}
          className={`px-3 py-1.5 rounded-full cursor-pointer transition-all relative hidden lg:block flex-1 text-left ${
            activeDropdown === 'level' ? 'bg-[#7FB77E]/15 ring-1 ring-[#7FB77E] text-[#1F4E5F]' : 'hover:bg-slate-100/70'
          }`}
        >
          <span className="text-[9px] font-black uppercase tracking-wider block leading-none text-[#1F4E5F]/60">
            Nivel
          </span>
          <span className="text-xs font-black truncate block mt-0.5 text-[#1F4E5F]">
            {selectedLevel}
          </span>
        </div>

        {/* Action Button: Reset if active filters, or Search Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetAllFilters}
            title="Limpiar filtros de búsqueda"
            className="p-1.5 rounded-full hover:bg-rose-50 text-rose-500 transition-colors cursor-pointer mr-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          type="button"
          onClick={onSearch}
          aria-label="Buscar entrenamientos"
          className="w-8 h-8 rounded-full bg-[#7FB77E] hover:bg-[#6ea26d] text-[#1F4E5F] flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-xs shrink-0 cursor-pointer ml-0.5"
        >
          <Search className="w-3.5 h-3.5 stroke-[3]" />
        </button>
      </div>

      {/* 🌟 100% SOLID OPAQUE DROPDOWN PANEL (Zero Translucency Bleeding) */}
      {activeDropdown && (
        <div
          className="absolute top-full left-0 right-0 w-full mt-2.5 bg-white border border-slate-200 rounded-3xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)] z-50 animate-in fade-in duration-150 flex flex-col gap-4 text-[#1F4E5F]"
          onClick={(e) => e.stopPropagation()}
        >

          {/* 🏃 CONTENT 1: DEPORTE */}
          {activeDropdown === 'sport' && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#1F4E5F]/70">
                  Disciplinas disponibles en CIMO
                </span>
                <span className="text-xs font-black text-[#7FB77E] bg-[#7FB77E]/10 px-2.5 py-0.5 rounded-full">
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
                      ? 'bg-[#1F4E5F] text-white shadow-xs font-black'
                      : 'bg-slate-50 hover:bg-slate-100 text-[#1F4E5F] border border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Layers className={`w-4 h-4 ${selectedSport === 'Todos' ? 'text-[#7FB77E]' : 'text-slate-500'} shrink-0`} />
                    <span className="text-xs font-black truncate">Todos los deportes</span>
                  </div>
                  {selectedSport === 'Todos' && <Check className="w-4 h-4 text-[#7FB77E] shrink-0" />}
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
                          ? 'bg-[#1F4E5F] text-white shadow-xs font-black'
                          : 'bg-slate-50 hover:bg-slate-100 text-[#1F4E5F] border border-slate-200/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className={isSelected ? 'text-[#7FB77E]' : 'text-slate-500'}>{getSportVectorIcon(s.id, 'w-4 h-4')}</span>
                        <span className="text-xs font-black truncate">{s.label}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#7FB77E] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 📅 CONTENT 2: FECHAS / DÍAS */}
          {activeDropdown === 'day' && (
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#1F4E5F]/70">
                  Elige cuándo quieres entrenar
                </span>
                <span className="text-xs font-black text-[#7FB77E] bg-[#7FB77E]/10 px-2.5 py-0.5 rounded-full">
                  {selectedDay}
                </span>
              </div>

              {/* Quick Presets */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {CIMO_DATE_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => {
                      onSelectDay(preset.label);
                      setActiveDropdown(null);
                    }}
                    className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all cursor-pointer text-center ${
                      selectedDay === preset.label
                        ? 'bg-[#1F4E5F] text-white shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-[#1F4E5F] border border-slate-200/80'
                    }`}
                  >
                    <span className="block">{preset.label}</span>
                    <span className="text-[10px] opacity-60 block mt-0.5">{preset.sub}</span>
                  </button>
                ))}
              </div>

              {/* September 2026 Calendar Grid */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]/60 block mb-2">
                  Septiembre 2026
                </span>
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d, i) => (
                    <span key={i} className="text-[10px] font-black text-slate-400 py-1">
                      {d}
                    </span>
                  ))}
                  {calendarDays.map((c, i) =>
                    c.empty ? (
                      <div key={i} />
                    ) : (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          onSelectDay(c.name ?? `Día ${c.day}`);
                          setActiveDropdown(null);
                        }}
                        className={`h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          selectedDay === c.name
                            ? 'bg-[#7FB77E] text-[#1F4E5F] font-black shadow-xs'
                            : 'hover:bg-slate-100 text-[#1F4E5F]'
                        }`}
                      >
                        {c.day}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 📍 CONTENT 3: CIUDAD / ZONA (Smart, Fast & Compact) */}
          {activeDropdown === 'zone' && (
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#1F4E5F]/70">
                  Ubicación & Ciudades de España
                </span>
                <span className="text-xs font-black text-[#7FB77E] bg-[#7FB77E]/10 px-2.5 py-0.5 rounded-full">
                  {selectedZone}
                </span>
              </div>

              {/* Search Bar for Cities */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  autoFocus
                  value={citySearchQuery}
                  onChange={(e) => setCitySearchQuery(e.target.value)}
                  placeholder="Escribe una ciudad o municipio (ej. Madrid, Pozuelo, Barcelona...)"
                  className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-[#1F4E5F] focus:bg-white focus:outline-none focus:border-[#7FB77E] shadow-2xs"
                />
                {citySearchQuery && (
                  <button
                    type="button"
                    onClick={() => setCitySearchQuery('')}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* 1. STATE A: No query typed -> Show Only Popular Cities Pills (Compact, Zero bottom grid) */}
              {!citySearchQuery.trim() && (
                <div className="flex flex-col gap-2 pt-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Ciudades Populares
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectZone('Toda España');
                        setActiveDropdown(null);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        selectedZone === 'Toda España'
                          ? 'bg-[#1F4E5F] text-white shadow-xs font-black'
                          : 'bg-slate-50 hover:bg-slate-100 text-[#1F4E5F] border border-slate-200/80'
                      }`}
                    >
                      <Compass className="w-3.5 h-3.5 text-[#7FB77E]" />
                      <span>Toda España</span>
                    </button>

                    {POPULAR_CITIES.map((cityName) => (
                      <button
                        key={cityName}
                        type="button"
                        onClick={() => {
                          onSelectZone(cityName);
                          setActiveDropdown(null);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          selectedZone === cityName
                            ? 'bg-[#1F4E5F] text-white shadow-xs font-black'
                            : 'bg-slate-50 hover:bg-slate-100 text-[#1F4E5F] border border-slate-200/80'
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5 text-[#7FB77E]" />
                        <span>{cityName}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. STATE B: Query typed -> Popular cities disappear, ONLY Exact Suggestions List */}
              {citySearchQuery.trim() && (
                <div className="flex flex-col gap-1 max-h-56 overflow-y-auto pr-1">
                  {filteredCities.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400 font-medium">
                      No encontramos municipios que coincidan con "{citySearchQuery}".
                    </div>
                  ) : (
                    filteredCities.map((city) => (
                      <button
                        key={`${city.name}-${city.province}`}
                        type="button"
                        onClick={() => {
                          onSelectZone(city.name);
                          setActiveDropdown(null);
                          setCitySearchQuery('');
                        }}
                        className={`p-2.5 rounded-xl text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between hover:bg-slate-100 ${
                          selectedZone === city.name
                            ? 'bg-[#1F4E5F] text-white'
                            : 'bg-slate-50 text-[#1F4E5F] border border-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <MapPin className={`w-3.5 h-3.5 ${selectedZone === city.name ? 'text-white' : 'text-[#7FB77E]'}`} />
                          <div>
                            <span className="font-extrabold block">{city.name}</span>
                            <span className={`text-[10px] block ${selectedZone === city.name ? 'text-white/70' : 'text-slate-400'}`}>
                              {city.province} • {city.region}
                            </span>
                          </div>
                        </div>
                        {selectedZone === city.name && <Check className="w-4 h-4 text-[#7FB77E] shrink-0" />}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* ⚡ CONTENT 4: NIVEL */}
          {activeDropdown === 'level' && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#1F4E5F]/70">
                  Nivel de Intensidad
                </span>
                <span className="text-xs font-black text-[#7FB77E] bg-[#7FB77E]/10 px-2.5 py-0.5 rounded-full">
                  {selectedLevel}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {CIMO_LEVELS_CATALOG.map((lvl) => {
                  const isSelected = selectedLevel.toLowerCase() === lvl.label.toLowerCase();
                  return (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => {
                        onSelectLevel(lvl.label);
                        setActiveDropdown(null);
                      }}
                      className={`p-3 rounded-2xl text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#1F4E5F] text-white shadow-xs font-black'
                          : 'bg-slate-50 hover:bg-slate-100 text-[#1F4E5F] border border-slate-200/80'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-black block">{lvl.label}</span>
                        <span className={`text-[10px] block mt-0.5 ${isSelected ? 'text-white/70' : 'text-slate-500'}`}>
                          {lvl.desc}
                        </span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#7FB77E] shrink-0" />}
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
