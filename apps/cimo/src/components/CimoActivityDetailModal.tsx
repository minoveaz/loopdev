import React from 'react';
import { clsx } from 'clsx';
import { Calendar, Check, ChevronRight, Clock, MapPin, Sparkles, User, X } from 'lucide-react';
import { CrewAvatarGroup, type ActivityCardData } from '@loopdev/public-blocks';

export interface CimoActivityDetailModalProps {
  activity: ActivityCardData | null;
  isOpen: boolean;
  onClose: () => void;
  onJoin: (activityId: string) => void;
}

export const CimoActivityDetailModal: React.FC<CimoActivityDetailModalProps> = ({
  activity,
  isOpen,
  onClose,
  onJoin,
}) => {
  if (!isOpen || !activity) return null;

  const isFull = activity.currentMembers.length >= activity.maxMembers;
  const isJoined = Boolean(activity.isJoined);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white border border-[#1F4E5F]/15 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh] text-[#1F4E5F] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Cover Image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#1F4E5F]/10 shrink-0">
          {activity.image ? (
            <img src={activity.image} alt={activity.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-[#1F4E5F] text-white flex items-center justify-center text-3xl font-black">
              CIMO
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1F4E5F]/90 via-transparent to-transparent" />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar detalle"
            className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Badges on Image */}
          <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full font-black text-xs bg-white text-[#1F4E5F] shadow-xs capitalize">
              {activity.sport}
            </span>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#1F4E5F]/80 text-white backdrop-blur-md">
              {activity.level}
            </span>
          </div>

          <div className="absolute bottom-3.5 left-4 right-4 text-white">
            <h2 className="font-extrabold text-lg sm:text-xl leading-tight drop-shadow-xs">
              {activity.title}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-white/90 mt-1">
              <MapPin className="w-3.5 h-3.5 text-[#7FB77E]" />
              <span>{activity.location}</span>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto flex flex-col gap-5">
          {/* Details Row: Date, Time & Pace */}
          <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#F7F7F7] rounded-2xl border border-[#1F4E5F]/5">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#7FB77E]" />
              <div>
                <span className="text-[10px] uppercase font-extrabold text-[#1F4E5F]/60 block">Fecha</span>
                <span className="text-xs font-bold text-[#1F4E5F]">{activity.date}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#7FB77E]" />
              <div>
                <span className="text-[10px] uppercase font-extrabold text-[#1F4E5F]/60 block">Hora</span>
                <span className="text-xs font-bold text-[#1F4E5F]">{activity.time} h</span>
              </div>
            </div>
          </div>

          {/* Pace Pill */}
          {activity.paceOrDetails && (
            <div className="p-3 bg-[#7FB77E]/10 rounded-2xl border border-[#7FB77E]/20 text-xs font-semibold text-[#1F4E5F] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#7FB77E] shrink-0" />
              <span>{activity.paceOrDetails}</span>
            </div>
          )}

          {/* Captain Section */}
          <div className="border border-[#1F4E5F]/10 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {activity.captain.avatarUrl ? (
                <img
                  src={activity.captain.avatarUrl}
                  alt={activity.captain.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#1F4E5F]/20"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#1F4E5F]/10 text-[#1F4E5F] font-black text-sm flex items-center justify-center">
                  {activity.captain.name.charAt(0)}
                </div>
              )}
              <div>
                <span className="text-[10px] font-extrabold text-[#7FB77E] uppercase tracking-wider block">
                  Capitán del Crew
                </span>
                <h4 className="text-sm font-extrabold text-[#1F4E5F]">
                  {activity.captain.name}
                  {activity.captain.age ? `, ${activity.captain.age} años` : ''}
                </h4>
                <p className="text-xs text-[#1F4E5F]/60">Organizador verificado en Madrid</p>
              </div>
            </div>
          </div>

          {/* Crew Members List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#1F4E5F]">
                Integrantes del Crew ({activity.currentMembers.length}/{activity.maxMembers})
              </span>
              <span className="text-xs font-bold text-[#7FB77E]">
                {activity.maxMembers - activity.currentMembers.length} plazas libres
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {activity.currentMembers.map((member) => (
                <div
                  key={member.id}
                  className="p-2.5 bg-[#F7F7F7] rounded-xl border border-[#1F4E5F]/5 flex items-center gap-2.5"
                >
                  {member.avatarUrl ? (
                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#1F4E5F]/10 font-bold text-xs flex items-center justify-center">
                      {member.name.charAt(0)}
                    </div>
                  )}
                  <div className="truncate">
                    <span className="text-xs font-bold text-[#1F4E5F] block truncate">{member.name}</span>
                    {member.isCaptain && (
                      <span className="text-[9px] font-black text-[#7FB77E] uppercase">Capitán</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 border-t border-[#1F4E5F]/10 bg-white flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-bold text-[#1F4E5F]/60 block uppercase">Participación</span>
            <span className="text-xs font-extrabold text-[#7FB77E]">100% Gratis</span>
          </div>

          <button
            type="button"
            disabled={isFull && !isJoined}
            onClick={() => {
              onJoin(activity.id);
            }}
            className={clsx(
              'px-6 py-3 rounded-full text-xs font-extrabold transition-all flex items-center gap-2 shadow-sm cursor-pointer min-h-[44px]',
              isJoined
                ? 'bg-[#7FB77E] text-white'
                : isFull
                ? 'bg-[#1F4E5F]/10 text-[#1F4E5F]/50 cursor-not-allowed'
                : 'bg-[#1F4E5F] hover:bg-[#183e4c] text-white active:scale-95',
            )}
          >
            {isJoined ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Ya estás dentro del Crew</span>
              </>
            ) : isFull ? (
              <span>Crew Completo</span>
            ) : (
              <>
                <span>Unirme a este Crew</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
