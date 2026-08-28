import React, { useState } from 'react';
import {
  ChatStreamWidget,
  CrewAvatarGroup,
  FeedbackRatingBlock,
  type ActivityCardData,
  type ChatMessage,
} from '@loopdev/public-blocks';
import { CheckCircle2, MessageSquare, Star, Users } from 'lucide-react';

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
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 text-center text-xs text-slate-400 sticky top-20 shadow-sm">
        Selecciona un plan para ver los detalles y el chat en vivo del Crew.
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm flex flex-col gap-4 sticky top-20">
      {/* Activity Summary Header */}
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--lpd-brand-primary)]">
          {activity.sport} • {activity.level}
        </span>
        <h2 className="text-base font-bold text-slate-900 leading-tight mt-1">{activity.title}</h2>
        <p className="text-xs text-slate-500 mt-1">{activity.location}</p>
      </div>

      {/* Crew Members Row */}
      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
        <div className="flex items-center gap-2">
          <CrewAvatarGroup members={activity.currentMembers} size="sm" />
          <span className="text-xs font-semibold text-slate-700">
            {activity.currentMembers.length}/{activity.maxMembers} deportistas
          </span>
        </div>
        {activity.isJoined ? (
          <span className="text-xs font-bold text-[var(--lpd-brand-primary)] flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Dentro
          </span>
        ) : (
          <button
            type="button"
            onClick={() => onJoin(activity.id)}
            className="px-3 py-1 text-xs font-bold text-white bg-[var(--lpd-brand-primary)] hover:bg-[var(--lpd-brand-primary-hover)] rounded-lg transition-colors shadow-sm min-h-[32px]"
          >
            Unirme
          </button>
        )}
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center border-b border-slate-100 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-1.5 pb-2 text-xs font-bold border-b-2 transition-colors min-h-[36px] ${
            activeTab === 'chat'
              ? 'border-[var(--lpd-brand-primary)] text-[var(--lpd-brand-primary)]'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Chat Crew</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('feedback')}
          className={`flex items-center gap-1.5 pb-2 text-xs font-bold border-b-2 transition-colors min-h-[36px] ${
            activeTab === 'feedback'
              ? 'border-[var(--lpd-brand-primary)] text-[var(--lpd-brand-primary)]'
              : 'border-transparent text-slate-400 hover:text-slate-700'
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
          title={`Chat de ${activity.sport}`}
          placeholder="Escribe al Crew..."
          className="h-[340px] border-none shadow-none p-0"
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
    </div>
  );
};
