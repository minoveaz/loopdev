import React, { useState } from 'react';
import { Archive, Clock, MessageSquare, Timer } from 'lucide-react';
import type { ActivityCardData, ChatMessage } from '@loopdev/public-blocks';

export interface CimoChatListViewProps {
  activities: ActivityCardData[];
  chats: Record<string, ChatMessage[]>;
  selectedActivityId: string;
  onSelectChat: (activityId: string) => void;
}

export const CimoChatListView: React.FC<CimoChatListViewProps> = ({
  activities,
  chats,
  selectedActivityId,
  onSelectChat,
}) => {
  const [filterTab, setFilterTab] = useState<'active' | 'archived'>('active');
  const joinedActivities = activities.filter((act) => act.isJoined);

  return (
    <div className="shadow-xs flex flex-col gap-5 rounded-3xl border border-[#1F4E5F]/10 bg-white p-6 text-[#1F4E5F] sm:p-8">
      <div className="flex flex-col justify-between gap-3 border-b border-[#1F4E5F]/10 pb-3 sm:flex-row sm:items-center">
        <div>
          <span className="block text-[10px] font-black uppercase tracking-wider text-[#7FB77E]">
            Mensajería Grupal Efímera
          </span>
          <h2 className="text-xl font-black text-[#1F4E5F] sm:text-2xl">Chats de tus Crews</h2>
        </div>

        <div className="flex items-center gap-2 self-start rounded-2xl border border-[#1F4E5F]/10 bg-[#F7F7F7] p-1 sm:self-auto">
          <button
            type="button"
            onClick={() => setFilterTab('active')}
            className={`flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-black transition-all ${
              filterTab === 'active'
                ? 'shadow-2xs bg-white text-[#1F4E5F]'
                : 'text-[#1F4E5F]/60 hover:text-[#1F4E5F]'
            }`}
          >
            <Timer className="h-3.5 w-3.5 text-[#7FB77E]" />
            <span>Activos ({joinedActivities.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('archived')}
            className={`flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-black transition-all ${
              filterTab === 'archived'
                ? 'shadow-2xs bg-white text-[#1F4E5F]'
                : 'text-[#1F4E5F]/60 hover:text-[#1F4E5F]'
            }`}
          >
            <Archive className="h-3.5 w-3.5 text-[#1F4E5F]/40" />
            <span>Archivados (0)</span>
          </button>
        </div>
      </div>

      {/* Ephemeral Chat Policy Information Notice */}
      <div className="flex items-start gap-3 rounded-2xl border border-[#7FB77E]/20 bg-gradient-to-r from-[#7FB77E]/10 via-[#EEF2F2]/40 to-white p-4">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#7FB77E]/20 text-[#7FB77E]">
          <Clock className="h-4 w-4 text-[#7FB77E]" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-black text-[#1F4E5F]">Chats de Duración Limitada</h4>
            <span className="py-0.2 rounded-full bg-[#7FB77E]/15 px-2 text-[9px] font-black text-[#7FB77E]">
              Privacidad & Limpieza
            </span>
          </div>
          <p className="mt-0.5 text-[11px] font-medium leading-relaxed text-[#1F4E5F]/75">
            Los chats se abren para coordinar la quedada y el tercer tiempo, y{' '}
            <strong>se archivan automáticamente 24h después</strong> de la actividad para evitar
            grupos zombis y proteger la privacidad de todos.
          </p>
        </div>
      </div>

      {filterTab === 'archived' ? (
        <div className="flex flex-col items-center gap-2.5 py-12 text-center text-xs text-[#1F4E5F]/60">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EEF2F2] text-[#1F4E5F]/40">
            <Archive className="h-5 w-5" />
          </div>
          <p className="text-xs font-black text-[#1F4E5F]">
            No tienes chats archivados actualmente
          </p>
          <p className="max-w-xs text-[11px] leading-relaxed">
            Cuando un entreno concluya y pasen las 24 horas de gracia, su conversación se trasladará
            a este histórico en modo solo lectura.
          </p>
        </div>
      ) : joinedActivities.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center text-xs text-[#1F4E5F]/60">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF2F2] text-[#1F4E5F]/40">
            <MessageSquare className="h-6 w-6" />
          </div>
          <p className="text-sm font-black text-[#1F4E5F]">Aún no te has unido a ningún Crew</p>
          <p className="max-w-xs leading-relaxed">
            Explora los entrenamientos en el feed y pulsa "Unirme al Crew" para entrar a su grupo de
            conversación.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {joinedActivities.map((act) => {
            const isSelected = act.id === selectedActivityId;
            const messages = chats[act.id] ?? [];
            const lastMsg = messages[messages.length - 1];

            return (
              <div
                key={act.id}
                onClick={() => onSelectChat(act.id)}
                className={`flex cursor-pointer items-center justify-between gap-3.5 rounded-2xl border p-4 transition-all ${
                  isSelected
                    ? 'shadow-2xs border-[#7FB77E] bg-[#EEF2F2]/50'
                    : 'border-[#1F4E5F]/10 bg-white hover:border-[#7FB77E]/40 hover:bg-[#EEF2F2]/20'
                }`}
              >
                <div className="flex min-w-0 items-center gap-3.5 truncate">
                  <div className="shadow-2xs flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1F4E5F] text-base font-black uppercase text-white">
                    {act.sport.charAt(0)}
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-black text-[#1F4E5F]">
                        {act.title}
                      </span>
                      <span className="py-0.2 shrink-0 rounded-full bg-[#7FB77E]/10 px-2 text-[10px] font-black text-[#7FB77E]">
                        {act.date}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs font-medium text-[#1F4E5F]/65">
                      {lastMsg
                        ? `${lastMsg.senderName}: ${lastMsg.text}`
                        : 'No hay mensajes aún en esta quedada.'}
                    </p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="flex items-center gap-1 text-[10px] font-bold text-[#7FB77E]">
                        <Timer className="h-3 w-3 text-[#7FB77E]" />
                        <span>Activo • Cierra 24h tras el entreno</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span className="block text-[10px] font-bold text-[#1F4E5F]/40">
                    {lastMsg?.timestamp ?? act.time}
                  </span>
                  <span className="shadow-2xs mt-1 inline-flex items-center rounded-full bg-[#7FB77E] px-2 py-0.5 text-[10px] font-black text-white">
                    {messages.length} msgs
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
