import React, { useState } from 'react';
import {
  Activity,
  Beer,
  Calendar,
  Check,
  ChevronRight,
  Coffee,
  Flame,
  Heart,
  MapPin,
  Mountain,
  Sun,
  Target,
  Trophy,
  Zap,
} from 'lucide-react';
import { CrewAvatarGroup, type ActivityCardData } from '@loopdev/public-blocks';

export interface CimoCuratedFeedProps {
  activities: ActivityCardData[];
  selectedActivityId: string;
  onSelectActivity: (id: string) => void;
  onJoinActivity: (id: string) => void;
  onNavigateToProfile?: (athleteId: string) => void;
}

// Vector Sport Icon Helper
function getSportVectorIcon(sport: string, className = 'w-3.5 h-3.5') {
  const norm = sport.toLowerCase();
  if (norm.includes('run')) return <Activity className={className} />;
  if (norm.includes('pad') || norm.includes('pádel')) return <Target className={className} />;
  if (norm.includes('hik') || norm.includes('trek')) return <Mountain className={className} />;
  return <Flame className={className} />;
}

// Vector Third Half Icon Helper
function getThirdHalfVectorIcon(type?: string, className = 'w-3.5 h-3.5') {
  switch (type) {
    case 'beer':
      return <Beer className={className} />;
    case 'picnic':
      return <Sun className={className} />;
    case 'cafe':
    default:
      return <Coffee className={className} />;
  }
}

