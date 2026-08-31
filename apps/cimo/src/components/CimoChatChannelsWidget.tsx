import React from 'react';
import {
  Bell,
  CheckCircle2,
  Clock,
  Filter,
  Flame,
  MessageCircle,
  MessageSquare,
  Radio,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';
import type { ActivityCardData, ChatMessage } from '@loopdev/public-blocks';

export interface CimoChatChannelsWidgetProps {
  activities: ActivityCardData[];
  chats: Record<string, ChatMessage[]>;
  selectedActivityId: string;
  onSelectChat: (activityId: string) => void;
}

export const CimoChatChannelsWidget: React.FC<CimoChatChannelsWidgetProps> = ({
  activities,
  chats,
  selectedActivityId,
  onSelectChat,
}) => {
  const joinedActivities = activities.filter((act) => act.isJoined);

  return (
    <aside className="bg-[#FCFDFD] border border-[#1F4E5F]/12 rounded-3xl p-5 shadow-[0_4px_24px_-4px_rgba(31,78,95,0.05)] flex flex-col gap-3.5 text-[#1F4E5F] w-full h-full overflow-y-auto" aria-label="Canales de Chat">
      {/* 1. Cabecera */}
      <div className="flex items-center justify-between pb-2 border-b border-[#1F4E5F]/8">
        <div className="flex items-center gap-1.5">
          <MessageCircle className="w-3.5 h-3.5 text-[#7FB77E]" />
          <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]">
            Mensajería de Crew
          </span>
        </div>
        <span className="text-[9px] font-black text-[#7FB77E] bg-[#7FB77E]/10 px-2 py-0.2 rounded-full">
          {joinedActivities.length} Activos
        </span>
      </div>

      {/* 2. Resumen de Canales */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#1F4E5F]/8 shadow-2xs flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase text-[#1F4E5F]/60 tracking-wider">
            Tus Grupos de Quedada
          </span>
          <Radio className="w-3 h-3 text-[#7FB77E] animate-pulse" />
        </div>

        <div className="flex flex-col gap-1.5">
          {joinedActivities.length === 0 ? (
            <p className="text-[11px] text-[#1F4E5F]/60 font-medium py-2 text-center">
              Únete a un entreno para activar su chat de coordinación.
            </p>
          ) : (
            joinedActivities.map((act) => {
              const isSelected = act.id === selectedActivityId;
              const msgs = chats[act.id] ?? [];
              const lastMsg = msgs[msgs.length - 1];

              return (
                <button
                  key={act.id}
                  type="button"
                  onClick={() => onSelectChat(act.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                    isSelected
                      ? 'bg-[#EEF2F2] border-[#7FB77E] shadow-2xs'
                      : 'bg-white border-[#1F4E5F]/8 hover:border-[#7FB77E]/40 hover:bg-[#EEF2F2]/40'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-[#1F4E5F] truncate">{act.title}</span>
                    </div>
                    <p className="text-[10px] text-[#1F4E5F]/60 truncate mt-0.2 font-medium">
                      {lastMsg ? `${lastMsg.senderName}: ${lastMsg.text}` : `${act.date} • ${act.time}`}
                    </p>
                  </div>
                  {msgs.length > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-[#7FB77E] text-white shrink-0">
                      {msgs.length}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* 3. Normas de Convivencia en el Chat */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#1F4E5F]/8 shadow-2xs flex flex-col gap-2">
        <span className="text-[10px] font-black uppercase text-[#1F4E5F]/60 tracking-wider">
          Protocolo CIMO
        </span>
        <div className="flex flex-col gap-1.5 text-[11px] font-bold text-[#1F4E5F]">
          <div className="flex items-center gap-2 p-1.5 bg-[#EEF2F2]/50 rounded-xl">
            <Clock className="w-3.5 h-3.5 text-[#7FB77E] shrink-0" />
            <span className="text-[10px]">Avisar con 2h si hay dudas o retrasos</span>
          </div>
          <div className="flex items-center gap-2 p-1.5 bg-[#EEF2F2]/50 rounded-xl">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#7FB77E] shrink-0" />
            <span className="text-[10px]">Confirmar asistencia al tercer tiempo</span>
          </div>
        </div>
      </div>

      {/* 4. Archivo Inteligente */}
      <div className="p-3 bg-[#EEF2F2]/40 rounded-2xl border border-[#7FB77E]/20 text-[#1F4E5F] flex items-start gap-2.5 mt-auto">
        <ShieldCheck className="w-4 h-4 text-[#7FB77E] flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-[11px] font-black text-[#1F4E5F]">Bandeja Limpia CIMO</h4>
          <p className="text-[10px] text-[#1F4E5F]/75 leading-relaxed mt-0.5 font-medium">
            Los chats se archivan automáticamente 48h tras el entreno para evitar notificaciones innecesarias.
          </p>
        </div>
      </div>
    </aside>
  );
};
