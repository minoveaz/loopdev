'use client';

import React, { useState } from 'react';
import { clsx } from 'clsx';
import { Send } from 'lucide-react';
import type { ChatStreamWidgetProps } from './types';

export const ChatStreamWidget: React.FC<ChatStreamWidgetProps> = ({
  messages,
  onSendMessage,
  currentUserId,
  title = 'Chat del Crew',
  placeholder = 'Escribe un mensaje...',
  className,
}) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text.trim());
    setText('');
  };

  return (
    <div
      className={clsx(
        'bg-white border border-slate-200/90 rounded-2xl flex flex-col h-[480px] shadow-sm overflow-hidden',
        className,
      )}
    >
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        <span className="text-xs text-slate-500">{messages.length} mensajes</span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-400">
            No hay mensajes aún. ¡Sé el primero en saludar al Crew!
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.isOwn ?? msg.senderId === currentUserId;
            return (
              <div
                key={msg.id}
                className={clsx(
                  'flex flex-col max-w-[80%]',
                  isOwn ? 'self-end items-end' : 'self-start items-start',
                )}
              >
                {!isOwn && (
                  <span className="text-[11px] font-medium text-slate-500 mb-0.5 ml-1">
                    {msg.senderName}
                  </span>
                )}
                <div
                  className={clsx(
                    'px-3.5 py-2 rounded-2xl text-xs leading-relaxed',
                    isOwn
                      ? 'bg-[var(--lpd-brand-primary)] text-white rounded-br-xs shadow-sm'
                      : 'bg-slate-100 text-slate-800 rounded-bl-xs',
                  )}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 mx-1">{msg.timestamp}</span>
              </div>
            );
          })
        )}
      </div>

      {/* Message Input Form */}
      <form
        onSubmit={handleSubmit}
        className="p-3 border-t border-slate-100 flex items-center gap-2 bg-white"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--lpd-brand-primary)] focus:bg-white transition-all min-h-[38px]"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          aria-label="Enviar mensaje"
          className={clsx(
            'p-2.5 rounded-xl transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center',
            text.trim()
              ? 'bg-[var(--lpd-brand-primary)] hover:bg-[var(--lpd-brand-primary-hover)] text-white shadow-sm'
              : 'bg-slate-100 text-slate-300 cursor-not-allowed',
          )}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
