import React, { useState } from 'react';
import { Archive, Clock, MessageSquare, ShieldCheck, Sparkles, Timer, Users } from 'lucide-react';
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
    <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-5 text-[#1F4E5F]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1F4E5F]/10">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#7FB77E] block">
            Mensajería Grupal Efímera
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#1F4E5F]">Chats de tus Crews</h2>
        </div>

        <div className="flex items-center gap-2 bg-[#F7F7F7] p-1 rounded-2xl border border-[#1F4E5F]/10 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFilterTab('active')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              filterTab === 'active'
                ? 'bg-white text-[#1F4E5F] shadow-2xs'
                : 'text-[#1F4E5F]/60 hover:text-[#1F4E5F]'
            }`}
          >
            <Timer className="w-3.5 h-3.5 text-[#7FB77E]" />
            <span>Activos ({joinedActivities.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('archived')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              filterTab === 'archived'
                ? 'bg-white text-[#1F4E5F] shadow-2xs'
                : 'text-[#1F4E5F]/60 hover:text-[#1F4E5F]'
            }`}
          >
            <Archive className="w-3.5 h-3.5 text-[#1F4E5F]/40" />
            <span>Archivados (0)</span>
          </button>
        </div>
      </div>

      {/* Ephemeral Chat Policy Information Notice */}
      <div className="p-4 bg-gradient-to-r from-[#7FB77E]/10 via-[#EEF2F2]/40 to-white rounded-2xl border border-[#7FB77E]/20 flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-[#7FB77E]/20 text-[#7FB77E] flex items-center justify-center shrink-0 mt-0.5">
          <Clock className="w-4 h-4 text-[#7FB77E]" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-black text-[#1F4E5F]">Chats de Duración Limitada</h4>
            <span className="text-[9px] font-black text-[#7FB77E] bg-[#7FB77E]/15 px-2 py-0.2 rounded-full">
              Privacidad & Limpieza
            </span>
          </div>
          <p className="text-[11px] text-[#1F4E5F]/75 font-medium leading-relaxed mt-0.5">
            Los chats se abren para coordinar la quedada y el tercer tiempo, y <strong>se archivan automáticamente 24h después</strong> de la actividad para evitar grupos zombis y proteger la privacidad de todos.
          </p>
        </div>
      </div>

      {filterTab === 'archived' ? (
        <div className="py-12 text-center text-xs text-[#1F4E5F]/60 flex flex-col items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#EEF2F2] flex items-center justify-center text-[#1F4E5F]/40">
            <Archive className="w-5 h-5" />
          </div>
          <p className="font-black text-xs text-[#1F4E5F]">No tienes chats archivados actualmente</p>
          <p className="max-w-xs text-[11px] leading-relaxed">
            Cuando un entreno concluya y pasen las 24 horas de gracia, su conversación se trasladará a este histórico en modo solo lectura.
          </p>
        </div>
      ) : joinedActivities.length === 0 ? (
        <div className="py-16 text-center text-xs text-[#1F4E5F]/60 flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#EEF2F2] flex items-center justify-center text-[#1F4E5F]/40">
            <MessageSquare className="w-6 h-6" />
          </div>
          <p className="font-black text-sm text-[#1F4E5F]">Aún no te has unido a ningún Crew</p>
          <p className="max-w-xs leading-relaxed">
            Explora los entrenamientos en el feed y pulsa "Unirme al Crew" para entrar a su grupo de conversación.
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
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3.5 ${
                  isSelected
                    ? 'border-[#7FB77E] bg-[#EEF2F2]/50 shadow-2xs'
                    : 'border-[#1F4E5F]/10 bg-white hover:border-[#7FB77E]/40 hover:bg-[#EEF2F2]/20'
                }`}
              >
                <div className="flex items-center gap-3.5 truncate min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-[#1F4E5F] text-white flex items-center justify-center shrink-0 font-black text-base uppercase shadow-2xs">
                    {act.sport.charAt(0)}
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-[#1F4E5F] truncate">{act.title}</span>
                      <span className="text-[10px] text-[#7FB77E] font-black shrink-0 bg-[#7FB77E]/10 px-2 py-0.2 rounded-full">
                        {act.date}
                      </span>
                    </div>
                    <p className="text-xs text-[#1F4E5F]/65 font-medium truncate mt-0.5">
                      {lastMsg ? `${lastMsg.senderName}: ${lastMsg.text}` : 'No hay mensajes aún en esta quedada.'}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[10px] font-bold text-[#7FB77E] flex items-center gap-1">
                        <Timer className="w-3 h-3 text-[#7FB77E]" />
                        <span>Activo • Cierra 24h tras el entreno</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-[#1F4E5F]/40 font-bold block">
                    {lastMsg?.timestamp ?? act.time}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-[#7FB77E] text-white mt-1 shadow-2xs">
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
