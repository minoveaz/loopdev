import React from 'react';
import { Calendar, Check, ChevronRight, Clock, Heart, MapPin, Sparkles, Users } from 'lucide-react';
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
  const todayActivities = activities.filter((act) => act.date.toLowerCase().includes('hoy'));
  const otherActivities = activities.filter((act) => !act.date.toLowerCase().includes('hoy'));

  const renderCard = (act: ActivityCardData) => {
    const isFull = act.currentMembers.length >= act.maxMembers;
    const isJoined = Boolean(act.isJoined);
    const isSelected = act.id === selectedActivityId;

    return (
      <div
        key={act.id}
        onClick={() => onSelectActivity(act.id)}
        className={`bg-white rounded-3xl overflow-hidden border transition-all duration-300 cursor-pointer group flex flex-col justify-between ${
          isSelected
            ? 'border-[#1F4E5F] ring-2 ring-[#1F4E5F]/20 shadow-md scale-[1.01]'
            : 'border-[#1F4E5F]/10 shadow-xs hover:shadow-md hover:border-[#1F4E5F]/30'
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
          <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full font-black text-xs bg-white text-[#1F4E5F] shadow-xs capitalize">
              {act.sport}
            </span>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#1F4E5F]/80 text-white backdrop-blur-md">
              {act.level}
            </span>
          </div>

          {/* Favorite Heart Button (Airbnb style) */}
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            aria-label="Guardar entreno"
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
          >
            <Heart className="w-4 h-4 fill-transparent stroke-[2.5]" />
          </button>

          {/* Title and location over image bottom */}
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
          <div className="flex items-center justify-between pb-3 border-b border-[#F7F7F7]">
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
            <div className="text-xs font-semibold text-[#1F4E5F] bg-[#F7F7F7] px-3 py-1.5 rounded-xl border border-[#1F4E5F]/5 line-clamp-1">
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
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Section 1: Disponibles Hoy en Madrid */}
      {todayActivities.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#7FB77E] block">
                Entrenos Inmediatos
              </span>
              <h2 className="text-xl font-extrabold text-[#1F4E5F]">🔥 Disponibles Hoy en Madrid</h2>
            </div>
            <span className="text-xs font-bold text-[#1F4E5F]/60">
              {todayActivities.length} planes hoy
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {todayActivities.map(renderCard)}
          </div>
        </section>
      )}

      {/* Section 2: Planes Populares del Fin de Semana & Próximos */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#7FB77E] block">
              Comunidad y Rutas
            </span>
            <h2 className="text-xl font-extrabold text-[#1F4E5F]">⭐ Próximos Entrenos & Fin de Semana</h2>
          </div>
          <span className="text-xs font-bold text-[#1F4E5F]/60">
            {otherActivities.length} planes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {otherActivities.map(renderCard)}
        </div>
      </section>
    </div>
  );
};
