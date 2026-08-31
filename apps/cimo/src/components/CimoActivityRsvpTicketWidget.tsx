import React, { useState } from 'react';
import {
  Beer,
  Calendar,
  Check,
  Coffee,
  MapPin,
  Ticket,
  Zap,
} from 'lucide-react';
import { CrewAvatarGroup, type ActivityCardData, type CommunityMember } from '@loopdev/public-blocks';

export interface CimoActivityRsvpTicketWidgetProps {
  activity: ActivityCardData;
  onJoin: (id: string) => void;
  onNavigateToProfile?: (athleteId: string) => void;
}

export const CimoActivityRsvpTicketWidget: React.FC<CimoActivityRsvpTicketWidgetProps> = ({
  activity,
  onJoin,
  onNavigateToProfile,
}) => {
  const [calendarAdded, setCalendarAdded] = useState(false);
  const isJoined = Boolean(activity.isJoined);
  const isFull = activity.currentMembers.length >= activity.maxMembers;
  const spotsLeft = Math.max(0, activity.maxMembers - activity.currentMembers.length);
  const fillPercentage = Math.min(100, Math.round((activity.currentMembers.length / activity.maxMembers) * 100));

  const handleAddToCalendar = () => {
    // Generate .ics download or Google Calendar URL
    const title = encodeURIComponent(`CIMO: ${activity.title}`);
    const location = encodeURIComponent(`${activity.location}`);
    const details = encodeURIComponent(`Entreno grupal con ${activity.captain.name} en CIMO.\nNivel: ${activity.level}\nChat: https://minoveaz.github.io/CIMO/#/app/activity/${activity.id}`);
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(googleCalendarUrl, '_blank');
    setCalendarAdded(true);
    setTimeout(() => setCalendarAdded(false), 3000);
  };

  return (
    <aside className="h-full overflow-y-auto flex flex-col gap-3.5 text-[#1F4E5F] pr-0.5" aria-label="Ticket de Inscripción">
      {/* 1. Ticket de Reserva Principal */}
      <div className="bg-[#FCFDFD] border border-[#1F4E5F]/12 rounded-3xl p-5 sm:p-6 shadow-[0_4px_24px_-4px_rgba(31,78,95,0.05)] flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#7FB77E] flex items-center gap-1">
            <Ticket className="w-3.5 h-3.5" />
            Convocatoria Abierta
          </span>
          <span className="text-xs font-black text-[#1F4E5F]">
            {activity.price === 'Gratis' || !activity.price ? 'Gratis' : activity.price}
          </span>
        </div>

        {/* Barra de Ocupación de Plazas */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#1F4E5F]/70">Plazas del Crew</span>
            <span className="font-black text-[#1F4E5F]">
              {activity.currentMembers.length} / {activity.maxMembers} ({spotsLeft} libres)
            </span>
          </div>
          <div className="w-full h-2.5 bg-[#1F4E5F]/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                fillPercentage > 85 ? 'bg-amber-500' : 'bg-[#7FB77E]'
              }`}
              style={{ width: `${fillPercentage}%` }}
            />
          </div>
        </div>

        {/* Botón Principal de Acción */}
        <button
          type="button"
          onClick={() => onJoin(activity.id)}
          disabled={isFull && !isJoined}
          className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 shadow-sm ${
            isJoined
              ? 'bg-[#1F4E5F] text-white hover:bg-[#163a47]'
              : isFull
              ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
              : 'bg-[#7FB77E] hover:bg-[#6ea26d] text-[#1F4E5F] hover:shadow-md'
          }`}
        >
          {isJoined ? (
            <>
              <Check className="w-4 h-4 text-[#7FB77E] stroke-[3]" />
              <span>¡Estás dentro! (Cancelar)</span>
            </>
          ) : isFull ? (
            <span>Plazas agotadas</span>
          ) : (
            <>
              <Zap className="w-4 h-4 fill-current" />
              <span>Unirme al Crew</span>
            </>
          )}
        </button>

        {/* Sync con Google Calendar */}
        {isJoined && (
          <button
            type="button"
            onClick={handleAddToCalendar}
            className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 text-[#1F4E5F] border border-[#1F4E5F]/15 font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            {calendarAdded ? <Check className="w-3.5 h-3.5 text-[#7FB77E]" /> : <Calendar className="w-3.5 h-3.5 text-[#7FB77E]" />}
            <span>{calendarAdded ? '¡Añadido a tu calendario!' : 'Añadir a Google / Apple Calendar'}</span>
          </button>
        )}

        {/* Avatares de Miembros Confirmados */}
        <div className="pt-3 border-t border-[#1F4E5F]/8 flex flex-col gap-2">
          <span className="text-[11px] font-black text-[#1F4E5F]/70 uppercase tracking-wide">
            Miembros Confirmados ({activity.currentMembers.length})
          </span>
          <div className="flex items-center gap-2">
            <CrewAvatarGroup
              members={activity.currentMembers}
              maxVisible={6}
              size="md"
            />
          </div>
        </div>
      </div>

      {/* 2. Tarjeta de Tercer Tiempo Post-Entreno */}
      {activity.thirdHalf && activity.thirdHalf.enabled && (
        <div className="bg-[#FCFDFD] border border-[#1F4E5F]/12 rounded-3xl p-5 shadow-[0_4px_24px_-4px_rgba(31,78,95,0.05)] flex flex-col gap-3">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#7FB77E] flex items-center gap-1.5">
            {activity.thirdHalf.type === 'beer' ? <Beer className="w-3.5 h-3.5" /> : <Coffee className="w-3.5 h-3.5" />}
            Tercer Tiempo Confirmado
          </span>
          <div>
            <h4 className="font-black text-sm text-[#1F4E5F]">
              {activity.thirdHalf.venue || 'Café / Terraza de Encuentro'}
            </h4>
            {activity.thirdHalf.notes && (
              <p className="text-xs font-medium text-[#1F4E5F]/70 mt-0.5">
                {activity.thirdHalf.notes}
              </p>
            )}
          </div>
          <p className="text-[11px] font-medium text-[#1F4E5F]/70 bg-white p-2.5 rounded-xl border border-[#1F4E5F]/8">
            Café de especialidad y recuperación tras la sesión.
          </p>
        </div>
      )}
    </aside>
  );
};
