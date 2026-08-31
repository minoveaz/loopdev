import React from 'react';
import { MessageSquare, Users } from 'lucide-react';
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
  const joinedActivities = activities.filter((act) => act.isJoined);

  return (
    <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-5 text-[#1F4E5F]">
      <div className="flex items-center justify-between pb-3 border-b border-[#1F4E5F]/10">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#7FB77E] block">
            Mensajería Grupal
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#1F4E5F]">Chats de tus Crews</h2>
        </div>
        <span className="text-xs font-black bg-[#7FB77E]/10 text-[#7FB77E] border border-[#7FB77E]/20 px-3 py-1 rounded-full">
          {joinedActivities.length} activos
        </span>
      </div>

      {joinedActivities.length === 0 ? (
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
                  <div className="w-12 h-12 rounded-2xl bg-[#1F4E5F] text-white flex items-center justify-center shrink-0 font-black text-base uppercase">
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
