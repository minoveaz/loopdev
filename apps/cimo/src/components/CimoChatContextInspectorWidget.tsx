import React from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Coffee,
  Info,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
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
      <aside className="bg-[#FCFDFD] border border-[#1F4E5F]/12 rounded-3xl p-5 shadow-[0_4px_24px_-4px_rgba(31,78,95,0.05)] flex flex-col gap-3.5 text-[#1F4E5F] w-full h-full overflow-y-auto" aria-label="Detalles de la Conversación">
        <div className="flex items-center gap-1.5 pb-2 border-b border-[#1F4E5F]/8">
          <Info className="w-3.5 h-3.5 text-[#7FB77E]" />
          <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]">
            Detalles de Quedada
          </span>
        </div>
        <p className="text-xs text-[#1F4E5F]/60 font-medium py-4 text-center">
          Selecciona una conversación para ver los detalles y asistentes del entreno.
        </p>
      </aside>
    );
  }

  return (
    <aside className="bg-[#FCFDFD] border border-[#1F4E5F]/12 rounded-3xl p-5 shadow-[0_4px_24px_-4px_rgba(31,78,95,0.05)] flex flex-col gap-3.5 text-[#1F4E5F] w-full h-full overflow-y-auto" aria-label="Detalles de la Conversación">
      {/* 1. Cabecera */}
      <div className="flex items-center justify-between pb-2 border-b border-[#1F4E5F]/8">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-[#7FB77E]" />
          <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]">
            Contexto del Entreno
          </span>
        </div>
        <span className="text-[9px] font-black text-[#7FB77E] bg-[#7FB77E]/10 px-2 py-0.2 rounded-full capitalize">
          {activity.sport}
        </span>
      </div>

      {/* 2. Tarjeta Resumen */}
      <div className="bg-white border border-[#1F4E5F]/10 rounded-2xl overflow-hidden shadow-2xs flex flex-col">
        <div className="relative aspect-[16/9] w-full bg-[#1F4E5F]/5 overflow-hidden">
          <img
            src={activity.image}
            alt={activity.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-white text-[9px] font-bold flex items-center gap-1">
            <Users className="w-3 h-3 text-[#7FB77E]" />
            {activity.currentMembers.length} / {activity.maxMembers}
          </div>
        </div>

        <div className="p-3 flex flex-col gap-1.5">
          <h4 className="font-black text-xs text-[#1F4E5F] line-clamp-1">{activity.title}</h4>
          <div className="flex items-center gap-2 text-[10px] text-[#1F4E5F]/75 font-bold">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#7FB77E]" /> {activity.date}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#7FB77E]" /> {activity.time}
            </span>
          </div>
          <p className="text-[10px] text-[#1F4E5F]/65 font-medium flex items-center gap-1 truncate">
            <MapPin className="w-3 h-3 text-[#7FB77E] shrink-0" />
            <span className="truncate">{activity.location}</span>
          </p>
        </div>
      </div>

      {/* 3. Asistentes en este Chat */}
      <div className="bg-white p-3 rounded-2xl border border-[#1F4E5F]/8 shadow-2xs flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase text-[#1F4E5F]/60 tracking-wider">
            Miembros en el Chat ({activity.currentMembers.length})
          </span>
          <Users className="w-3 h-3 text-[#7FB77E]" />
        </div>

        <div className="flex flex-col gap-1.5">
          {activity.currentMembers.map((m) => (
            <div
              key={m.id}
              onClick={() => onNavigateToProfile?.(m.id)}
              className="flex items-center justify-between p-1.5 bg-[#EEF2F2]/50 rounded-xl hover:bg-[#7FB77E]/10 cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2">
                <img src={m.avatarUrl} alt={m.name} className="w-6 h-6 rounded-full object-cover" />
                <span className="text-xs font-black text-[#1F4E5F]">{m.name}</span>
              </div>
              {m.isCaptain && (
                <span className="text-[9px] font-black text-[#7FB77E] bg-[#7FB77E]/10 px-1.5 py-0.2 rounded-full">
                  Capitán
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Tercer Tiempo */}
      {activity.thirdHalf && (
        <div className="p-3 bg-[#EEF2F2]/40 rounded-2xl border border-[#7FB77E]/20 text-[#1F4E5F] flex items-center gap-2.5">
          <Coffee className="w-4 h-4 text-[#7FB77E] shrink-0" />
          <div>
            <span className="text-[10px] font-black text-[#7FB77E] uppercase block">Tercer Tiempo Acordado</span>
            <p className="text-[11px] font-black text-[#1F4E5F]">{activity.thirdHalf.venue ?? (activity.thirdHalf as any).venueName ?? 'Terraza acordada'}</p>
          </div>
        </div>
      )}

      {/* 5. Duración Limitada del Chat */}
      <div className="p-3 bg-white rounded-2xl border border-[#1F4E5F]/10 text-[#1F4E5F] flex flex-col gap-1.5 mt-auto shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase text-[#1F4E5F]/60 tracking-wider">
            Ciclo del Chat
          </span>
          <span className="text-[9px] font-black text-[#7FB77E] bg-[#7FB77E]/10 px-2 py-0.2 rounded-full">
            ⏳ Temporal
          </span>
        </div>
        <p className="text-[11px] font-black text-[#1F4E5F]">
          Activo hasta 24h tras el entreno
        </p>
        <p className="text-[10px] text-[#1F4E5F]/65 font-medium leading-relaxed">
          Se cerrará y archivará automáticamente tras la quedada para proteger la privacidad del grupo.
        </p>
      </div>
    </aside>
  );
};
