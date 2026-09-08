import React from 'react';
import { clsx } from 'clsx';
import { Calendar, Check, ChevronRight, Clock, MapPin, Sparkles, X } from 'lucide-react';
import { type ActivityCardData } from '@loopdev/public-blocks';

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
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm duration-200">
      <div
        className="animate-in zoom-in-95 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-[#1F4E5F]/15 bg-white text-[#1F4E5F] shadow-2xl duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Cover Image */}
        <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-[#1F4E5F]/10">
          {activity.image ? (
            <img src={activity.image} alt={activity.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#1F4E5F] text-3xl font-black text-white">
              CIMO
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1F4E5F]/90 via-transparent to-transparent" />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar detalle"
            className="absolute right-3.5 top-3.5 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/80 text-slate-800 backdrop-blur-md transition-colors hover:bg-white"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Badges on Image */}
          <div className="absolute left-3.5 top-3.5 flex items-center gap-2">
            <span className="shadow-xs rounded-full bg-white px-3 py-1 text-xs font-black capitalize text-[#1F4E5F]">
              {activity.sport}
            </span>
            <span className="rounded-full bg-[#1F4E5F]/80 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md">
              {activity.level}
            </span>
          </div>

          <div className="absolute bottom-3.5 left-4 right-4 text-white">
            <h2 className="drop-shadow-xs text-lg font-extrabold leading-tight sm:text-xl">
              {activity.title}
            </h2>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-white/90">
              <MapPin className="h-3.5 w-3.5 text-[#7FB77E]" />
              <span>{activity.location}</span>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex flex-col gap-5 overflow-y-auto p-5">
          {/* Details Row: Date, Time & Pace */}
          <div className="grid grid-cols-2 gap-3 rounded-2xl border border-[#1F4E5F]/5 bg-[#F7F7F7] p-3.5">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#7FB77E]" />
              <div>
                <span className="block text-[10px] font-extrabold uppercase text-[#1F4E5F]/60">
                  Fecha
                </span>
                <span className="text-xs font-bold text-[#1F4E5F]">{activity.date}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#7FB77E]" />
              <div>
                <span className="block text-[10px] font-extrabold uppercase text-[#1F4E5F]/60">
                  Hora
                </span>
                <span className="text-xs font-bold text-[#1F4E5F]">{activity.time} h</span>
              </div>
            </div>
          </div>

          {/* Pace Pill */}
          {activity.paceOrDetails && (
            <div className="flex items-center gap-2 rounded-2xl border border-[#7FB77E]/20 bg-[#7FB77E]/10 p-3 text-xs font-semibold text-[#1F4E5F]">
              <Sparkles className="h-4 w-4 shrink-0 text-[#7FB77E]" />
              <span>{activity.paceOrDetails}</span>
            </div>
          )}

          {/* Captain Section */}
          <div className="flex items-center justify-between rounded-2xl border border-[#1F4E5F]/10 p-4">
            <div className="flex items-center gap-3">
              {activity.captain.avatarUrl ? (
                <img
                  src={activity.captain.avatarUrl}
                  alt={activity.captain.name}
                  className="h-12 w-12 rounded-full border-2 border-[#1F4E5F]/20 object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1F4E5F]/10 text-sm font-black text-[#1F4E5F]">
                  {activity.captain.name.charAt(0)}
                </div>
              )}
              <div>
                <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#7FB77E]">
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
            <div className="mb-2 flex items-center justify-between">
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
                  className="flex items-center gap-2.5 rounded-xl border border-[#1F4E5F]/5 bg-[#F7F7F7] p-2.5"
                >
                  {member.avatarUrl ? (
                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1F4E5F]/10 text-xs font-bold">
                      {member.name.charAt(0)}
                    </div>
                  )}
                  <div className="truncate">
                    <span className="block truncate text-xs font-bold text-[#1F4E5F]">
                      {member.name}
                    </span>
                    {member.isCaptain && (
                      <span className="text-[9px] font-black uppercase text-[#7FB77E]">
                        Capitán
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="flex shrink-0 items-center justify-between border-t border-[#1F4E5F]/10 bg-white p-4">
          <div>
            <span className="block text-[10px] font-bold uppercase text-[#1F4E5F]/60">
              Participación
            </span>
            <span className="text-xs font-extrabold text-[#7FB77E]">100% Gratis</span>
          </div>

          <button
            type="button"
            disabled={isFull && !isJoined}
            onClick={() => {
              onJoin(activity.id);
            }}
            className={clsx(
              'flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full px-6 py-3 text-xs font-extrabold shadow-sm transition-all',
              isJoined
                ? 'bg-[#7FB77E] text-white'
                : isFull
                  ? 'cursor-not-allowed bg-[#1F4E5F]/10 text-[#1F4E5F]/50'
                  : 'bg-[#1F4E5F] text-white hover:bg-[#183e4c] active:scale-95',
            )}
          >
            {isJoined ? (
              <>
                <Check className="h-4 w-4 stroke-[3]" />
                <span>Ya estás dentro del Crew</span>
              </>
            ) : isFull ? (
              <span>Crew Completo</span>
            ) : (
              <>
                <span>Unirme a este Crew</span>
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
