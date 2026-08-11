'use client';

import type { ReactNode } from 'react';
import { ScrollArea } from '../../../atoms';

const HELP_OPTIONS = ['Documentation', 'Contact support', 'System status', 'Community'];

export interface GlobalHelpPanelProps {
  children?: ReactNode;
}

export function GlobalHelpPanel({ children }: GlobalHelpPanelProps) {
  return (
    <ScrollArea visibility="auto" className="min-h-0 flex-1 bg-transparent">
      {children ?? (
        <div className="flex flex-col gap-2 p-4">
          {HELP_OPTIONS.map((item) => (
            <button key={item} type="button" className="border-border-technical text-text-main hover:bg-accent/10 hover:text-accent flex items-center justify-between rounded-md border px-3 py-3 text-left text-xs transition-colors dark:text-white">
              {item}
              <span aria-hidden="true">→</span>
            </button>
          ))}
        </div>
      )}
    </ScrollArea>
  );
}
