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
    <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-6 shadow-xs flex flex-col gap-5 text-[#1F4E5F]">
      <div className="flex items-center justify-between pb-3 border-b border-[#1F4E5F]/10">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#7FB77E] block">
            Mensajería Grupal
          </span>
          <h2 className="text-xl font-extrabold text-[#1F4E5F]">Chats de tus Crews</h2>
        </div>
        <span className="text-xs font-bold bg-[#7FB77E]/20 text-[#1F4E5F] px-3 py-1 rounded-full">
          {joinedActivities.length} activos
        </span>
      </div>

      {joinedActivities.length === 0 ? (
        <div className="py-12 text-center text-xs text-[#1F4E5F]/50 flex flex-col items-center gap-2">
          <MessageSquare className="w-8 h-8 text-[#1F4E5F]/30" />
          <p className="font-bold">Aún no te has unido a ningún Crew.</p>
          <p>Explora los planes en el feed y dale a "Join Crew" para entrar al chat.</p>
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
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'border-[#1F4E5F] bg-[#F7F7F7] shadow-xs'
                    : 'border-[#1F4E5F]/10 hover:border-[#1F4E5F]/30 hover:bg-[#F7F7F7]/50'
                }`}
              >
                <div className="flex items-center gap-3.5 truncate">
                  <div className="w-11 h-11 rounded-2xl bg-[#1F4E5F] text-white flex items-center justify-center shrink-0 font-extrabold text-sm capitalize">
                    {act.sport.charAt(0)}
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-[#1F4E5F] truncate">{act.title}</span>
                      <span className="text-[10px] text-[#7FB77E] font-bold shrink-0">{act.date}</span>
                    </div>
                    <p className="text-xs text-[#1F4E5F]/60 truncate mt-0.5">
                      {lastMsg ? `${lastMsg.senderName}: ${lastMsg.text}` : 'No hay mensajes aún.'}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-[#1F4E5F]/40 font-bold block">
                    {lastMsg?.timestamp ?? act.time}
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#00B894] text-white mt-1">
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
