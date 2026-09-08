import React from 'react';
import { CheckCircle2, Clock, MessageCircle, Radio, ShieldCheck } from 'lucide-react';
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
    <aside
      className="border-[#1F4E5F]/12 flex h-full w-full flex-col gap-3.5 overflow-y-auto rounded-3xl border bg-[#FCFDFD] p-5 text-[#1F4E5F] shadow-[0_4px_24px_-4px_rgba(31,78,95,0.05)]"
      aria-label="Canales de Chat"
    >
      {/* 1. Cabecera */}
      <div className="border-[#1F4E5F]/8 flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-1.5">
          <MessageCircle className="h-3.5 w-3.5 text-[#7FB77E]" />
          <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]">
            Mensajería de Crew
          </span>
        </div>
        <span className="py-0.2 rounded-full bg-[#7FB77E]/10 px-2 text-[9px] font-black text-[#7FB77E]">
          {joinedActivities.length} Activos
        </span>
      </div>

      {/* 2. Resumen de Canales */}
      <div className="border-[#1F4E5F]/8 shadow-2xs flex flex-col gap-2 rounded-2xl border bg-white p-3.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]/60">
            Tus Grupos de Quedada
          </span>
          <Radio className="h-3 w-3 animate-pulse text-[#7FB77E]" />
        </div>

        <div className="flex flex-col gap-1.5">
          {joinedActivities.length === 0 ? (
            <p className="py-2 text-center text-[11px] font-medium text-[#1F4E5F]/60">
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
                  className={`flex cursor-pointer items-center justify-between gap-2.5 rounded-xl border p-2.5 text-left transition-all ${
                    isSelected
                      ? 'shadow-2xs border-[#7FB77E] bg-[#EEF2F2]'
                      : 'border-[#1F4E5F]/8 bg-white hover:border-[#7FB77E]/40 hover:bg-[#EEF2F2]/40'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-xs font-black text-[#1F4E5F]">
                        {act.title}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2">
                      <p className="flex-1 truncate text-[10px] font-medium text-[#1F4E5F]/60">
                        {lastMsg
                          ? `${lastMsg.senderName}: ${lastMsg.text}`
                          : `${act.date} • ${act.time}`}
                      </p>
                      <span className="py-0.2 shrink-0 rounded-full bg-[#7FB77E]/10 px-1.5 text-[9px] font-bold text-[#7FB77E]">
                        ⏳ 24h
                      </span>
                    </div>
                  </div>
                  {msgs.length > 0 && (
                    <span className="shrink-0 rounded-full bg-[#7FB77E] px-1.5 py-0.5 text-[9px] font-black text-white">
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
      <div className="border-[#1F4E5F]/8 shadow-2xs flex flex-col gap-2 rounded-2xl border bg-white p-3.5">
        <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]/60">
          Protocolo CIMO
        </span>
        <div className="flex flex-col gap-1.5 text-[11px] font-bold text-[#1F4E5F]">
          <div className="flex items-center gap-2 rounded-xl bg-[#EEF2F2]/50 p-1.5">
            <Clock className="h-3.5 w-3.5 shrink-0 text-[#7FB77E]" />
            <span className="text-[10px]">Avisar con 2h si hay dudas o retrasos</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-[#EEF2F2]/50 p-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#7FB77E]" />
            <span className="text-[10px]">Confirmar asistencia al tercer tiempo</span>
          </div>
        </div>
      </div>

      {/* 4. Archivo Inteligente */}
      <div className="mt-auto flex items-start gap-2.5 rounded-2xl border border-[#7FB77E]/20 bg-[#EEF2F2]/40 p-3 text-[#1F4E5F]">
        <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#7FB77E]" />
        <div>
          <h4 className="text-[11px] font-black text-[#1F4E5F]">Chat de Duración Limitada</h4>
          <p className="mt-0.5 text-[10px] font-medium leading-relaxed text-[#1F4E5F]/75">
            Los chats de eventos son efímeros y se archivan automáticamente 24h tras el entreno para
            proteger la privacidad y evitar grupos zombis.
          </p>
        </div>
      </div>
    </aside>
  );
};
