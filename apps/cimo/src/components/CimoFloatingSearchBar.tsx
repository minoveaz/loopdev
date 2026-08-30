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
import { SPANISH_CITIES } from '../data/spanishCitiesCatalog';

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

const sportsCatalog = [
  { id: 'Todos', label: 'Todos los deportes', emoji: '⭐' },
  { id: 'running', label: 'Running', emoji: '🏃' },
  { id: 'padel', label: 'Pádel', emoji: '🎾' },
  { id: 'hiking', label: 'Hiking / Trekking', emoji: '🥾' },
  { id: 'crossfit', label: 'Crossfit / WOD', emoji: '🏋️' },
  { id: 'cycling', label: 'Ciclismo', emoji: '🚴' },
  { id: 'yoga', label: 'Yoga & Pilates', emoji: '🧘' },
  { id: 'natacion', label: 'Natación', emoji: '🏊' },
];

const quickDays = [
  { label: 'Cualquier día', sub: 'Sin límite', value: 'Cualquier día' },
  { label: '🔥 Hoy', sub: 'Entrenos hoy', value: 'Hoy' },
  { label: '⚡ Mañana', sub: 'Próximas 24h', value: 'Mañana' },
  { label: '⭐ Este finde', sub: 'Sáb & Dom', value: 'Este fin de semana' },
  { label: '🗓️ Esta semana', sub: 'Lunes a Viernes', value: 'Esta semana' },
];

const popularCities = [
  'Toda España',
  'Madrid',
  'Barcelona',
  'Valencia',
  'Sevilla',
  'Málaga',
  'Bilbao',
  'Zaragoza',
  'Granada',
  'Alicante',
];