export const CimoCuratedFeed: React.FC<CimoCuratedFeedProps> = ({
  activities,
  selectedActivityId,
  onSelectActivity,
  onJoinActivity,
}) => {
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'weekend'>('all');
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fId) => fId !== id) : [...prev, id]));
  };

  const todayCount = activities.filter((a) => a.date.toLowerCase().includes('hoy')).length;
  const weekendCount = activities.filter(
    (a) => a.date.toLowerCase().includes('sábado') || a.date.toLowerCase().includes('domingo'),
  ).length;

  const displayedActivities = activities.filter((act) => {
    if (timeFilter === 'today') return act.date.toLowerCase().includes('hoy');
    if (timeFilter === 'weekend') {
      return (
        act.date.toLowerCase().includes('sábado') || act.date.toLowerCase().includes('domingo')
      );
    }
    return true;
  });

  return (
    <div className="border-[#1F4E5F]/12 flex flex-col gap-6 rounded-3xl border bg-[#FCFDFD] p-5 text-[#1F4E5F] shadow-[0_4px_24px_-4px_rgba(31,78,95,0.05)] sm:p-7">
      {/* 🌟 1. Header with Editorial Title & Segmented Control */}
      <div className="border-[#1F4E5F]/8 flex flex-col justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center">
        <div>
          <span className="block text-[10px] font-black uppercase tracking-wider text-[#7FB77E]">
            Comunidad Deportiva Madrid
          </span>
          <h2 className="mt-0.5 text-xl font-black tracking-tight text-[#1F4E5F] sm:text-2xl">
            Explorar Entrenamientos
          </h2>
        </div>

        {/* Time Filter Segmented Control with accessible touch height */}
        <div className="flex min-h-[44px] shrink-0 items-center gap-1 self-start rounded-2xl border border-slate-200/80 bg-slate-100 p-1 sm:self-auto">
          <button
            type="button"
            onClick={() => setTimeFilter('all')}
            className={`min-h-[36px] cursor-pointer rounded-xl px-3.5 py-2 text-xs font-black transition-all ${
              timeFilter === 'all'
                ? 'shadow-xs bg-[#1F4E5F] text-white'
                : 'text-slate-600 hover:text-[#1F4E5F]'
            }`}
          >
            Todos ({activities.length})
          </button>
          <button
            type="button"
            onClick={() => setTimeFilter('today')}
            className={`flex min-h-[36px] cursor-pointer items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-black transition-all ${
              timeFilter === 'today'
                ? 'shadow-xs bg-[#1F4E5F] text-white'
                : 'text-slate-600 hover:text-[#1F4E5F]'
            }`}
          >
            <Flame className="h-3.5 w-3.5 text-amber-500" />
            <span>Hoy ({todayCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setTimeFilter('weekend')}
            className={`flex min-h-[36px] cursor-pointer items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-black transition-all ${
              timeFilter === 'weekend'
                ? 'shadow-xs bg-[#1F4E5F] text-white'
                : 'text-slate-600 hover:text-[#1F4E5F]'
            }`}
          >
            <Calendar className="h-3.5 w-3.5 text-[#7FB77E]" />
            <span>Finde ({weekendCount})</span>
          </button>
        </div>
      </div>

      {/* 🌟 2. Hero Featured Callout Banner in Deep Petrol Teal (#1F4E5F) */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-[#1F4E5F] p-4 text-white shadow-md sm:flex-row sm:items-center sm:p-5">
        <div className="flex items-center gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#7FB77E]/30 bg-[#7FB77E]/20 text-[#7FB77E]">
            <Flame className="h-5 w-5 fill-[#7FB77E]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="py-0.2 rounded-full bg-[#7FB77E]/20 px-2 text-[10px] font-black uppercase tracking-wider text-[#7FB77E]">
                Quedada Destacada
              </span>
              <span className="text-xs font-bold text-slate-300">Mañana • 07:30h</span>
            </div>
            <h3 className="mt-0.5 text-sm font-black text-white sm:text-base">
              Rodaje 8.5K al amanecer en Retiro + Tercer Tiempo en Café Murillo
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSelectActivity(activities[0]?.id ?? 'act_1')}
          className="shadow-xs flex min-h-[40px] shrink-0 cursor-pointer items-center gap-1.5 self-start rounded-xl bg-[#7FB77E] px-4 py-2 text-xs font-black text-[#1F4E5F] transition-all hover:bg-[#6ea26d] active:scale-95 sm:self-center"
        >
          <span>Ver Convocatoria</span>
          <ChevronRight className="h-3.5 w-3.5 stroke-[3]" />
        </button>
      </div>

      {/* 🌟 3. Refactored Activities Grid (Clean Heuristic Card Anatomy) */}
      {displayedActivities.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-center text-xs text-slate-400">
          <Trophy className="h-8 w-8 text-slate-300" />
          <p className="font-bold">No hay entrenamientos para este filtro.</p>
          <p>Prueba a seleccionar "Todos" o cambia tu búsqueda en la barra superior.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {displayedActivities.map((act) => {
            const isFull = act.currentMembers.length >= act.maxMembers;
            const isJoined = Boolean(act.isJoined);
            const isSelected = act.id === selectedActivityId;
            const isFav = favorites.includes(act.id);
            const remainingSpots = act.maxMembers - act.currentMembers.length;

            return (
              <div
                key={act.id}
                onClick={() => onSelectActivity(act.id)}
                className={`shadow-xs group flex cursor-pointer flex-col justify-between overflow-hidden rounded-3xl border bg-white transition-all duration-200 hover:shadow-md ${
                  isSelected
                    ? 'border-[#7FB77E] shadow-md ring-2 ring-[#7FB77E]/25'
                    : 'border-slate-200/90 hover:border-[#7FB77E]/40'
                }`}
              >
                {/* 1. Cover Photo 160px with Tags & Favorite Button */}
                <div className="relative h-40 w-full overflow-hidden bg-slate-100 sm:h-44">
                  <img
                    src={act.image}
                    alt={act.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=1000';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Top Tags */}
                  <div className="absolute left-3 top-3 flex flex-wrap items-center gap-1.5">
                    <span className="shadow-xs flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-black text-[#1F4E5F] backdrop-blur-md">
                      {getSportVectorIcon(act.sport, 'w-3.5 h-3.5 text-[#7FB77E]')}
                      <span className="capitalize">{act.sport}</span>
                    </span>
                    <span className="py-0.8 rounded-full border border-white/10 bg-black/60 px-2 text-[10px] font-black text-white backdrop-blur-md">
                      {act.level}
                    </span>
                  </div>

                  {/* Favorite Heart Button */}
                  <button
                    type="button"
                    onClick={(e) => toggleFavorite(e, act.id)}
                    aria-label="Guardar entreno"
                    className="absolute right-3 top-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60"
                  >
                    <Heart
                      className={`h-4 w-4 transition-colors ${
                        isFav ? 'fill-rose-500 text-rose-500' : 'fill-transparent text-white'
                      }`}
                    />
                  </button>

                  {/* Title on the Cover */}
                  <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                    <h3 className="drop-shadow-xs line-clamp-1 text-base font-black leading-tight">
                      {act.title}
                    </h3>
                  </div>
                </div>

                {/* 2. Refactored Card Body (Clean Streamlined Anatomy) */}
                <div className="flex flex-1 flex-col justify-between gap-3 p-4 text-[#1F4E5F] sm:p-5">
                  {/* Logistics Row: Location & Date/Time */}
                  <div className="flex flex-col gap-1.5 text-xs">
                    <div className="flex items-center justify-between gap-2 font-bold text-slate-600">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-[#7FB77E]" />
                        <span className="truncate">{act.location}</span>
                      </div>
                      <div className="flex shrink-0 items-center gap-1 font-black text-[#1F4E5F]">
                        <Calendar className="h-3.5 w-3.5 text-[#7FB77E]" />
                        <span>
                          {act.date}, {act.time}h
                        </span>
                      </div>
                    </div>

                    {/* Pace / Details Line */}
                    {act.paceOrDetails && (
                      <div className="flex items-center gap-1.5 font-medium text-slate-600">
                        <Zap className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                        <span>
                          Ritmo: <strong>{act.paceOrDetails}</strong>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 3. Compact 1-Line Third Half Pill (Social Blue) */}
                  {act.thirdHalf?.enabled && (
                    <div className="flex items-center justify-between gap-2 rounded-xl border border-[#1F4E5F]/15 bg-[#EEF2F2]/70 px-3 py-1.5 text-xs font-bold text-[#1F4E5F]">
                      <div className="flex items-center gap-1.5 truncate">
                        {getThirdHalfVectorIcon(
                          act.thirdHalf.type,
                          'w-3.5 h-3.5 text-[#1F4E5F] shrink-0',
                        )}
                        <span className="truncate">
                          <strong>Tercer Tiempo:</strong> {act.thirdHalf.venue}
                        </span>
                      </div>
                      <span className="py-0.2 shrink-0 rounded-md bg-[#1F4E5F] px-1.5 text-[9px] font-black uppercase text-white">
                        Social
                      </span>
                    </div>
                  )}

                  {/* 4. Footer: Crew Avatars + Fixed-Width Anti-CLS Action Button */}
                  <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-2">
                    <div className="flex items-center gap-2">
                      <CrewAvatarGroup members={act.currentMembers} size="sm" />
                      <div>
                        <span className="block text-xs font-black leading-none text-[#1F4E5F]">
                          {act.currentMembers.length}/{act.maxMembers}
                        </span>
                        <span className="mt-0.5 block text-[10px] font-bold text-[#7FB77E]">
                          {isFull ? 'Completo' : `${remainingSpots} libre(s)`}
                        </span>
                      </div>
                    </div>

                    {/* Fixed Width Button (w-28 text-center) to prevent Cumulative Layout Shift (CLS) */}
                    <button
                      type="button"
                      disabled={isFull && !isJoined}
                      onClick={(e) => {
                        e.stopPropagation();
                        onJoinActivity(act.id);
                      }}
                      className={`shadow-xs flex min-h-[38px] w-28 cursor-pointer items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-black transition-all ${
                        isJoined
                          ? 'shadow-xs bg-[#7FB77E] text-white'
                          : isFull
                            ? 'cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400'
                            : 'shadow-xs bg-[#7FB77E] text-white hover:bg-[#6ea86d] active:scale-95'
                      }`}
                    >
                      {isJoined ? (
                        <>
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                          <span>Unido</span>
                        </>
                      ) : isFull ? (
                        <span>Lleno</span>
                      ) : (
                        <>
                          <span>Unirme</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
