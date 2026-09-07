import React, { useState } from 'react';
import {
  ChatStreamWidget,
  CrewAvatarGroup,
  FeedbackRatingBlock,
  type ActivityCardData,
  type ChatMessage,
} from '@loopdev/public-blocks';
import {
  Calendar,
  Check,
  ChevronRight,
  MapPin,
  MessageSquare,
  Star,
} from 'lucide-react';

export interface CimoCrewDetailInspectorProps {
  activity: ActivityCardData | null;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onJoin: (activityId: string) => void;
}

export const CimoCrewDetailInspector: React.FC<CimoCrewDetailInspectorProps> = ({
  activity,
  messages,
  onSendMessage,
  onJoin,
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'info' | 'feedback'>('chat');

  if (!activity) {
    return (
      <div className="shadow-xs sticky top-20 rounded-3xl border border-[#1F4E5F]/10 bg-white p-8 text-center text-xs text-[#1F4E5F]/50">
        Selecciona un plan del feed para ver los detalles del Crew, la ruta y el chat en vivo.
      </div>
    );
  }

  const isFull = activity.currentMembers.length >= activity.maxMembers;
  const isJoined = Boolean(activity.isJoined);

  return (
    <aside
      aria-label="Detalle del Crew"
      className="shadow-xs sticky top-20 flex flex-col gap-4 rounded-3xl border border-[#1F4E5F]/10 bg-white p-5 text-[#1F4E5F]"
    >
      {/* Activity Mini Banner */}
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-[#1F4E5F]/5">
        {activity.image ? (
          <img src={activity.image} alt={activity.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#1F4E5F] font-black text-white">
            CIMO
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F4E5F]/90 via-transparent to-transparent" />
        <div className="absolute bottom-2.5 left-3 right-3 text-white">
          <span className="block text-[10px] font-black uppercase tracking-wider text-[#7FB77E]">
            {activity.sport} • {activity.level}
          </span>
          <h2 className="text-sm font-extrabold leading-tight">{activity.title}</h2>
        </div>
      </div>

      {/* Date & Location */}
      <div className="space-y-1.5 border-b border-[#F7F7F7] pb-3 text-xs text-[#1F4E5F]/80">
        <div className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-[#7FB77E]" />
          <span className="font-bold">
            {activity.date} a las {activity.time} h
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-[#7FB77E]" />
          <span className="truncate">{activity.location}</span>
        </div>
      </div>

      {/* Crew Members Row & Join Button */}
      <div className="flex items-center justify-between rounded-2xl border border-[#1F4E5F]/5 bg-[#F7F7F7] p-3">
        <div className="flex items-center gap-2">
          <CrewAvatarGroup members={activity.currentMembers} size="sm" />
          <span className="text-xs font-extrabold text-[#1F4E5F]">
            {activity.currentMembers.length}/{activity.maxMembers}
          </span>
        </div>

        <button
          type="button"
          disabled={isFull && !isJoined}
          onClick={() => onJoin(activity.id)}
          className={`flex cursor-pointer items-center gap-1 rounded-full px-3.5 py-1.5 text-xs font-extrabold transition-all ${
            isJoined
              ? 'shadow-xs bg-[#7FB77E] text-white'
              : isFull
                ? 'cursor-not-allowed bg-[#1F4E5F]/10 text-[#1F4E5F]/50'
                : 'shadow-xs bg-[#1F4E5F] text-white hover:bg-[#183e4c]'
          }`}
        >
          {isJoined ? (
            <>
              <Check className="h-3 w-3 stroke-[3]" />
              <span>You're In</span>
            </>
          ) : isFull ? (
            <span>Lleno</span>
          ) : (
            <>
              <span>Join</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-4 border-b border-[#1F4E5F]/10">
        <button
          type="button"
          onClick={() => setActiveTab('chat')}
          className={`flex cursor-pointer items-center gap-1.5 border-b-2 pb-2 text-xs font-extrabold transition-colors ${
            activeTab === 'chat'
              ? 'border-[#1F4E5F] text-[#1F4E5F]'
              : 'border-transparent text-[#1F4E5F]/40 hover:text-[#1F4E5F]'
          }`}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span>Chat del Crew</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('feedback')}
          className={`flex cursor-pointer items-center gap-1.5 border-b-2 pb-2 text-xs font-extrabold transition-colors ${
            activeTab === 'feedback'
              ? 'border-[#1F4E5F] text-[#1F4E5F]'
              : 'border-transparent text-[#1F4E5F]/40 hover:text-[#1F4E5F]'
          }`}
        >
          <Star className="h-3.5 w-3.5" />
          <span>Valorar</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'chat' ? (
        <ChatStreamWidget
          messages={messages}
          onSendMessage={onSendMessage}
          title={`Chat • ${activity.sport}`}
          placeholder="Escribe al Crew..."
          className="h-[320px] border-none p-0 shadow-none"
        />
      ) : (
        <FeedbackRatingBlock
          activityTitle={activity.title}
          onSubmit={(feedback) => {
            console.log('Feedback enviado:', feedback);
          }}
          className="border-none p-0 shadow-none"
        />
      )}
    </aside>
  );
};
