'use client';

import { Bot } from 'lucide-react';
import { ScrollArea } from '../../../atoms';
import type { ReactNode } from 'react';

export interface GlobalAIAssistantPanelProps {
  children?: ReactNode;
}

export function GlobalAIAssistantPanel({ children }: GlobalAIAssistantPanelProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-transparent">
      <ScrollArea visibility="auto" className="min-h-0 flex-1 bg-transparent">
        {children ?? (
          <div className="flex min-h-full flex-col items-center justify-center px-8 py-12 text-center">
            <Bot size={28} className="text-primary mb-3" aria-hidden="true" />
            <p className="text-text-main text-sm font-semibold dark:text-white">How can I help?</p>
            <p className="text-text-muted mt-1 text-xs leading-relaxed">Ask about your workspace, data, or the current suite.</p>
          </div>
        )}
      </ScrollArea>
      <div className="border-border-technical shrink-0 border-t bg-transparent p-3">
        <div className="border-border-technical text-text-muted rounded-md border px-3 py-2 text-xs">Ask LoopDev AI...</div>
      </div>
    </div>
  );
}
