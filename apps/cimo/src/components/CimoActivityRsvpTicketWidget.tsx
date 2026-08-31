import React, { useState } from 'react';
import {
  Award,
  Beer,
  Calendar,
  Check,
  CheckCircle2,
  CloudSun,
  Coffee,
  Copy,
  ExternalLink,
  Flame,
  Heart,
  MapPin,
  MessageCircle,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Ticket,
  Users,
  Wind,
  Zap,
} from 'lucide-react';
import { CrewAvatarGroup, type ActivityCardData } from '@loopdev/public-blocks';

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
  const fillPercentage = Math.min(100, Math.round((activity.currentMembers.length / activity.maxMembers) * 100));

  // [Issue #7] Google Calendar & Universal .ICS Generator
  const handleAddToGoogleCalendar = () => {
    const title = encodeURIComponent(`CIMO: ${activity.title}`);
    const location = encodeURIComponent(`${activity.location}`);
    const details = encodeURIComponent(
      `Entrenamiento grupal de ${activity.sport} (${activity.level}) liderado por ${activity.captain.name} en CIMO.\n\n📍 Punto de encuentro: ${activity.location}\n⏰ Horario: ${activity.date} a las ${activity.time}\n☕ Tercer tiempo: ${activity.thirdHalf?.venue || 'Café post-entreno'}\n\nFicha del entreno: ${window.location.href}`
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
      navigator.share({
        title: activity.title,
        text: shareText,
        url: window.location.href,
      }).catch(() => {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
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
    <aside className="bg-[#FCFDFD] border border-[#1F4E5F]/12 rounded-3xl p-5 shadow-[0_4px_24px_-4px_rgba(31,78,95,0.05)] flex flex-col gap-3.5 text-[#1F4E5F] w-full h-full overflow-y-auto" aria-label="Panel del Entreno">
      {/* 1. 🛡️ Credencial del Capitán Verificado */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#1F4E5F]/8 shadow-2xs flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#7FB77E] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Capitán Verificado
          </span>
          <span className="text-[9px] font-black text-amber-700 bg-amber-500/15 px-2 py-0.2 rounded-full flex items-center gap-0.5">
            <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
            4.9 (28 liderados)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-[#7FB77E] shrink-0 shadow-xs">
            <img src={activity.captain.avatarUrl} alt={activity.captain.name} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-black text-[#1F4E5F] truncate">{activity.captain.name}</h4>
            <p className="text-[10px] font-bold text-[#7FB77E] truncate">Capitán 5 Estrellas • Nivel Oro</p>
            <p className="text-[9px] text-[#1F4E5F]/60 font-medium">100% Asistencia Puntual</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigateToProfile?.(activity.captain.id)}
          className="w-full py-1.5 px-3 rounded-xl bg-[#EEF2F2]/60 hover:bg-[#7FB77E]/15 text-[#1F4E5F] font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-[#1F4E5F]/8"
        >
          <span>Ver Pasaporte Deportivo</span>
          <ExternalLink className="w-3 h-3 text-[#7FB77E]" />
        </button>
      </div>

      {/* 2. 👥 El Crew: Personas que van a asistir (Muy Visible) */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#1F4E5F]/8 shadow-2xs flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#7FB77E]" />
            <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]">
              Asistentes Confirmados ({activity.currentMembers.length}/{activity.maxMembers})
            </span>
          </div>
          <span className="text-[9px] font-black text-[#7FB77E] bg-[#7FB77E]/10 px-2 py-0.2 rounded-full">
            {spotsLeft} libres
          </span>
        </div>

        {/* Lista visual de deportistas que asisten */}
        <div className="flex flex-col gap-1.5 max-h-44 overflow-y-auto pr-0.5">
          {activity.currentMembers.map((m) => (
            <div
              key={m.id}
              onClick={() => onNavigateToProfile?.(m.id)}
              className="flex items-center justify-between p-2 bg-[#EEF2F2]/50 hover:bg-[#7FB77E]/15 rounded-xl border border-[#1F4E5F]/5 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full overflow-hidden border border-[#1F4E5F]/15 shrink-0 group-hover:border-[#7FB77E]">
                  <img src={m.avatarUrl} alt={m.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-black text-[#1F4E5F] truncate block group-hover:text-[#7FB77E] transition-colors">
                    {m.name}
                  </span>
                  <span className="text-[9px] text-[#1F4E5F]/60 font-bold uppercase block">
                    {m.isCaptain ? 'Capitán del Crew' : 'Deportista Confirmado'}
                  </span>
                </div>
              </div>
              {m.isCaptain ? (
                <span className="text-[9px] font-black text-[#7FB77E] bg-[#7FB77E]/15 px-2 py-0.5 rounded-md shrink-0">
                  Capitán
                </span>
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#7FB77E] shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3. 🌤️ Clima & Vibe Social */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white p-2.5 rounded-2xl border border-[#1F4E5F]/8 shadow-2xs flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-[#7FB77E]/15 text-[#1F4E5F]">
            <CloudSun className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[9px] font-black uppercase text-[#1F4E5F]/60 block leading-tight">Condiciones Previstas</span>
            <span className="text-[11px] font-black text-[#1F4E5F]">19ºC Despejado</span>
          </div>
        </div>

        <div className="bg-white p-2.5 rounded-2xl border border-[#1F4E5F]/8 shadow-2xs flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-[#7FB77E]/15 text-[#1F4E5F]">
            <Sparkles className="w-3.5 h-3.5 text-[#7FB77E]" />
          </div>
          <div>
            <span className="text-[9px] font-black uppercase text-[#1F4E5F]/60 block leading-tight">Vibe</span>
            <span className="text-[11px] font-black text-[#1F4E5F]">Conversacional</span>
          </div>
        </div>
      </div>

      {/* 4. 🎟️ Ticket de Reserva & Plazas */}
      <div className="bg-white p-4 rounded-2xl border border-[#1F4E5F]/8 shadow-2xs flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#7FB77E] flex items-center gap-1">
            <Ticket className="w-3.5 h-3.5" />
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
          <div className="w-full h-2 bg-[#1F4E5F]/10 rounded-full overflow-hidden">
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
          className={`w-full py-3 px-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 shadow-sm min-h-[42px] ${
            isJoined
              ? 'bg-[#1F4E5F] text-white hover:bg-[#163a47]'
              : isFull
              ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
              : 'bg-[#7FB77E] hover:bg-[#6ea26d] text-[#1F4E5F] hover:shadow-md'
          }`}
        >
          {isJoined ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#7FB77E] stroke-[3]" />
              <span>¡Estás dentro! (Cancelar plaza)</span>
            </>
          ) : isFull ? (
            <span>Plazas agotadas</span>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5 fill-current" />
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
              className="flex-1 py-2 px-2.5 rounded-xl bg-[#EEF2F2] hover:bg-[#7FB77E]/20 text-[#1F4E5F] font-bold text-[10px] transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <Calendar className="w-3 h-3 text-[#7FB77E]" />
              <span>{calendarAdded ? '¡Guardado!' : 'Google Cal'}</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadIcs}
              className="flex-1 py-2 px-2.5 rounded-xl bg-[#EEF2F2] hover:bg-[#7FB77E]/20 text-[#1F4E5F] font-bold text-[10px] transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <Calendar className="w-3 h-3 text-[#7FB77E]" />
              <span>Descargar .ICS</span>
            </button>
          </div>
        )}

        {/* [Issue #36] Compartir por WhatsApp & Copiar Enlace */}
        <div className="pt-2 border-t border-[#1F4E5F]/8 flex gap-2">
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-[#25D366]/30 shadow-2xs"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-[#25D366] text-[#25D366]" />
            <span>Compartir WhatsApp</span>
          </button>
          <button
            type="button"
            onClick={handleCopyLink}
            aria-label="Copiar enlace"
            className="p-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#1F4E5F] border border-[#1F4E5F]/15 font-bold text-xs transition-all flex items-center justify-center cursor-pointer"
          >
            {linkCopied ? <Check className="w-3.5 h-3.5 text-[#7FB77E]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 5. ☕ Tercer Tiempo Post-Entreno */}
      {activity.thirdHalf && activity.thirdHalf.enabled && (
        <div className="p-3 bg-[#EEF2F2]/40 rounded-2xl border border-[#7FB77E]/20 text-[#1F4E5F] flex items-center gap-2.5 mt-auto">
          {activity.thirdHalf.type === 'beer' ? <Beer className="w-4 h-4 text-[#7FB77E] shrink-0" /> : <Coffee className="w-4 h-4 text-[#7FB77E] shrink-0" />}
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-black text-[#7FB77E] uppercase block">Tercer Tiempo Confirmado</span>
            <p className="text-[11px] font-black text-[#1F4E5F] truncate">{activity.thirdHalf.venue || 'Café / Terraza'}</p>
            {activity.thirdHalf.notes && (
              <p className="text-[10px] text-[#1F4E5F]/70 font-medium truncate mt-0.2">{activity.thirdHalf.notes}</p>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};
