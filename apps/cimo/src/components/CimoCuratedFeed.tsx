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

        {/* Time Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-[#F1F5F9] rounded-2xl border border-slate-200/80 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setTimeFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
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
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
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
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
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

      {/* 🌟 2. Activities Grid (Sports Boarding Pass Aesthetic) */}
      {displayedActivities.length === 0 ? (
        <div className="py-16 text-center text-xs text-[#1F4E5F]/50 flex flex-col items-center gap-2">
          <Trophy className="w-8 h-8 text-[#1F4E5F]/30" />
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
                {/* 1. Cover Photo 16:9 with Cinematic Gradient Overlay */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#1F4E5F]/20">
                  <img
                    src={act.image}
                    alt={act.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=1000';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1F4E5F]/95 via-[#1F4E5F]/40 to-black/20" />

                  {/* Top Floating Badges (Vector Icon + Level) */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                    <span className="px-3 py-1 rounded-full font-black text-xs bg-white/95 text-[#1F4E5F] shadow-xs flex items-center gap-1.5 backdrop-blur-md">
                      {getSportVectorIcon(act.sport, 'w-3.5 h-3.5 text-[#7FB77E]')}
                      <span className="capitalize">{act.sport}</span>
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-black/50 text-white backdrop-blur-md border border-white/10">
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

                  {/* Title and Location on the Photo Overlay */}
                  <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                    <h3 className="font-black text-base leading-tight drop-shadow-xs line-clamp-1">
                      {act.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-white/90 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#7FB77E] shrink-0" />
                      <span className="truncate font-medium">{act.location}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Card Body with Rich Color Contrasts (Zero Monotonous White) */}
                <div className="p-4 sm:p-5 flex flex-col gap-3.5 flex-1 justify-between text-[#1F4E5F]">
                  {/* Captain & Date Row */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        {act.captain.avatarUrl ? (
                          <img
                            src={act.captain.avatarUrl}
                            alt={act.captain.name}
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-2xs"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-[#1F4E5F]/10 text-[#1F4E5F] font-black text-xs flex items-center justify-center">
                            {act.captain.name.charAt(0)}
                          </div>
                        )}
                        <span className="absolute -bottom-0.5 -right-0.5 bg-[#7FB77E] text-white p-0.5 rounded-full border border-white">
                          <ShieldCheck className="w-2.5 h-2.5" />
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-black text-[#7FB77E] uppercase tracking-wider block leading-none">
                          Capitán
                        </span>
                        <span className="text-xs font-black text-[#1F4E5F] mt-0.5 block">
                          {act.captain.name}{act.captain.age ? `, ${act.captain.age}a` : ''}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-1.5 text-xs font-black text-[#1F4E5F]">
                        <Calendar className="w-3.5 h-3.5 text-[#7FB77E]" />
                        <span>{act.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-[#1F4E5F]/60 justify-end mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{act.time} h</span>
                      </div>
                    </div>
                  </div>

                  {/* Logistics Detail Pill */}
                  {act.paceOrDetails && (
                    <div className="flex items-center gap-2 text-xs font-bold text-[#1F4E5F] bg-[#F8FAFC] px-3.5 py-2 rounded-xl border border-slate-200/80">
                      <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="truncate leading-none">{act.paceOrDetails}</span>
                    </div>
                  )}

                  {/* Warm Social Third Half Box (Breaks away from white) */}
                  {act.thirdHalf?.enabled && (
                    <div className="flex items-center justify-between gap-2 text-xs font-bold text-amber-900 bg-[#FFFBEB] px-3 py-2 rounded-xl border border-[#FDE68A] shadow-2xs">
                      <div className="flex items-center gap-2 truncate">
                        <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                          {getThirdHalfVectorIcon(act.thirdHalf.type, 'w-3.5 h-3.5 text-amber-700')}
                        </div>
                        <div className="truncate">
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-800/80 block leading-none">
                            Tercer Tiempo
                          </span>
                          <span className="text-xs font-extrabold text-[#78350F] truncate block mt-0.5">
                            {act.thirdHalf.venue}
                          </span>
                        </div>
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-wider text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded-full shrink-0">
                        Social
                      </span>
                    </div>
                  )}

                  {/* Footer: Crew Avatars + Action Button */}
                  <div className="flex items-center justify-between pt-1 mt-auto gap-2">
                    <div className="flex items-center gap-2">
                      <CrewAvatarGroup members={act.currentMembers} size="sm" />
                      <div>
                        <span className="text-xs font-black text-[#1F4E5F] block leading-none">
                          {act.currentMembers.length}/{act.maxMembers}
                        </span>
                        <span className="text-[10px] font-bold text-[#7FB77E] block mt-0.5">
                          {isFull ? 'Completo' : `${remainingSpots} plaza(s)`}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isFull && !isJoined}
                      onClick={(e) => {
                        e.stopPropagation();
                        onJoinActivity(act.id);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ${
                        isJoined
                          ? 'bg-[#7FB77E] text-white shadow-xs'
                          : isFull
                          ? 'bg-[#1F4E5F]/10 text-[#1F4E5F]/50 cursor-not-allowed'
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
