'use client';

import { Clock, Briefcase, ListTodo, FileText } from 'lucide-react';
import { Button } from '@loopdev/ui';
import type { CustomerTabKey } from './types';

interface CustomerDesktopTabsProps {
  activeTab: CustomerTabKey;
  onSelectTab: (tab: CustomerTabKey) => void;
  timelineCount: number;
  opportunitiesCount: number;
  tasksCount: number;
  notesCount: number;
  isTimelineSimulated?: boolean;
  isOpportunitiesSimulated?: boolean;
  isTasksSimulated?: boolean;
  isNotesSimulated?: boolean;
}

export function CustomerDesktopTabs({
  activeTab,
  onSelectTab,
  timelineCount,
  opportunitiesCount,
  tasksCount,
  notesCount,
  isTimelineSimulated,
  isOpportunitiesSimulated,
  isTasksSimulated,
  isNotesSimulated,
}: CustomerDesktopTabsProps) {
  return (
    <div className="bg-surface-muted/20 hidden shrink-0 px-4 sm:px-6 lg:block">
      <nav
        className="no-scrollbar -mb-px flex gap-4 overflow-x-auto sm:gap-6"
        aria-label="Customer workspace tabs"
      >
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onSelectTab('timeline')}
          className={`flex items-center gap-2 whitespace-nowrap border-b-2 py-4 text-sm font-medium transition-all ${
            activeTab === 'timeline'
              ? 'border-primary text-primary font-semibold'
              : 'text-text-muted hover:border-border-subtle hover:text-text-main border-transparent'
          }`}
        >
          <Clock className="h-4 w-4" />
          Timeline
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              isTimelineSimulated
                ? 'border border-amber-500/30 bg-amber-500/15 text-amber-700 dark:text-amber-300'
                : 'bg-surface-muted text-text-muted'
            }`}
          >
            {timelineCount}
          </span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onSelectTab('opportunities')}
          className={`flex items-center gap-2 whitespace-nowrap border-b-2 py-4 text-sm font-medium transition-all ${
            activeTab === 'opportunities'
              ? 'border-primary text-primary font-semibold'
              : 'text-text-muted hover:border-border-subtle hover:text-text-main border-transparent'
          }`}
        >
          <Briefcase className="h-4 w-4" />
          Opportunities
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              isOpportunitiesSimulated
                ? 'border border-amber-500/30 bg-amber-500/15 text-amber-700 dark:text-amber-300'
                : 'bg-surface-muted text-text-muted'
            }`}
          >
            {opportunitiesCount}
          </span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onSelectTab('tasks')}
          className={`flex items-center gap-2 whitespace-nowrap border-b-2 py-4 text-sm font-medium transition-all ${
            activeTab === 'tasks'
              ? 'border-primary text-primary font-semibold'
              : 'text-text-muted hover:border-border-subtle hover:text-text-main border-transparent'
          }`}
        >
          <ListTodo className="h-4 w-4" />
          Tasks
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              isTasksSimulated
                ? 'border border-amber-500/30 bg-amber-500/15 text-amber-700 dark:text-amber-300'
                : 'bg-surface-muted text-text-muted'
            }`}
          >
            {tasksCount}
          </span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onSelectTab('notes')}
          className={`flex items-center gap-2 whitespace-nowrap border-b-2 py-4 text-sm font-medium transition-all ${
            activeTab === 'notes'
              ? 'border-primary text-primary font-semibold'
              : 'text-text-muted hover:border-border-subtle hover:text-text-main border-transparent'
          }`}
        >
          <FileText className="h-4 w-4" />
          Notes
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              isNotesSimulated
                ? 'border border-amber-500/30 bg-amber-500/15 text-amber-700 dark:text-amber-300'
                : 'bg-surface-muted text-text-muted'
            }`}
          >
            {notesCount}
          </span>
        </Button>
      </nav>
    </div>
  );
}
