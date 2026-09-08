import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  Calendar as CalendarIcon,
  Check,
  ChevronLeft,
  ChevronRight,
  Compass,
  Layers,
  MapPin,
  Mountain,
  RotateCcw,
  Search,
  Target,
  X,
} from 'lucide-react';
import { POPULAR_CITIES, SPANISH_CITIES } from '../data/spanishCitiesCatalog';
import { CIMO_LEVELS_CATALOG, CIMO_SPORTS_CATALOG } from '../data/sportsCatalog';

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

const MONTH_NAMES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const WEEKDAY_HEADERS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

const CLEAN_DATE_PRESETS = [
  { label: 'Cualquier día', sub: 'Sin límite', value: 'Cualquier día' },
  { label: 'Hoy', sub: 'Entrenos hoy', value: 'Hoy' },
  { label: 'Mañana', sub: 'Próximas 24h', value: 'Mañana' },
  { label: 'Este finde', sub: 'Sáb & Dom', value: 'Este fin de semana' },
  { label: 'Esta semana', sub: 'Lun a Dom', value: 'Esta semana' },
];

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
  const [activeDropdown, setActiveDropdown] = useState<'sport' | 'day' | 'zone' | 'level' | null>(
    null,
  );
  const [citySearchQuery, setCitySearchQuery] = useState('');

  // Dynamic Month & Year Navigation State (Default to current date or Sep 2026)
  const [currentCalendarDate, setCurrentCalendarDate] = useState(() => new Date(2026, 8, 1)); // Sep 2026 default
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

  // Dynamic calendar generator for the current year & month
  const calendarGrid = useMemo(() => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();

    const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days: Array<{ dayNumber: number | null; label: string; dateStr: string }> = [];

    // Empty leading padding days
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ dayNumber: null, label: '', dateStr: '' });
    }

    // Actual days of the month
    for (let d = 1; d <= totalDays; d++) {
      const dObj = new Date(year, month, d);
      const weekdayShort = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][dObj.getDay()];
      const monthShort = MONTH_NAMES[month]?.slice(0, 3);
      const dateStr = `${weekdayShort} ${d} ${monthShort} ${year}`;

      days.push({
        dayNumber: d,
        label: `${d}`,
        dateStr,
      });
    }

    return days;
  }, [currentCalendarDate]);

  const handlePrevMonth = () => {
    setCurrentCalendarDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentCalendarDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

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

  const currentYear = currentCalendarDate.getFullYear();
  const currentMonthName = MONTH_NAMES[currentCalendarDate.getMonth()];

  return (
    <div ref={containerRef} className="relative z-50 w-full max-w-2xl">
      {/* 🌟 Floating Capsule in Header */}
      <div className="relative z-50 flex items-center justify-between rounded-full border border-slate-200/90 bg-white py-1 pl-3 pr-1.5 text-[#1F4E5F] shadow-sm transition-all duration-200 hover:border-[#7FB77E]/60 hover:shadow-md">
        {/* 1. Sport Segment */}
        <div
          onClick={() => setActiveDropdown(activeDropdown === 'sport' ? null : 'sport')}
          className={`relative flex-1 cursor-pointer rounded-full px-3 py-1.5 text-left transition-all ${
            activeDropdown === 'sport'
              ? 'shadow-xs bg-[#1F4E5F] text-white'
              : 'hover:bg-slate-100/70'
          }`}
        >
          <span
            className={`block text-[9px] font-black uppercase leading-none tracking-wider ${activeDropdown === 'sport' ? 'text-white/70' : 'text-[#1F4E5F]/60'}`}
          >
            Deporte
          </span>
          <span className="mt-0.5 block truncate text-xs font-black">{selectedSport}</span>
        </div>

        <div className="h-4 w-[1px] shrink-0 bg-slate-200" />

        {/* 2. Dates Segment */}
        <div
          onClick={() => setActiveDropdown(activeDropdown === 'day' ? null : 'day')}
          className={`relative flex-1 cursor-pointer rounded-full px-3 py-1.5 text-left transition-all ${
            activeDropdown === 'day' ? 'shadow-xs bg-[#1F4E5F] text-white' : 'hover:bg-slate-100/70'
          }`}
        >
          <span
            className={`block text-[9px] font-black uppercase leading-none tracking-wider ${activeDropdown === 'day' ? 'text-white/70' : 'text-[#1F4E5F]/60'}`}
          >
            Cuándo
          </span>
          <span className="mt-0.5 block truncate text-xs font-black">{selectedDay}</span>
        </div>

        <div className="hidden h-4 w-[1px] shrink-0 bg-slate-200 sm:block" />

        {/* 3. City Segment */}
        <div
          onClick={() => setActiveDropdown(activeDropdown === 'zone' ? null : 'zone')}
          className={`relative hidden flex-1 cursor-pointer rounded-full px-3 py-1.5 text-left transition-all sm:block ${
            activeDropdown === 'zone'
              ? 'shadow-xs bg-[#1F4E5F] text-white'
              : 'hover:bg-slate-100/70'
          }`}
        >
          <span
            className={`block text-[9px] font-black uppercase leading-none tracking-wider ${activeDropdown === 'zone' ? 'text-white/70' : 'text-[#1F4E5F]/60'}`}
          >
            Ciudad
          </span>
          <span className="mt-0.5 block truncate text-xs font-black">{selectedZone}</span>
        </div>

        <div className="hidden h-4 w-[1px] shrink-0 bg-slate-200 lg:block" />

        {/* 4. Level Segment */}
        <div
          onClick={() => setActiveDropdown(activeDropdown === 'level' ? null : 'level')}
          className={`relative hidden flex-1 cursor-pointer rounded-full px-3 py-1.5 text-left transition-all lg:block ${
            activeDropdown === 'level'
              ? 'shadow-xs bg-[#1F4E5F] text-white'
              : 'hover:bg-slate-100/70'
          }`}
        >
          <span
            className={`block text-[9px] font-black uppercase leading-none tracking-wider ${activeDropdown === 'level' ? 'text-white/70' : 'text-[#1F4E5F]/60'}`}
          >
            Nivel
          </span>
          <span className="mt-0.5 block truncate text-xs font-black">{selectedLevel}</span>
        </div>

        {/* Action Button: Reset if active filters, or Search Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetAllFilters}
            title="Limpiar filtros de búsqueda"
            className="mr-1 cursor-pointer rounded-full p-1.5 text-rose-500 transition-colors hover:bg-rose-50"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        )}

        <button
          type="button"
          onClick={onSearch}
          aria-label="Buscar entrenamientos"
          className="shadow-xs ml-0.5 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#7FB77E] text-[#1F4E5F] transition-transform hover:scale-105 hover:bg-[#6ea26d] active:scale-95"
        >
          <Search className="h-3.5 w-3.5 stroke-[3]" />
        </button>
      </div>

      {/* 🌟 DARK PETROLEUM DROPDOWN POPOVER PANEL (#1F4E5F) */}
      {activeDropdown && (
        <div
          className="animate-in fade-in zoom-in-95 absolute left-0 right-0 top-full z-50 mt-3 flex w-full flex-col gap-4 rounded-3xl border border-white/15 bg-[#1F4E5F] p-5 text-white shadow-2xl shadow-[#1F4E5F]/50 duration-150 sm:p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 🏃 CONTENT 1: DEPORTE */}
          {activeDropdown === 'sport' && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-white/70">
                  Disciplinas disponibles en CIMO
                </span>
                <span className="rounded-full border border-[#7FB77E]/30 bg-[#7FB77E]/20 px-2.5 py-0.5 text-xs font-black text-[#7FB77E]">
                  {selectedSport}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-4">
                {/* Option: Todos */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectSport('Todos');
                    setActiveDropdown(null);
                  }}
                  className={`flex min-h-[48px] cursor-pointer items-center justify-between rounded-2xl p-3.5 text-left transition-all ${
                    selectedSport === 'Todos'
                      ? 'scale-102 bg-[#7FB77E] font-black text-[#1F4E5F] shadow-lg ring-2 ring-white/40'
                      : 'border border-white/10 bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Layers
                      className={`h-4 w-4 ${selectedSport === 'Todos' ? 'text-[#1F4E5F]' : 'text-[#7FB77E]'} shrink-0`}
                    />
                    <span className="truncate text-xs font-black">Todos los deportes</span>
                  </div>
                  {selectedSport === 'Todos' && (
                    <Check className="h-4 w-4 shrink-0 stroke-[3] text-[#1F4E5F]" />
                  )}
                </button>

                {/* Specific sports */}
                {CIMO_SPORTS_CATALOG.map((s) => {
                  const isSelected =
                    selectedSport.toLowerCase() === s.id.toLowerCase() ||
                    selectedSport.toLowerCase() === s.label.toLowerCase();
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        onSelectSport(s.label);
                        setActiveDropdown(null);
                      }}
                      className={`flex min-h-[48px] cursor-pointer items-center justify-between rounded-2xl p-3.5 text-left transition-all ${
                        isSelected
                          ? 'scale-102 bg-[#7FB77E] font-black text-[#1F4E5F] shadow-lg ring-2 ring-white/40'
                          : 'border border-white/10 bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className={isSelected ? 'text-[#1F4E5F]' : 'text-[#7FB77E]'}>
                          {getSportVectorIcon(s.id, 'w-4 h-4')}
                        </span>
                        <span className="truncate text-xs font-black">{s.label}</span>
                      </div>
                      {isSelected && (
                        <Check className="h-4 w-4 shrink-0 stroke-[3] text-[#1F4E5F]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 📅 CONTENT 2: FECHAS / DÍAS (FULL DYNAMIC MONTH/YEAR CALENDAR) */}
          {activeDropdown === 'day' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-white/70">
                  Elige cuándo quieres entrenar
                </span>
                <span className="rounded-full border border-[#7FB77E]/30 bg-[#7FB77E]/20 px-2.5 py-0.5 text-xs font-black text-[#7FB77E]">
                  {selectedDay}
                </span>
              </div>

              {/* Quick Presets (Clean, No Emojis) */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
                {CLEAN_DATE_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => {
                      onSelectDay(preset.label);
                      setActiveDropdown(null);
                    }}
                    className={`flex min-h-[44px] cursor-pointer flex-col justify-center rounded-xl px-2.5 py-2 text-center text-xs font-black transition-all ${
                      selectedDay === preset.label
                        ? 'bg-[#7FB77E] font-black text-[#1F4E5F] shadow-md'
                        : 'border border-white/10 bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <span className="block leading-tight">{preset.label}</span>
                    <span
                      className={`mt-0.5 block text-[10px] ${selectedDay === preset.label ? 'text-[#1F4E5F]/70' : 'text-white/50'}`}
                    >
                      {preset.sub}
                    </span>
                  </button>
                ))}
              </div>

              {/* Dynamic Month & Year Navigation Header */}
              <div className="flex flex-col gap-3 border-t border-white/10 pt-2">
                <div className="flex items-center justify-between px-1">
                  <span className="flex items-center gap-2 text-sm font-black text-white">
                    <CalendarIcon className="h-4 w-4 text-[#7FB77E]" />
                    <span>
                      {currentMonthName} {currentYear}
                    </span>
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      aria-label="Mes anterior"
                      className="cursor-pointer rounded-xl bg-white/10 p-1.5 text-white transition-colors hover:bg-white/20"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      aria-label="Mes siguiente"
                      className="cursor-pointer rounded-xl bg-white/10 p-1.5 text-white transition-colors hover:bg-white/20"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Day of Week Headers */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {WEEKDAY_HEADERS.map((dayLabel, idx) => (
                    <span key={idx} className="py-1 text-[11px] font-black text-white/50">
                      {dayLabel}
                    </span>
                  ))}

                  {/* Day Cells in Grid */}
                  {calendarGrid.map((item, idx) => {
                    if (item.dayNumber === null) {
                      return <div key={`empty-${idx}`} className="h-9 w-full" />;
                    }

                    const isSelected =
                      selectedDay === item.dateStr ||
                      selectedDay.includes(`${item.dayNumber} ${currentMonthName?.slice(0, 3)}`);

                    return (
                      <button
                        key={`day-${item.dayNumber}-${idx}`}
                        type="button"
                        onClick={() => {
                          onSelectDay(item.dateStr);
                          setActiveDropdown(null);
                        }}
                        className={`flex h-9 w-full cursor-pointer items-center justify-center rounded-xl text-xs font-black transition-all ${
                          isSelected
                            ? 'scale-105 bg-[#7FB77E] font-black text-[#1F4E5F] shadow-md ring-2 ring-white/30'
                            : 'border border-white/5 bg-white/5 text-white hover:bg-white/20'
                        }`}
                      >
                        {item.dayNumber}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 📍 CONTENT 3: CIUDAD / ZONA */}
          {activeDropdown === 'zone' && (
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-white/70">
                  Ubicación & Ciudades de España
                </span>
                <span className="rounded-full border border-[#7FB77E]/30 bg-[#7FB77E]/20 px-2.5 py-0.5 text-xs font-black text-[#7FB77E]">
                  {selectedZone}
                </span>
              </div>

              {/* Search Bar for Cities */}
              <div className="relative">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-white/50" />
                <input
                  type="text"
                  autoFocus
                  value={citySearchQuery}
                  onChange={(e) => setCitySearchQuery(e.target.value)}
                  placeholder="Escribe una ciudad o municipio (ej. Madrid, Pozuelo, Barcelona...)"
                  className="w-full rounded-2xl border border-white/20 bg-black/30 py-2.5 pl-10 pr-9 text-xs font-bold text-white shadow-inner placeholder:text-white/40 focus:border-[#7FB77E] focus:bg-black/50 focus:outline-none"
                />
                {citySearchQuery && (
                  <button
                    type="button"
                    onClick={() => setCitySearchQuery('')}
                    className="absolute right-3 top-3 cursor-pointer p-0.5 text-white/50 hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* 1. STATE A: No query typed -> Solo chips populares (1 solo chip de Toda España) */}
              {!citySearchQuery.trim() && (
                <div className="flex flex-col gap-2 pt-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-white/50">
                    Ciudades Populares
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {POPULAR_CITIES.map((cityName) => {
                      const isToda = cityName === 'Toda España';
                      const isSelected = selectedZone === cityName;
                      return (
                        <button
                          key={cityName}
                          type="button"
                          onClick={() => {
                            onSelectZone(cityName);
                            setActiveDropdown(null);
                          }}
                          className={`flex min-h-[36px] cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                            isSelected
                              ? 'shadow-xs bg-[#7FB77E] font-black text-[#1F4E5F]'
                              : 'border border-white/10 bg-white/10 text-white hover:bg-white/20'
                          }`}
                        >
                          {isToda ? (
                            <Compass
                              className={`h-3.5 w-3.5 ${isSelected ? 'text-[#1F4E5F]' : 'text-[#7FB77E]'}`}
                            />
                          ) : (
                            <MapPin
                              className={`h-3.5 w-3.5 ${isSelected ? 'text-[#1F4E5F]' : 'text-[#7FB77E]'}`}
                            />
                          )}
                          <span>{cityName}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. STATE B: Query typed -> ONLY Exact Suggestions List */}
              {citySearchQuery.trim() && (
                <div className="flex max-h-56 flex-col gap-1 overflow-y-auto pr-1">
                  {filteredCities.length === 0 ? (
                    <div className="py-6 text-center text-xs font-medium text-white/50">
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
                        className={`flex min-h-[44px] cursor-pointer items-center justify-between rounded-xl p-2.5 text-left text-xs font-bold transition-all ${
                          selectedZone === city.name
                            ? 'bg-[#7FB77E] font-black text-[#1F4E5F]'
                            : 'border border-white/5 bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <MapPin
                            className={`h-3.5 w-3.5 ${selectedZone === city.name ? 'text-[#1F4E5F]' : 'text-[#7FB77E]'}`}
                          />
                          <div>
                            <span className="block font-extrabold">{city.name}</span>
                            <span
                              className={`block text-[10px] ${selectedZone === city.name ? 'text-[#1F4E5F]/70' : 'text-white/50'}`}
                            >
                              {city.province} • {city.region}
                            </span>
                          </div>
                        </div>
                        {selectedZone === city.name && (
                          <Check className="h-4 w-4 shrink-0 stroke-[3] text-[#1F4E5F]" />
                        )}
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
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-white/70">
                  Nivel de Intensidad
                </span>
                <span className="rounded-full border border-[#7FB77E]/30 bg-[#7FB77E]/20 px-2.5 py-0.5 text-xs font-black text-[#7FB77E]">
                  {selectedLevel}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-3">
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
                      className={`flex min-h-[48px] cursor-pointer items-center justify-between rounded-2xl p-3.5 text-left transition-all ${
                        isSelected
                          ? 'scale-102 bg-[#7FB77E] font-black text-[#1F4E5F] shadow-lg ring-2 ring-white/40'
                          : 'border border-white/10 bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      <div>
                        <span className="block text-xs font-black">{lvl.label}</span>
                        <span
                          className={`mt-0.5 block text-[10px] ${isSelected ? 'text-[#1F4E5F]/80' : 'text-white/60'}`}
                        >
                          {lvl.desc}
                        </span>
                      </div>
                      {isSelected && (
                        <Check className="h-4 w-4 shrink-0 stroke-[3] text-[#1F4E5F]" />
                      )}
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
