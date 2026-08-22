'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

type FeedbackTone = 'success' | 'error' | 'warning' | 'info';
type FeedbackMessage = { id: number; tone: FeedbackTone; message: string };

type FeedbackApi = {
  notify: (tone: FeedbackTone, message: string) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
};

const FeedbackContext = createContext<FeedbackApi | null>(null);

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<FeedbackMessage[]>([]);
  const notify = useCallback((tone: FeedbackTone, message: string) => {
    const id = Date.now();
    setMessages((current) => [...current, { id, tone, message }]);
    window.setTimeout(() => setMessages((current) => current.filter((item) => item.id !== id)), 5000);
  }, []);
  const value = useMemo(() => ({
    notify,
    success: (message: string) => notify('success', message),
    error: (message: string) => notify('error', message),
    warning: (message: string) => notify('warning', message),
    info: (message: string) => notify('info', message),
  }), [notify]);
  return (
    <FeedbackContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex flex-col items-end gap-2 sm:left-auto sm:w-[min(24rem,calc(100vw-2rem))]" aria-live="polite">
        {messages.map((item) => (
          <div key={item.id} role={item.tone === 'error' ? 'alert' : 'status'} className="pointer-events-auto w-full rounded-lg border bg-background px-4 py-3 text-sm text-foreground shadow-lg">
            {item.message}
          </div>
        ))}
      </div>
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const feedback = useContext(FeedbackContext);
  if (!feedback) throw new Error('useFeedback must be used within FeedbackProvider');
  return feedback;
}
