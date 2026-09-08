import React from 'react';
import { Calendar, Clock, Coffee, Info, MapPin, Users } from 'lucide-react';
import type { ActivityCardData } from '@loopdev/public-blocks';

export interface CimoChatContextInspectorWidgetProps {
  activity?: ActivityCardData;
  onNavigateToProfile?: (athleteId: string) => void;
}

export const CimoChatContextInspectorWidget: React.FC<CimoChatContextInspectorWidgetProps> = ({
  activity,
  onNavigateToProfile,
}) => {
  if (!activity) {
    return (
      <aside
        className="border-[#1F4E5F]/12 flex h-full w-full flex-col gap-3.5 overflow-y-auto rounded-3xl border bg-[#FCFDFD] p-5 text-[#1F4E5F] shadow-[0_4px_24px_-4px_rgba(31,78,95,0.05)]"
        aria-label="Detalles de la Conversación"
      >
        <div className="border-[#1F4E5F]/8 flex items-center gap-1.5 border-b pb-2">
          <Info className="h-3.5 w-3.5 text-[#7FB77E]" />
          <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]">
            Detalles de Quedada
          </span>
        </div>
        <p className="py-4 text-center text-xs font-medium text-[#1F4E5F]/60">
          Selecciona una conversación para ver los detalles y asistentes del entreno.
        </p>
      </aside>
    );
  }

  return (
    <aside
      className="border-[#1F4E5F]/12 flex h-full w-full flex-col gap-3.5 overflow-y-auto rounded-3xl border bg-[#FCFDFD] p-5 text-[#1F4E5F] shadow-[0_4px_24px_-4px_rgba(31,78,95,0.05)]"
      aria-label="Detalles de la Conversación"
    >
      {/* 1. Cabecera */}
      <div className="border-[#1F4E5F]/8 flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5 text-[#7FB77E]" />
          <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]">
            Contexto del Entreno
          </span>
        </div>
        <span className="py-0.2 rounded-full bg-[#7FB77E]/10 px-2 text-[9px] font-black capitalize text-[#7FB77E]">
          {activity.sport}
        </span>
      </div>

      {/* 2. Tarjeta Resumen */}
      <div className="shadow-2xs flex flex-col overflow-hidden rounded-2xl border border-[#1F4E5F]/10 bg-white">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#1F4E5F]/5">
          <img src={activity.image} alt={activity.title} className="h-full w-full object-cover" />
          <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-lg bg-black/70 px-2 py-0.5 text-[9px] font-bold text-white backdrop-blur-md">
            <Users className="h-3 w-3 text-[#7FB77E]" />
            {activity.currentMembers.length} / {activity.maxMembers}
          </div>
        </div>

        <div className="flex flex-col gap-1.5 p-3">
          <h4 className="line-clamp-1 text-xs font-black text-[#1F4E5F]">{activity.title}</h4>
          <div className="flex items-center gap-2 text-[10px] font-bold text-[#1F4E5F]/75">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-[#7FB77E]" /> {activity.date}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-[#7FB77E]" /> {activity.time}
            </span>
          </div>
          <p className="flex items-center gap-1 truncate text-[10px] font-medium text-[#1F4E5F]/65">
            <MapPin className="h-3 w-3 shrink-0 text-[#7FB77E]" />
            <span className="truncate">{activity.location}</span>
          </p>
        </div>
      </div>

      {/* 3. Asistentes en este Chat */}
      <div className="border-[#1F4E5F]/8 shadow-2xs flex flex-col gap-2 rounded-2xl border bg-white p-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]/60">
            Miembros en el Chat ({activity.currentMembers.length})
          </span>
          <Users className="h-3 w-3 text-[#7FB77E]" />
        </div>

        <div className="flex flex-col gap-1.5">
          {activity.currentMembers.map((m) => (
            <div
              key={m.id}
              onClick={() => onNavigateToProfile?.(m.id)}
              className="flex cursor-pointer items-center justify-between rounded-xl bg-[#EEF2F2]/50 p-1.5 transition-all hover:bg-[#7FB77E]/10"
            >
              <div className="flex items-center gap-2">
                <img src={m.avatarUrl} alt={m.name} className="h-6 w-6 rounded-full object-cover" />
                <span className="text-xs font-black text-[#1F4E5F]">{m.name}</span>
              </div>
              {m.isCaptain && (
                <span className="py-0.2 rounded-full bg-[#7FB77E]/10 px-1.5 text-[9px] font-black text-[#7FB77E]">
                  Capitán
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Tercer Tiempo */}
      {activity.thirdHalf && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-[#7FB77E]/20 bg-[#EEF2F2]/40 p-3 text-[#1F4E5F]">
          <Coffee className="h-4 w-4 shrink-0 text-[#7FB77E]" />
          <div>
            <span className="block text-[10px] font-black uppercase text-[#7FB77E]">
              Tercer Tiempo Acordado
            </span>
            <p className="text-[11px] font-black text-[#1F4E5F]">
              {activity.thirdHalf.venue ??
                (activity.thirdHalf as any).venueName ??
                'Terraza acordada'}
            </p>
          </div>
        </div>
      )}

      {/* 5. Duración Limitada del Chat */}
      <div className="shadow-2xs mt-auto flex flex-col gap-1.5 rounded-2xl border border-[#1F4E5F]/10 bg-white p-3 text-[#1F4E5F]">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]/60">
            Ciclo del Chat
          </span>
          <span className="py-0.2 rounded-full bg-[#7FB77E]/10 px-2 text-[9px] font-black text-[#7FB77E]">
            ⏳ Temporal
          </span>
        </div>
        <p className="text-[11px] font-black text-[#1F4E5F]">Activo hasta 24h tras el entreno</p>
        <p className="text-[10px] font-medium leading-relaxed text-[#1F4E5F]/65">
          Se cerrará y archivará automáticamente tras la quedada para proteger la privacidad del
          grupo.
        </p>
      </div>
    </aside>
  );
};
