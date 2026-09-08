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
        'flex h-[480px] flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm',
        className,
      )}
    >
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-4 py-3">
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        <span className="text-xs text-slate-500">{messages.length} mensajes</span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-slate-400">
            No hay mensajes aún. ¡Sé el primero en saludar al Crew!
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.isOwn ?? msg.senderId === currentUserId;
            return (
              <div
                key={msg.id}
                className={clsx(
                  'flex max-w-[80%] flex-col',
                  isOwn ? 'items-end self-end' : 'items-start self-start',
                )}
              >
                {!isOwn && (
                  <span className="mb-0.5 ml-1 text-[11px] font-medium text-slate-500">
                    {msg.senderName}
                  </span>
                )}
                <div
                  className={clsx(
                    'rounded-2xl px-3.5 py-2 text-xs leading-relaxed',
                    isOwn
                      ? 'rounded-br-xs bg-[var(--lpd-brand-primary)] text-white shadow-sm'
                      : 'rounded-bl-xs bg-slate-100 text-slate-800',
                  )}
                >
                  {msg.text}
                </div>
                <span className="mx-1 mt-1 text-[10px] text-slate-400">{msg.timestamp}</span>
              </div>
            );
          })
        )}
      </div>

      {/* Message Input Form */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t border-slate-100 bg-white p-3"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          className="min-h-[38px] flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--lpd-brand-primary)]"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          aria-label="Enviar mensaje"
          className={clsx(
            'flex min-h-[38px] min-w-[38px] items-center justify-center rounded-xl p-2.5 transition-colors',
            text.trim()
              ? 'bg-[var(--lpd-brand-primary)] text-white shadow-sm hover:bg-[var(--lpd-brand-primary-hover)]'
              : 'cursor-not-allowed bg-slate-100 text-slate-300',
          )}
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};
