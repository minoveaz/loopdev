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
  CheckCircle2,
  ChevronRight,
  Clock,
  MapPin,
  MessageSquare,
  Star,
  Users,
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
      <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-8 text-center text-xs text-[#1F4E5F]/50 sticky top-20 shadow-xs">
        Selecciona un plan del feed para ver los detalles del Crew, la ruta y el chat en vivo.
      </div>
    );
  }

  const isFull = activity.currentMembers.length >= activity.maxMembers;
  const isJoined = Boolean(activity.isJoined);

  return (
    <aside
      aria-label="Detalle del Crew"
      className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-5 shadow-xs flex flex-col gap-4 sticky top-20 text-[#1F4E5F]"
    >
      {/* Activity Mini Banner */}
      <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-[#1F4E5F]/5">
        {activity.image ? (
          <img src={activity.image} alt={activity.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-[#1F4E5F] text-white flex items-center justify-center font-black">
            CIMO
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F4E5F]/90 via-transparent to-transparent" />
        <div className="absolute bottom-2.5 left-3 right-3 text-white">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#7FB77E] block">
            {activity.sport} • {activity.level}
          </span>
          <h2 className="text-sm font-extrabold leading-tight">{activity.title}</h2>
        </div>
      </div>

      {/* Date & Location */}
      <div className="space-y-1.5 text-xs text-[#1F4E5F]/80 pb-3 border-b border-[#F7F7F7]">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-[#7FB77E]" />
          <span className="font-bold">
            {activity.date} a las {activity.time} h
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-[#7FB77E]" />
          <span className="truncate">{activity.location}</span>
        </div>
      </div>

      {/* Crew Members Row & Join Button */}
      <div className="flex items-center justify-between p-3 bg-[#F7F7F7] rounded-2xl border border-[#1F4E5F]/5">
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
          className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all flex items-center gap-1 cursor-pointer ${
            isJoined
              ? 'bg-[#7FB77E] text-white shadow-xs'
              : isFull
                ? 'bg-[#1F4E5F]/10 text-[#1F4E5F]/50 cursor-not-allowed'
                : 'bg-[#1F4E5F] hover:bg-[#183e4c] text-white shadow-xs'
          }`}
        >
          {isJoined ? (
            <>
              <Check className="w-3 h-3 stroke-[3]" />
              <span>You're In</span>
            </>
          ) : isFull ? (
            <span>Lleno</span>
          ) : (
            <>
              <span>Join</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center border-b border-[#1F4E5F]/10 gap-4">
        <button
          type="button"
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-1.5 pb-2 text-xs font-extrabold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'chat'
              ? 'border-[#1F4E5F] text-[#1F4E5F]'
              : 'border-transparent text-[#1F4E5F]/40 hover:text-[#1F4E5F]'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Chat del Crew</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('feedback')}
          className={`flex items-center gap-1.5 pb-2 text-xs font-extrabold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'feedback'
              ? 'border-[#1F4E5F] text-[#1F4E5F]'
              : 'border-transparent text-[#1F4E5F]/40 hover:text-[#1F4E5F]'
          }`}
        >
          <Star className="w-3.5 h-3.5" />
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
          className="h-[320px] border-none shadow-none p-0"
        />
      ) : (
        <FeedbackRatingBlock
          activityTitle={activity.title}
          onSubmit={(feedback) => {
            console.log('Feedback enviado:', feedback);
          }}
          className="border-none shadow-none p-0"
        />
      )}
    </aside>
  );
};
