import React, { useState } from 'react';
import {
  Activity,
  Beer,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Coffee,
  Compass,
  Flame,
  Heart,
  Layers,
  MapPin,
  Mountain,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  Timer,
  Trophy,
  Users,
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
  onNavigateToProfile,
}) => {
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'weekend'>('all');
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fId) => fId !== id) : [...prev, id]
    );
  };

  const todayCount = activities.filter((a) => a.date.toLowerCase().includes('hoy')).length;
  const weekendCount = activities.filter(
    (a) => a.date.toLowerCase().includes('sábado') || a.date.toLowerCase().includes('domingo')
  ).length;

  const displayedActivities = activities.filter((act) => {
    if (timeFilter === 'today') return act.date.toLowerCase().includes('hoy');
    if (timeFilter === 'weekend') {
      return act.date.toLowerCase().includes('sábado') || act.date.toLowerCase().includes('domingo');
    }
    return true;
  });

  return (
    <div className="bg-[#FCFDFD] border border-[#1F4E5F]/12 rounded-3xl p-5 sm:p-7 shadow-[0_4px_24px_-4px_rgba(31,78,95,0.05)] flex flex-col gap-6 text-[#1F4E5F]">
      {/* 🌟 1. Header with Editorial Title & Segmented Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1F4E5F]/8">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#7FB77E] block">
            Comunidad Deportiva Madrid
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#1F4E5F] mt-0.5 tracking-tight">
            Explorar Entrenamientos
          </h2>
        </div>

        {/* Time Filter Segmented Control with accessible touch height */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200/80 shrink-0 self-start sm:self-auto min-h-[44px]">
          <button
            type="button"
            onClick={() => setTimeFilter('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer min-h-[36px] ${
              timeFilter === 'all'
                ? 'bg-[#1F4E5F] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#1F4E5F]'
            }`}
          >
            Todos ({activities.length})
          </button>
          <button
            type="button"
            onClick={() => setTimeFilter('today')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 min-h-[36px] ${
              timeFilter === 'today'
                ? 'bg-[#1F4E5F] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#1F4E5F]'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Hoy ({todayCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setTimeFilter('weekend')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 min-h-[36px] ${
              timeFilter === 'weekend'
                ? 'bg-[#1F4E5F] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#1F4E5F]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-[#7FB77E]" />
            <span>Finde ({weekendCount})</span>
          </button>
        </div>
      </div>

      {/* 🌟 2. Hero Featured Callout Banner in Deep Petrol Teal (#1F4E5F) */}
      <div className="bg-[#1F4E5F] text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md border border-white/10">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#7FB77E]/20 text-[#7FB77E] flex items-center justify-center shrink-0 border border-[#7FB77E]/30">
            <Flame className="w-5 h-5 fill-[#7FB77E]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#7FB77E] bg-[#7FB77E]/20 px-2 py-0.2 rounded-full">
                Quedada Destacada
              </span>
              <span className="text-xs font-bold text-slate-300">
                Mañana • 07:30h
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-black text-white mt-0.5">
              Rodaje 8.5K al amanecer en Retiro + Tercer Tiempo en Café Murillo
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSelectActivity(activities[0]?.id ?? 'act_1')}
          className="px-4 py-2 rounded-xl bg-[#7FB77E] hover:bg-[#6ea26d] text-[#1F4E5F] text-xs font-black transition-all flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer active:scale-95 self-start sm:self-center min-h-[40px]"
        >
          <span>Ver Convocatoria</span>
          <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
        </button>
      </div>

      {/* 🌟 3. Refactored Activities Grid (Clean Heuristic Card Anatomy) */}
      {displayedActivities.length === 0 ? (
        <div className="py-16 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
          <Trophy className="w-8 h-8 text-slate-300" />
          <p className="font-bold">No hay entrenamientos para este filtro.</p>
          <p>Prueba a seleccionar "Todos" o cambia tu búsqueda en la barra superior.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                className={`bg-white rounded-3xl overflow-hidden border transition-all duration-200 cursor-pointer group flex flex-col justify-between shadow-xs hover:shadow-md ${
                  isSelected
                    ? 'border-[#7FB77E] ring-2 ring-[#7FB77E]/25 shadow-md'
                    : 'border-slate-200/90 hover:border-[#7FB77E]/40'
                }`}
              >
                {/* 1. Cover Photo 160px with Tags & Favorite Button */}
                <div className="relative h-40 sm:h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={act.image}
                    alt={act.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=1000';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Top Tags */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                    <span className="px-2.5 py-1 rounded-full font-black text-xs bg-white/95 text-[#1F4E5F] shadow-xs flex items-center gap-1.5 backdrop-blur-md">
                      {getSportVectorIcon(act.sport, 'w-3.5 h-3.5 text-[#7FB77E]')}
                      <span className="capitalize">{act.sport}</span>
                    </span>
                    <span className="px-2 py-0.8 rounded-full text-[10px] font-black bg-black/60 text-white backdrop-blur-md border border-white/10">
                      {act.level}
                    </span>
                  </div>

                  {/* Favorite Heart Button */}
                  <button
                    type="button"
                    onClick={(e) => toggleFavorite(e, act.id)}
                    aria-label="Guardar entreno"
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        isFav ? 'fill-rose-500 text-rose-500' : 'fill-transparent text-white'
                      }`}
                    />
                  </button>

                  {/* Title on the Cover */}
                  <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                    <h3 className="font-black text-base leading-tight drop-shadow-xs line-clamp-1">
                      {act.title}
                    </h3>
                  </div>
                </div>

                {/* 2. Refactored Card Body (Clean Streamlined Anatomy) */}
                <div className="p-4 sm:p-5 flex flex-col gap-3 flex-1 justify-between text-[#1F4E5F]">
                  {/* Logistics Row: Location & Date/Time */}
                  <div className="flex flex-col gap-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-600 font-bold gap-2">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-[#7FB77E] shrink-0" />
                        <span className="truncate">{act.location}</span>
                      </div>
                      <div className="flex items-center gap-1 font-black text-[#1F4E5F] shrink-0">
                        <Calendar className="w-3.5 h-3.5 text-[#7FB77E]" />
                        <span>{act.date}, {act.time}h</span>
                      </div>
                    </div>

                    {/* Pace / Details Line */}
                    {act.paceOrDetails && (
                      <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                        <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>Ritmo: <strong>{act.paceOrDetails}</strong></span>
                      </div>
                    )}
                  </div>

                  {/* 3. Compact 1-Line Third Half Pill (Social Blue) */}
                  {act.thirdHalf?.enabled && (
                    <div className="flex items-center justify-between gap-2 text-xs font-bold text-[#1F4E5F] bg-[#EEF2F2]/70 px-3 py-1.5 rounded-xl border border-[#1F4E5F]/15">
                      <div className="flex items-center gap-1.5 truncate">
                        {getThirdHalfVectorIcon(act.thirdHalf.type, 'w-3.5 h-3.5 text-[#1F4E5F] shrink-0')}
                        <span className="truncate">
                          <strong>Tercer Tiempo:</strong> {act.thirdHalf.venue}
                        </span>
                      </div>
                      <span className="text-[9px] font-black uppercase text-white bg-[#1F4E5F] px-1.5 py-0.2 rounded-md shrink-0">
                        Social
                      </span>
                    </div>
                  )}

                  {/* 4. Footer: Crew Avatars + Fixed-Width Anti-CLS Action Button */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-2">
                    <div className="flex items-center gap-2">
                      <CrewAvatarGroup members={act.currentMembers} size="sm" />
                      <div>
                        <span className="text-xs font-black text-[#1F4E5F] block leading-none">
                          {act.currentMembers.length}/{act.maxMembers}
                        </span>
                        <span className="text-[10px] font-bold text-[#7FB77E] block mt-0.5">
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
                      className={`w-28 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer min-h-[38px] ${
                        isJoined
                          ? 'bg-[#7FB77E] text-white shadow-xs'
                          : isFull
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                          : 'bg-[#1F4E5F] hover:bg-[#183e4c] text-white active:scale-95'
                      }`}
                    >
                      {isJoined ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Unido</span>
                        </>
                      ) : isFull ? (
                        <span>Lleno</span>
                      ) : (
                        <>
                          <span>Unirme</span>
                          <ChevronRight className="w-3.5 h-3.5" />
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
