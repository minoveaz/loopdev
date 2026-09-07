'use client';

import { User, Clock, Briefcase, ListTodo, FileText } from 'lucide-react';
import type { CustomerTabKey } from './types';

interface CustomerMobileTabBarProps {
  activeTab: CustomerTabKey;
  onSelectTab: (tab: CustomerTabKey) => void;
  timelineCount: number;
  opportunitiesCount: number;
  openTasksCount: number;
}

export function CustomerMobileTabBar({
  activeTab,
  onSelectTab,
  timelineCount,
  opportunitiesCount,
  openTasksCount,
}: CustomerMobileTabBarProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom,0px))] z-30 flex justify-center px-3 py-1 lg:hidden">
      <div className="bg-surface-light/95 dark:bg-surface-dark/95 border-border-subtle pointer-events-auto flex w-full max-w-sm items-center justify-between gap-0.5 rounded-2xl border p-1 shadow-lg backdrop-blur-xl">
        <button
          type="button"
          onClick={() => onSelectTab('contact')}
          className={`flex min-w-0 flex-1 items-center justify-center gap-1 rounded-xl px-1 py-1.5 text-center text-[10px] font-medium outline-none transition-all focus:outline-none sm:text-[11px] ${
            activeTab === 'contact'
              ? 'bg-primary shadow-xs font-semibold text-white'
              : 'text-text-muted hover:text-text-main active:bg-surface-muted/60'
          }`}
        >
          <User className="h-3.5 w-3.5 shrink-0" strokeWidth={activeTab === 'contact' ? 2 : 1.75} />
          <span className="truncate">Contacto</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('timeline')}
          className={`flex min-w-0 flex-1 items-center justify-center gap-1 rounded-xl px-1 py-1.5 text-center text-[10px] font-medium outline-none transition-all focus:outline-none sm:text-[11px] ${
            activeTab === 'timeline'
              ? 'bg-primary shadow-xs font-semibold text-white'
              : 'text-text-muted hover:text-text-main active:bg-surface-muted/60'
          }`}
        >
          <Clock
            className="h-3.5 w-3.5 shrink-0"
            strokeWidth={activeTab === 'timeline' ? 2 : 1.75}
          />
          <span className="truncate">Historial</span>
          {timelineCount > 0 && (
            <span
              className={`py-0.2 shrink-0 rounded-full px-1 text-[9px] font-medium leading-tight ${
                activeTab === 'timeline'
                  ? 'bg-white/25 text-white'
                  : 'bg-surface-muted text-text-muted'
              }`}
            >
              {timelineCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('opportunities')}
          className={`flex min-w-0 flex-1 items-center justify-center gap-1 rounded-xl px-1 py-1.5 text-center text-[10px] font-medium outline-none transition-all focus:outline-none sm:text-[11px] ${
            activeTab === 'opportunities'
              ? 'bg-primary shadow-xs font-semibold text-white'
              : 'text-text-muted hover:text-text-main active:bg-surface-muted/60'
          }`}
        >
          <Briefcase
            className="h-3.5 w-3.5 shrink-0"
            strokeWidth={activeTab === 'opportunities' ? 2 : 1.75}
          />
          <span className="truncate">Tratos</span>
          {opportunitiesCount > 0 && (
            <span
              className={`py-0.2 shrink-0 rounded-full px-1 text-[9px] font-medium leading-tight ${
                activeTab === 'opportunities'
                  ? 'bg-white/25 text-white'
                  : 'bg-surface-muted text-text-muted'
              }`}
            >
              {opportunitiesCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('tasks')}
          className={`flex min-w-0 flex-1 items-center justify-center gap-1 rounded-xl px-1 py-1.5 text-center text-[10px] font-medium outline-none transition-all focus:outline-none sm:text-[11px] ${
            activeTab === 'tasks'
              ? 'bg-primary shadow-xs font-semibold text-white'
              : 'text-text-muted hover:text-text-main active:bg-surface-muted/60'
          }`}
        >
          <ListTodo
            className="h-3.5 w-3.5 shrink-0"
            strokeWidth={activeTab === 'tasks' ? 2 : 1.75}
          />
          <span className="truncate">Tareas</span>
          {openTasksCount > 0 && (
            <span
              className={`py-0.2 shrink-0 rounded-full px-1 text-[9px] font-bold leading-tight ${
                activeTab === 'tasks'
                  ? 'bg-white/25 text-white'
                  : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
              }`}
            >
              {openTasksCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('notes')}
          className={`flex min-w-0 flex-1 items-center justify-center gap-1 rounded-xl px-1 py-1.5 text-center text-[10px] font-medium outline-none transition-all focus:outline-none sm:text-[11px] ${
            activeTab === 'notes'
              ? 'bg-primary shadow-xs font-semibold text-white'
              : 'text-text-muted hover:text-text-main active:bg-surface-muted/60'
          }`}
        >
          <FileText
            className="h-3.5 w-3.5 shrink-0"
            strokeWidth={activeTab === 'notes' ? 2 : 1.75}
          />
          <span className="truncate">Notas</span>
        </button>
      </div>
    </div>
  );
}
