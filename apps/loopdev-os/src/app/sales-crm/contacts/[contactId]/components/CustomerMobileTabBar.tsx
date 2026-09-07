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
    <div className="fixed bottom-[calc(3.5rem+env(safe-area-inset-bottom,0px))] inset-x-0 z-30 px-3 py-1 pointer-events-none lg:hidden flex justify-center">
      <div className="w-full max-w-sm bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-xl border border-border-subtle rounded-2xl p-1 shadow-lg flex items-center justify-between gap-0.5 pointer-events-auto">
        <button
          type="button"
          onClick={() => onSelectTab('contact')}
          className={`flex-1 py-1.5 px-1 rounded-xl text-[10px] sm:text-[11px] font-medium transition-all text-center flex items-center justify-center gap-1 outline-none focus:outline-none min-w-0 ${
            activeTab === 'contact'
              ? 'bg-primary text-white font-semibold shadow-xs'
              : 'text-text-muted hover:text-text-main active:bg-surface-muted/60'
          }`}
        >
          <User className="h-3.5 w-3.5 shrink-0" strokeWidth={activeTab === 'contact' ? 2 : 1.75} />
          <span className="truncate">Contacto</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('timeline')}
          className={`flex-1 py-1.5 px-1 rounded-xl text-[10px] sm:text-[11px] font-medium transition-all text-center flex items-center justify-center gap-1 outline-none focus:outline-none min-w-0 ${
            activeTab === 'timeline'
              ? 'bg-primary text-white font-semibold shadow-xs'
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
              className={`text-[9px] px-1 py-0.2 rounded-full leading-tight font-medium shrink-0 ${
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
          className={`flex-1 py-1.5 px-1 rounded-xl text-[10px] sm:text-[11px] font-medium transition-all text-center flex items-center justify-center gap-1 outline-none focus:outline-none min-w-0 ${
            activeTab === 'opportunities'
              ? 'bg-primary text-white font-semibold shadow-xs'
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
              className={`text-[9px] px-1 py-0.2 rounded-full leading-tight font-medium shrink-0 ${
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
          className={`flex-1 py-1.5 px-1 rounded-xl text-[10px] sm:text-[11px] font-medium transition-all text-center flex items-center justify-center gap-1 outline-none focus:outline-none min-w-0 ${
            activeTab === 'tasks'
              ? 'bg-primary text-white font-semibold shadow-xs'
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
              className={`text-[9px] px-1 py-0.2 rounded-full leading-tight font-bold shrink-0 ${
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
          className={`flex-1 py-1.5 px-1 rounded-xl text-[10px] sm:text-[11px] font-medium transition-all text-center flex items-center justify-center gap-1 outline-none focus:outline-none min-w-0 ${
            activeTab === 'notes'
              ? 'bg-primary text-white font-semibold shadow-xs'
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