const levelsCatalog = [
  { id: 'Cualquier nivel', label: 'Cualquier nivel', desc: 'Ver todos los ritmos y categorías' },
  { id: 'Principiante', label: 'Principiante', desc: 'Iniciación y ritmos muy suaves' },
  { id: 'Intermedio', label: 'Intermedio', desc: 'Ritmo constante y regular' },
  { id: 'Avanzado', label: 'Avanzado', desc: 'Intensidad alta y series exigentes' },
  { id: 'Todos los niveles', label: 'Todos los niveles', desc: 'Grupos abiertos y escalables' },
];

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
      return SPANISH_CITIES.slice(0, 10);
    }
    return SPANISH_CITIES.filter((city) => {
      const name = normalizeStr(city.name);
      const prov = normalizeStr(city.province);
      const reg = normalizeStr(city.region);
      const matchesCp = city.postalCodes?.some((cp) => cp.includes(q));
      return name.includes(q) || prov.includes(q) || reg.includes(q) || matchesCp;
    }).slice(0, 12);
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

  const currentSportEmoji = sportsCatalog.find((s) => s.id.toLowerCase() === selectedSport.toLowerCase())?.emoji ?? '🏃';

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl">
      {/* Floating Capsule in Header */}
      <div className="bg-white border border-[#1F4E5F]/15 rounded-full pl-3 pr-1.5 py-1 shadow-xs hover:shadow-md transition-all duration-200 flex items-center justify-between text-[#1F4E5F]">
        {/* 🏃 1. Sport Segment */}
        <div
          onClick={() => setActiveDropdown(activeDropdown === 'sport' ? null : 'sport')}
          className={`px-3 py-1 rounded-full cursor-pointer transition-colors relative ${
            activeDropdown === 'sport' ? 'bg-[#F7F7F7]' : 'hover:bg-[#F7F7F7]/60'
          }`}
        >
          <span className="text-[9px] font-black uppercase tracking-wider text-[#1F4E5F]/50 block leading-none">
            Deporte
          </span>
          <span className="text-xs font-extrabold text-[#1F4E5F] truncate block mt-0.5 max-w-[90px]">
            {selectedSport === 'Todos' ? 'Todos' : `${currentSportEmoji} ${selectedSport}`}
          </span>

          {/* Sport Popover */}
          {activeDropdown === 'sport' && (
            <div
              className="absolute top-full left-0 mt-2 w-72 bg-white border border-[#1F4E5F]/15 rounded-3xl p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 flex flex-col gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-2 pt-1 pb-1 border-b border-[#1F4E5F]/10">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]/60">
                  Selecciona deporte
                </span>
                <span className="text-[10px] font-extrabold text-[#00B894]">{selectedSport}</span>
              </div>

              <div className="grid grid-cols-2 gap-1.5 max-h-64 overflow-y-auto">
                {sportsCatalog.map((s) => {
                  const isSelected = selectedSport.toLowerCase() === s.id.toLowerCase() || (selectedSport === 'Todos' && s.id === 'Todos');
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        onSelectSport(s.id === 'Todos' ? 'Todos' : s.label);
                        setActiveDropdown(null);
                      }}
                      className={`p-2.5 rounded-2xl text-left transition-all cursor-pointer flex items-center justify-between gap-1.5 ${
                        isSelected
                          ? 'bg-[#1F4E5F] text-white shadow-xs font-black'
                          : 'bg-[#F7F7F7] hover:bg-[#00B894]/10 text-[#1F4E5F]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-base">{s.emoji}</span>
                        <span className="text-xs font-extrabold truncate">{s.label}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#00B894] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="h-5 w-[1px] bg-[#1F4E5F]/10 shrink-0" />

        {/* 📅 2. Dates Segment (Quick Chips + Interactive Calendar) */}
        <div
          onClick={() => setActiveDropdown(activeDropdown === 'day' ? null : 'day')}
          className={`px-3 py-1 rounded-full cursor-pointer transition-colors relative ${
            activeDropdown === 'day' ? 'bg-[#F7F7F7]' : 'hover:bg-[#F7F7F7]/60'
          }`}
        >
          <span className="text-[9px] font-black uppercase tracking-wider text-[#1F4E5F]/50 block leading-none">
            Cuándo
          </span>
          <span className="text-xs font-extrabold text-[#1F4E5F] truncate block mt-0.5 max-w-[100px]">
            {selectedDay}
          </span>

          {/* Dates Popover with Calendar */}
          {activeDropdown === 'day' && (
            <div
              className="absolute top-full left-0 sm:-left-12 mt-2 w-80 bg-white border border-[#1F4E5F]/15 rounded-3xl p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 flex flex-col gap-3.5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#1F4E5F]/10">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]/60 flex items-center gap-1">
                  <CalendarIcon className="w-3.5 h-3.5 text-[#00B894]" />
                  <span>Día del entrenamiento</span>
                </span>
                {selectedDay !== 'Cualquier día' && (
                  <button
                    type="button"
                    onClick={() => onSelectDay('Cualquier día')}
                    className="text-[10px] font-extrabold text-[#1F4E5F]/60 hover:text-[#1F4E5F] cursor-pointer"
                  >
                    Resetear
                  </button>
                )}
              </div>

              {/* Quick Presets */}
              <div className="grid grid-cols-2 gap-1.5">
                {quickDays.map((qd) => {
                  const isSelected = selectedDay === qd.value;
                  return (
                    <button
                      key={qd.value}
                      type="button"
                      onClick={() => {
                        onSelectDay(qd.value);
                        setActiveDropdown(null);
                      }}
                      className={`p-2 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#1F4E5F] text-white shadow-xs font-black'
                          : 'bg-[#F7F7F7] hover:bg-[#00B894]/10 text-[#1F4E5F]'
                      }`}
                    >
                      <span className="text-xs font-extrabold">{qd.label}</span>
                      {isSelected && <Check className="w-3 h-3 text-[#00B894] shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Visual Interactive Month Calendar */}
              <div className="pt-2 border-t border-[#1F4E5F]/10 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]">
                    Septiembre 2026
                  </span>
                  <span className="text-[9px] text-[#00B894] font-bold">Haz clic en un día</span>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center">
                  {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d) => (
                    <span key={d} className="text-[9px] font-black text-[#1F4E5F]/50">
                      {d}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((cd, idx) => {
                    if (cd.empty) {
                      return <div key={`empty-${idx}`} className="h-6" />;
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
                        className={`h-6 rounded-lg text-[10px] font-extrabold transition-all flex items-center justify-center cursor-pointer ${
                          isSelected
                            ? 'bg-[#00B894] text-white font-black scale-105 shadow-xs'
                            : 'bg-[#F7F7F7] hover:bg-[#00B894]/20 text-[#1F4E5F]'
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
        </div>

        <div className="h-5 w-[1px] bg-[#1F4E5F]/10 shrink-0 hidden sm:block" />

        {/* 📍 3. City & Spain Autocomplete Segment */}
        <div
          onClick={() => setActiveDropdown(activeDropdown === 'zone' ? null : 'zone')}
          className={`px-3 py-1 rounded-full cursor-pointer transition-colors relative hidden sm:block ${
            activeDropdown === 'zone' ? 'bg-[#F7F7F7]' : 'hover:bg-[#F7F7F7]/60'
          }`}
        >
          <span className="text-[9px] font-black uppercase tracking-wider text-[#1F4E5F]/50 block leading-none">
            Ciudad
          </span>
          <span className="text-xs font-extrabold text-[#1F4E5F] truncate block mt-0.5 max-w-[100px]">
            {selectedZone}
          </span>

          {/* City Search Popover */}
          {activeDropdown === 'zone' && (
            <div
              className="absolute top-full left-0 sm:-left-20 mt-2 w-84 bg-white border border-[#1F4E5F]/15 rounded-3xl p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 flex flex-col gap-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-1 border-b border-[#1F4E5F]/10">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]/60 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#00B894]" />
                  <span>Buscar cualquier ciudad o barrio</span>
                </span>
                <span className="text-[10px] font-extrabold text-[#00B894] truncate max-w-[110px]">
                  {selectedZone}
                </span>
              </div>

              {/* Real-Time Live Search Input */}
              <div className="relative">
                <input
                  type="text"
                  value={citySearchQuery}
                  onChange={(e) => setCitySearchQuery(e.target.value)}
                  placeholder="Escribe ciudad, barrio o municipio..."
                  className="w-full pl-8 pr-7 py-2 bg-[#F7F7F7] focus:bg-white rounded-xl border border-[#1F4E5F]/20 focus:border-[#00B894] focus:ring-2 focus:ring-[#00B894]/20 text-xs font-bold text-[#1F4E5F] outline-none shadow-2xs"
                  autoFocus
                />
                <Search className="w-3.5 h-3.5 text-[#1F4E5F]/40 absolute left-2.5 top-2.5" />
                {citySearchQuery && (
                  <button
                    type="button"
                    onClick={() => setCitySearchQuery('')}
                    className="p-1 text-[#1F4E5F]/40 hover:text-[#1F4E5F] absolute right-2 top-2 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Popular Cities Chips when not searching */}
              {!citySearchQuery.trim() && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]/50">
                    Ciudades Populares
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {popularCities.map((pc) => {
                      const isSelected = selectedZone.toLowerCase() === pc.toLowerCase();
                      return (
                        <button
                          key={pc}
                          type="button"
                          onClick={() => {
                            onSelectZone(pc);
                            setActiveDropdown(null);
                          }}
                          className={`px-2.5 py-1 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#1F4E5F] text-white shadow-xs'
                              : 'bg-[#F7F7F7] hover:bg-[#00B894]/10 text-[#1F4E5F]'
                          }`}
                        >
                          {pc}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Filtered Autocomplete Cities List */}
              <div className="flex flex-col gap-1 max-h-48 overflow-y-auto pt-1">
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
                      className={`px-3 py-2 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#1F4E5F] text-white shadow-xs font-black'
                          : 'bg-[#F7F7F7] hover:bg-[#00B894]/10 text-[#1F4E5F]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <MapPin className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#00B894]' : 'text-[#7FB77E]'}`} />
                        <div className="truncate">
                          <span className="text-xs font-extrabold block truncate">{c.name}</span>
                          <span className={`text-[10px] block truncate ${isSelected ? 'text-white/70' : 'text-[#1F4E5F]/50'}`}>
                            {c.province} • {c.region}
                          </span>
                        </div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#00B894] shrink-0" />}
                    </button>
                  );
                })}

                {/* Custom write-in option if typing something unique */}
                {citySearchQuery.trim() && !filteredCities.some((c) => c.name.toLowerCase() === citySearchQuery.toLowerCase()) && (
                  <button
                    type="button"
                    onClick={() => {
                      onSelectZone(citySearchQuery.trim());
                      setActiveDropdown(null);
                      setCitySearchQuery('');
                    }}
                    className="p-2.5 rounded-xl text-left text-xs font-black text-[#00B894] bg-[#00B894]/10 hover:bg-[#00B894]/20 border border-dashed border-[#00B894] cursor-pointer flex items-center gap-2"
                  >
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Buscar en: "{citySearchQuery.trim()}"</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-5 w-[1px] bg-[#1F4E5F]/10 shrink-0 hidden lg:block" />

        {/* ⚡ 4. Level Segment */}
        <div
          onClick={() => setActiveDropdown(activeDropdown === 'level' ? null : 'level')}
          className={`px-3 py-1 rounded-full cursor-pointer transition-colors relative hidden lg:block ${
            activeDropdown === 'level' ? 'bg-[#F7F7F7]' : 'hover:bg-[#F7F7F7]/60'
          }`}
        >
          <span className="text-[9px] font-black uppercase tracking-wider text-[#1F4E5F]/50 block leading-none">
            Nivel
          </span>
          <span className="text-xs font-extrabold text-[#1F4E5F] truncate block mt-0.5 max-w-[95px]">
            {selectedLevel}
          </span>

          {/* Level Popover */}
          {activeDropdown === 'level' && (
            <div
              className="absolute top-full right-0 mt-2 w-72 bg-white border border-[#1F4E5F]/15 rounded-3xl p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 flex flex-col gap-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-2 pt-1 pb-1 border-b border-[#1F4E5F]/10">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]/60">
                  Nivel técnico
                </span>
                <span className="text-[10px] font-extrabold text-[#00B894]">{selectedLevel}</span>
              </div>

              {levelsCatalog.map((l) => {
                const isSelected = selectedLevel === l.id;
                return (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => {
                      onSelectLevel(l.id);
                      setActiveDropdown(null);
                    }}
                    className={`p-2.5 rounded-2xl text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#1F4E5F] text-white shadow-xs font-black'
                        : 'bg-[#F7F7F7] hover:bg-[#00B894]/10 text-[#1F4E5F]'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-extrabold block">{l.label}</span>
                      <span className={`text-[10px] block ${isSelected ? 'text-white/75' : 'text-[#1F4E5F]/60'}`}>
                        {l.desc}
                      </span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#00B894] shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          )}
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
    </div>
  );
};
