import React, { useState } from 'react';
import {
  Beer,
  Calendar,
  Check,
  CloudSun,
  Coffee,
  Copy,
  ExternalLink,
  MessageCircle,
  Plus,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Ticket,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { type ActivityCardData } from '@loopdev/public-blocks';

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
  const [linkCopied, setLinkCopied] = useState(false);

  const isJoined = Boolean(activity.isJoined);
  const isFull = activity.currentMembers.length >= activity.maxMembers;
  const spotsLeft = Math.max(0, activity.maxMembers - activity.currentMembers.length);
  const fillPercentage = Math.min(
    100,
    Math.round((activity.currentMembers.length / activity.maxMembers) * 100),
  );

  const [showRosterModal, setShowRosterModal] = useState(false);

  // Grid of visible members (up to 8)
  const visibleMembers = activity.currentMembers.slice(0, 8);
  const remainingCount = Math.max(0, activity.currentMembers.length - 8);

  // Calculate empty slots to render if total capacity <= 8 or for remaining open slots
  const emptySlotsCount = Math.min(8 - visibleMembers.length, spotsLeft);
  const emptySlots = Array.from({ length: Math.max(0, emptySlotsCount) });

  // [Issue #7] Google Calendar & Universal .ICS Generator
  const handleAddToGoogleCalendar = () => {
    const title = encodeURIComponent(`CIMO: ${activity.title}`);
    const location = encodeURIComponent(`${activity.location}`);
    const details = encodeURIComponent(
      `Entrenamiento grupal de ${activity.sport} (${activity.level}) liderado por ${activity.captain.name} en CIMO.\n\n📍 Punto de encuentro: ${activity.location}\n⏰ Horario: ${activity.date} a las ${activity.time}\n☕ Tercer tiempo: ${activity.thirdHalf?.venue || 'Café post-entreno'}\n\nFicha del entreno: ${window.location.href}`,
    );
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(googleCalendarUrl, '_blank');
    setCalendarAdded(true);
    setTimeout(() => setCalendarAdded(false), 3000);
  };

  const handleDownloadIcs = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CIMO Social Sports//ES',
      'BEGIN:VEVENT',
      `SUMMARY:CIMO: ${activity.title}`,
      `DESCRIPTION:Entreno grupal con ${activity.captain.name} en CIMO.\\nNivel: ${activity.level}\\nUbicacion: ${activity.location}\\nEnlace: ${window.location.href}`,
      `LOCATION:${activity.location}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `cimo-entreno-${activity.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setCalendarAdded(true);
    setTimeout(() => setCalendarAdded(false), 3000);
  };

  // [Issue #36] WhatsApp Share & Web Share API
  const handleShareWhatsApp = () => {
    const shareText = `🏃‍♂️ *¡Me he unido a este entreno en CIMO!* 🏃‍♀️\n\n📌 *${activity.title}*\n🏅 Deporte: ${activity.sport} (${activity.level})\n📅 Cuándo: ${activity.date} a las ${activity.time}\n📍 Dónde: ${activity.location}\n🎟️ Plazas: Quedan ${spotsLeft} libres (Capitán: ${activity.captain.name})\n☕ Tercer Tiempo: ${activity.thirdHalf?.venue || 'Café de especialidad'}\n\n👉 ¡Únete al Crew aquí!: ${window.location.href}`;

    if (navigator.share) {
      navigator
        .share({
          title: activity.title,
          text: shareText,
          url: window.location.href,
        })
        .catch(() => {
          window.open(
            `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`,
            '_blank',
          );
        });
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  };

  return (
    <>
      <aside
        className="border-[#1F4E5F]/12 flex h-full w-full flex-col gap-3.5 overflow-y-auto rounded-3xl border bg-[#FCFDFD] p-5 text-[#1F4E5F] shadow-[0_4px_24px_-4px_rgba(31,78,95,0.05)]"
        aria-label="Panel del Entreno"
      >
        {/* 1. 🛡️ Credencial del Capitán Verificado */}
        <div className="border-[#1F4E5F]/8 shadow-2xs flex flex-col gap-3 rounded-2xl border bg-white p-3.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-[#7FB77E]">
              <ShieldCheck className="h-3.5 w-3.5" />
              Capitán Verificado
            </span>
            <span className="py-0.2 flex items-center gap-0.5 rounded-full bg-amber-500/15 px-2 text-[9px] font-black text-amber-700">
              <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
              4.9 (28 liderados)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="shadow-xs h-12 w-12 shrink-0 overflow-hidden rounded-2xl border-2 border-[#7FB77E]">
              <img
                src={activity.captain.avatarUrl}
                alt={activity.captain.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="truncate text-xs font-black text-[#1F4E5F]">
                {activity.captain.name}
              </h4>
              <p className="truncate text-[10px] font-bold text-[#7FB77E]">
                Capitán 5 Estrellas • Nivel Oro
              </p>
              <p className="text-[9px] font-medium text-[#1F4E5F]/60">100% Asistencia Puntual</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateToProfile?.(activity.captain.id)}
            className="border-[#1F4E5F]/8 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border bg-[#EEF2F2]/60 px-3 py-1.5 text-[11px] font-bold text-[#1F4E5F] transition-all hover:bg-[#7FB77E]/15"
          >
            <span>Ver Pasaporte Deportivo</span>
            <ExternalLink className="h-3 w-3 text-[#7FB77E]" />
          </button>
        </div>

        {/* 2. 👥 El Crew: 8 Plazas Visibles Sin Scroll */}
        <div className="border-[#1F4E5F]/8 shadow-2xs flex flex-col gap-2.5 rounded-2xl border bg-white p-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-[#7FB77E]" />
              <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]">
                Asistentes Confirmados ({activity.currentMembers.length}/{activity.maxMembers})
              </span>
            </div>
            <span className="py-0.2 rounded-full bg-[#7FB77E]/10 px-2 text-[9px] font-black text-[#7FB77E]">
              {spotsLeft} libres
            </span>
          </div>

          {/* Grid de 2 Columnas de Asistentes (Hasta 8 visibles sin scroll) */}
          <div className="grid grid-cols-2 gap-1.5">
            {visibleMembers.map((m) => (
              <div
                key={m.id}
                onClick={() => onNavigateToProfile?.(m.id)}
                className="group flex min-w-0 cursor-pointer items-center gap-2 rounded-xl border border-[#1F4E5F]/5 bg-[#EEF2F2]/50 p-1.5 transition-all hover:bg-[#7FB77E]/15"
              >
                <div className="h-7 w-7 shrink-0 overflow-hidden rounded-full border border-[#1F4E5F]/15 group-hover:border-[#7FB77E]">
                  <img src={m.avatarUrl} alt={m.name} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block truncate text-[11px] font-black leading-tight text-[#1F4E5F] transition-colors group-hover:text-[#7FB77E]">
                    {m.name}
                  </span>
                  <span className="block truncate text-[8.5px] font-bold uppercase text-[#7FB77E]">
                    {m.isCaptain ? 'Capitán' : 'Confirmado'}
                  </span>
                </div>
              </div>
            ))}

            {/* Slots Vacíos Disponibles */}
            {emptySlots.map((_, idx) => (
              <button
                key={`empty-${idx}`}
                type="button"
                onClick={() => !isJoined && onJoin(activity.id)}
                disabled={isJoined}
                className="flex cursor-pointer items-center justify-center gap-1 rounded-xl border border-dashed border-[#7FB77E]/40 bg-[#7FB77E]/5 p-2 text-[10px] font-bold text-[#7FB77E] transition-all hover:border-[#7FB77E] hover:bg-[#7FB77E]/15"
              >
                <Plus className="h-3 w-3 stroke-[2.5]" />
                <span>Plaza libre</span>
              </button>
            ))}
          </div>

          {/* Botón Ver Más si hay más de 8 personas */}
          {remainingCount > 0 && (
            <button
              type="button"
              onClick={() => setShowRosterModal(true)}
              className="mt-0.5 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-[#EEF2F2]/70 px-3 py-1.5 text-[10px] font-black text-[#1F4E5F] transition-all hover:bg-[#7FB77E]/20"
            >
              <span>Ver todos los asistentes (+{remainingCount} más)</span>
              <ExternalLink className="h-3 w-3 text-[#7FB77E]" />
            </button>
          )}
        </div>

        {/* 3. 🌤️ Clima & Vibe Social */}
        <div className="grid grid-cols-2 gap-2">
          <div className="border-[#1F4E5F]/8 shadow-2xs flex items-center gap-2 rounded-2xl border bg-white p-2.5">
            <div className="rounded-xl bg-[#7FB77E]/15 p-1.5 text-[#1F4E5F]">
              <CloudSun className="h-3.5 w-3.5" />
            </div>
            <div>
              <span className="block text-[9px] font-black uppercase leading-tight text-[#1F4E5F]/60">
                Condiciones Previstas
              </span>
              <span className="text-[11px] font-black text-[#1F4E5F]">19ºC Despejado</span>
            </div>
          </div>

          <div className="border-[#1F4E5F]/8 shadow-2xs flex items-center gap-2 rounded-2xl border bg-white p-2.5">
            <div className="rounded-xl bg-[#7FB77E]/15 p-1.5 text-[#1F4E5F]">
              <Sparkles className="h-3.5 w-3.5 text-[#7FB77E]" />
            </div>
            <div>
              <span className="block text-[9px] font-black uppercase leading-tight text-[#1F4E5F]/60">
                Vibe
              </span>
              <span className="text-[11px] font-black text-[#1F4E5F]">Conversacional</span>
            </div>
          </div>
        </div>

        {/* 4. 🎟️ Ticket de Reserva & Plazas */}
        <div className="border-[#1F4E5F]/8 shadow-2xs flex flex-col gap-3 rounded-2xl border bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-[#7FB77E]">
              <Ticket className="h-3.5 w-3.5" />
              Convocatoria Abierta
            </span>
            <span className="text-xs font-black text-[#1F4E5F]">
              {activity.price === 'Gratis' || !activity.price ? 'Gratis' : activity.price}
            </span>
          </div>

          {/* Barra de Ocupación */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#1F4E5F]/70">Plazas del Crew</span>
              <span className="font-black text-[#1F4E5F]">
                {activity.currentMembers.length} / {activity.maxMembers} ({spotsLeft} libres)
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#1F4E5F]/10">
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
            className={`active:scale-98 flex min-h-[42px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-black shadow-sm transition-all ${
              isJoined
                ? 'bg-[#1F4E5F] text-white hover:bg-[#163a47]'
                : isFull
                  ? 'cursor-not-allowed bg-slate-200 text-slate-500'
                  : 'bg-[#7FB77E] text-white hover:bg-[#6ea26d] hover:shadow-md'
            }`}
          >
            {isJoined ? (
              <>
                <Check className="h-3.5 w-3.5 stroke-[3] text-[#7FB77E]" />
                <span>¡Estás dentro! (Cancelar plaza)</span>
              </>
            ) : isFull ? (
              <span>Plazas agotadas</span>
            ) : (
              <>
                <Zap className="h-3.5 w-3.5 fill-current" />
                <span>Unirme al Crew</span>
              </>
            )}
          </button>

          {/* [Issue #7] Sincronización en 1 Clic con Calendario */}
          {isJoined && (
            <div className="flex gap-1.5 pt-0.5">
              <button
                type="button"
                onClick={handleAddToGoogleCalendar}
                className="flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-xl bg-[#EEF2F2] px-2.5 py-2 text-[10px] font-bold text-[#1F4E5F] transition-all hover:bg-[#7FB77E]/20"
              >
                <Calendar className="h-3 w-3 text-[#7FB77E]" />
                <span>{calendarAdded ? '¡Guardado!' : 'Google Cal'}</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadIcs}
                className="flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-xl bg-[#EEF2F2] px-2.5 py-2 text-[10px] font-bold text-[#1F4E5F] transition-all hover:bg-[#7FB77E]/20"
              >
                <Calendar className="h-3 w-3 text-[#7FB77E]" />
                <span>Descargar .ICS</span>
              </button>
            </div>
          )}

          {/* [Issue #36] Compartir por WhatsApp & Copiar Enlace */}
          <div className="border-[#1F4E5F]/8 flex gap-2 border-t pt-2">
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="shadow-2xs flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-[#25D366]/30 bg-[#25D366]/15 px-3 py-2.5 text-xs font-black text-[#128C7E] transition-all hover:bg-[#25D366]/25"
            >
              <MessageCircle className="h-3.5 w-3.5 fill-[#25D366] text-[#25D366]" />
              <span>Compartir WhatsApp</span>
            </button>
            <button
              type="button"
              onClick={handleCopyLink}
              aria-label="Copiar enlace"
              className="flex cursor-pointer items-center justify-center rounded-xl border border-[#1F4E5F]/15 bg-white p-2.5 text-xs font-bold text-[#1F4E5F] transition-all hover:bg-slate-50"
            >
              {linkCopied ? (
                <Check className="h-3.5 w-3.5 text-[#7FB77E]" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* 5. Tercer Tiempo Post-Entreno (CIMO Social Blue) */}
        {activity.thirdHalf && activity.thirdHalf.enabled && (
          <div className="mt-auto flex items-center gap-2.5 rounded-2xl border border-[#1F4E5F]/15 bg-[#EEF2F2]/60 p-3 text-[#1F4E5F]">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#1F4E5F]/15 text-[#1F4E5F]">
              {activity.thirdHalf.type === 'beer' ? (
                <Beer className="h-3.5 w-3.5" />
              ) : activity.thirdHalf.type === 'smoothie' ? (
                <Sparkles className="h-3.5 w-3.5" />
              ) : activity.thirdHalf.type === 'picnic' ? (
                <Sun className="h-3.5 w-3.5" />
              ) : (
                <Coffee className="h-3.5 w-3.5" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <span className="block text-[10px] font-black uppercase text-[#1F4E5F]">
                Tercer Tiempo Confirmado
              </span>
              <p className="truncate text-[11px] font-black text-[#1F4E5F]">
                {activity.thirdHalf.venue || 'Café / Terraza'}
              </p>
              {activity.thirdHalf.notes && (
                <p className="mt-0.2 truncate text-[10px] font-medium text-[#1F4E5F]/70">
                  {activity.thirdHalf.notes}
                </p>
              )}
            </div>
          </div>
        )}
      </aside>

      {/* 👥 Modal del Crew Completo (Si hay más de 8 deportistas) */}
      {showRosterModal && (
        <div className="backdrop-blur-xs animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 duration-200">
          <div className="flex max-h-[85vh] w-full max-w-md flex-col gap-4 overflow-hidden rounded-3xl border border-[#1F4E5F]/15 bg-white p-6 text-[#1F4E5F] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1F4E5F]/10 pb-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#7FB77E]" />
                <h3 className="text-base font-black text-[#1F4E5F]">
                  El Crew Completo ({activity.currentMembers.length} de {activity.maxMembers})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowRosterModal(false)}
                className="cursor-pointer rounded-full p-1.5 text-[#1F4E5F]/60 hover:bg-slate-100 hover:text-[#1F4E5F]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-1 flex-col gap-2 overflow-y-auto pr-1">
              {activity.currentMembers.map((m) => (
                <div
                  key={`modal-${m.id}`}
                  onClick={() => {
                    setShowRosterModal(false);
                    onNavigateToProfile?.(m.id);
                  }}
                  className="group flex cursor-pointer items-center justify-between rounded-2xl border border-[#1F4E5F]/5 bg-[#EEF2F2]/50 p-3 transition-all hover:bg-[#7FB77E]/15"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-[#1F4E5F]/10 group-hover:border-[#7FB77E]">
                      <img src={m.avatarUrl} alt={m.name} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <span className="block text-xs font-black text-[#1F4E5F] transition-colors group-hover:text-[#7FB77E]">
                        {m.name}
                      </span>
                      <span className="text-[10px] font-bold text-[#1F4E5F]/60">
                        {m.isCaptain ? 'Capitán del Crew' : 'Deportista Verificado'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {m.isCaptain ? (
                      <span className="rounded-full bg-[#7FB77E]/15 px-2.5 py-0.5 text-[10px] font-black text-[#7FB77E]">
                        Capitán
                      </span>
                    ) : (
                      <span className="rounded-full border border-[#1F4E5F]/10 bg-white px-2.5 py-0.5 text-[10px] font-bold text-[#1F4E5F]/70">
                        Confirmado
                      </span>
                    )}
                    <ExternalLink className="h-3.5 w-3.5 text-[#1F4E5F]/40 group-hover:text-[#7FB77E]" />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end border-t border-[#1F4E5F]/10 pt-3">
              <button
                type="button"
                onClick={() => setShowRosterModal(false)}
                className="cursor-pointer rounded-xl bg-[#1F4E5F] px-5 py-2.5 text-xs font-black text-white transition-colors hover:bg-[#163a47]"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
