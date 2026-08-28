import React, { useState } from 'react';
import { Calendar, Check, ChevronRight, Clock, Heart, MapPin, Sparkles, Trophy } from 'lucide-react';
import { CrewAvatarGroup, type ActivityCardData } from '@loopdev/public-blocks';

export interface CimoCuratedFeedProps {
  activities: ActivityCardData[];
  selectedActivityId: string;
  onSelectActivity: (id: string) => void;
  onJoinActivity: (id: string) => void;
}

export const CimoCuratedFeed: React.FC<CimoCuratedFeedProps> = ({
  activities,
  selectedActivityId,
  onSelectActivity,
  onJoinActivity,
}) => {
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'weekend'>('all');

  const todayCount = activities.filter((a) => a.date.toLowerCase().includes('hoy')).length;
  const weekendCount = activities.filter(
    (a) => a.date.toLowerCase().includes('sábado') || a.date.toLowerCase().includes('domingo'),
  ).length;

  const displayedActivities = activities.filter((act) => {
    if (timeFilter === 'today') return act.date.toLowerCase().includes('hoy');
    if (timeFilter === 'weekend') {
      return act.date.toLowerCase().includes('sábado') || act.date.toLowerCase().includes('domingo');
    }
    return true;
  });

  return (
    <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col gap-6 text-[#1F4E5F]">
      {/* Surface Header with Title and Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#1F4E5F]/10">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#7FB77E] block">
            Comunidad Deportiva Madrid
          </span>
          <h2 className="text-xl font-extrabold text-[#1F4E5F] mt-0.5">Explorar Entrenamientos</h2>
        </div>

        {/* Time Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F7F7F7] rounded-2xl border border-[#1F4E5F]/5 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setTimeFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              timeFilter === 'all'
                ? 'bg-[#1F4E5F] text-white shadow-xs'
                : 'text-[#1F4E5F]/70 hover:text-[#1F4E5F]'
            }`}
          >
            Todos ({activities.length})
          </button>
          <button
            type="button"
            onClick={() => setTimeFilter('today')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1 ${
              timeFilter === 'today'
                ? 'bg-[#1F4E5F] text-white shadow-xs'
                : 'text-[#1F4E5F]/70 hover:text-[#1F4E5F]'
            }`}
          >
            <span>🔥 Hoy</span>
            <span className="text-[10px] opacity-80">({todayCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setTimeFilter('weekend')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1 ${
              timeFilter === 'weekend'
                ? 'bg-[#1F4E5F] text-white shadow-xs'
                : 'text-[#1F4E5F]/70 hover:text-[#1F4E5F]'
            }`}
          >
            <span>⭐ Finde</span>
            <span className="text-[10px] opacity-80">({weekendCount})</span>
          </button>
        </div>
      </div>

      {/* Activities Grid inside Surface Container */}
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

            return (
              <div
                key={act.id}
                onClick={() => onSelectActivity(act.id)}
                className={`bg-[#F7F7F7]/60 hover:bg-[#F7F7F7] rounded-3xl overflow-hidden border transition-all duration-200 cursor-pointer group flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#1F4E5F] ring-2 ring-[#1F4E5F]/20 shadow-md bg-white'
                    : 'border-[#1F4E5F]/10 hover:border-[#1F4E5F]/30 hover:shadow-sm'
                }`}
              >
                {/* Cover Photo 16:9 */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#1F4E5F]/5">
                  {act.image ? (
                    <img
                      src={act.image}
                      alt={act.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#1F4E5F] text-white flex items-center justify-center font-black">
                      CIMO
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1F4E5F]/90 via-transparent to-transparent" />

                  {/* Badges on Top */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full font-black text-xs bg-white text-[#1F4E5F] shadow-xs capitalize">
                      {act.sport}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#1F4E5F]/80 text-white backdrop-blur-md">
                      {act.level}
                    </span>
                  </div>

                  {/* Favorite Heart Button */}
                  <button
                    type="button"
                    onClick={(e) => e.stopPropagation()}
                    aria-label="Guardar entreno"
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
                  >
                    <Heart className="w-4 h-4 fill-transparent stroke-[2.5]" />
                  </button>

                  {/* Title and location */}
                  <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                    <h3 className="font-extrabold text-base leading-tight drop-shadow-xs line-clamp-1">
                      {act.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-white/90 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#7FB77E] shrink-0" />
                      <span className="truncate">{act.location}</span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex flex-col gap-3 flex-1 justify-between text-[#1F4E5F]">
                  {/* Captain and Date info */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#1F4E5F]/10">
                    <div className="flex items-center gap-2.5">
                      {act.captain.avatarUrl ? (
                        <img
                          src={act.captain.avatarUrl}
                          alt={act.captain.name}
                          className="w-9 h-9 rounded-full object-cover border-2 border-[#1F4E5F]/20"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-[#1F4E5F]/10 text-[#1F4E5F] font-black text-xs flex items-center justify-center">
                          {act.captain.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <span className="text-[10px] font-extrabold text-[#7FB77E] uppercase tracking-wider block leading-none">
                          Capitán
                        </span>
                        <span className="text-xs font-bold text-[#1F4E5F]">
                          {act.captain.name}{act.captain.age ? `, ${act.captain.age}a` : ''}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-1 text-xs font-bold text-[#1F4E5F]">
                        <Calendar className="w-3.5 h-3.5 text-[#7FB77E]" />
                        <span>{act.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[#1F4E5F]/60 justify-end mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{act.time} h</span>
                      </div>
                    </div>
                  </div>

                  {/* Pace Pill */}
                  {act.paceOrDetails && (
                    <div className="text-xs font-semibold text-[#1F4E5F] bg-white px-3 py-1.5 rounded-xl border border-[#1F4E5F]/10 line-clamp-1 shadow-2xs">
                      ⚡ {act.paceOrDetails}
                    </div>
                  )}

                  {/* Footer: Crew Avatars + Action Button */}
                  <div className="flex items-center justify-between pt-1 mt-auto">
                    <div className="flex items-center gap-2">
                      <CrewAvatarGroup members={act.currentMembers} size="sm" />
                      <span className="text-xs font-extrabold text-[#1F4E5F]">
                        {act.currentMembers.length}/{act.maxMembers}
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={isFull && !isJoined}
                      onClick={(e) => {
                        e.stopPropagation();
                        onJoinActivity(act.id);
                      }}
                      className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ${
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
                          <span>You're In</span>
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
