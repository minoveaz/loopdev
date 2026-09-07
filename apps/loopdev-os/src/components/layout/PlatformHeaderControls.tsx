'use client';

import type { ReactNode } from 'react';
import { CircleHelp, FlaskConical, Lightbulb } from 'lucide-react';
import {
  BrandLogo,
  IconButton,
  NotificationCenter,
  type PlatformContextPanelMode,
  type NotificationItem,
  ThemeToggle,
} from '@loopdev/ui';
import { useSimulation } from '@/providers/SimulationProvider';

interface PlatformHeaderActionButtonProps {
  label: string;
  title: string;
  onClick?: () => void;
  active?: boolean;
  danger?: boolean;
  children: ReactNode;
}

export function PlatformHeaderActionButton({
  label,
  title,
  onClick,
  active = false,
  danger = false,
  children,
}: PlatformHeaderActionButtonProps) {
  return (
    <IconButton
      icon="help"
      aria-label={label}
      aria-pressed={active}
      title={title}
      ariaLabel={label}
      tooltip={title}
      className={`${active ? '!border-transparent !bg-[var(--lpd-color-brand-primary)] !text-white hover:!border-transparent hover:!bg-[var(--lpd-color-brand-primary)] hover:!text-white focus-visible:!border-transparent focus-visible:!bg-[var(--lpd-color-brand-primary)] focus-visible:!text-white focus-visible:!ring-[var(--lpd-color-brand-primary)]' : `${danger ? 'border-danger dark:border-danger' : 'border-black/10 dark:border-white/10'} text-text-muted bg-white/50 dark:bg-black/20 hover:bg-primary/10 hover:text-primary focus-visible:border-primary/50`} group relative flex !size-9 items-center justify-center !rounded-full border transition-all duration-300 hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2`}
      onClick={onClick}
    >
      {children}
    </IconButton>
  );
}

interface PlatformHeaderControlsProps {
  notifications: NotificationItem[];
  unreadCount: number;
  onOpenHelp?: () => void;
  onOpenAI?: () => void;
  onOpenNotifications?: () => void;
  activeContext?: PlatformContextPanelMode | null;
  onViewAllNotifications?: () => void;
  onMarkAsRead?: (id: string) => void;
  onMarkAllRead?: () => void;
  onRemoveNotification?: (id: string) => void;
  onClearNotifications?: () => void;
}

export function PlatformHeaderControls({
  notifications,
  unreadCount,
  onOpenHelp,
  onOpenAI,
  onOpenNotifications,
  activeContext,
  onViewAllNotifications = () => undefined,
  onMarkAsRead = () => undefined,
  onMarkAllRead = () => undefined,
  onRemoveNotification = () => undefined,
  onClearNotifications = () => undefined,
}: PlatformHeaderControlsProps) {
  const { isSimulationActive, toggleSimulation } = useSimulation();

  return (
    <div className="flex items-center gap-1.5">
      <div className="hidden items-center gap-1.5 lg:flex">
        <ThemeToggle variant="technical" size="md" />

        {/* Global Simulation / Mock Mode Toggle */}
        <button
          type="button"
          onClick={toggleSimulation}
          title={
            isSimulationActive
              ? 'Modo Simulación ACTIVO (haz clic para desactivar)'
              : 'Activar Modo Simulación (datos mock para pruebas de UX y layout)'
          }
          aria-label="Toggle simulation mode"
          aria-pressed={isSimulationActive}
          className={`group relative flex h-9 items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold transition-all duration-200 border focus-visible:outline-none focus-visible:ring-2 ${
            isSimulationActive
              ? 'border-amber-500/50 bg-amber-500/15 text-amber-600 dark:text-amber-400 shadow-sm shadow-amber-500/10'
              : 'border-black/10 dark:border-white/10 text-text-muted bg-white/50 dark:bg-black/20 hover:border-amber-500/30 hover:text-amber-600 dark:hover:text-amber-400'
          }`}
        >
          <FlaskConical
            size={15}
            className={`transition-transform duration-200 group-hover:rotate-12 ${
              isSimulationActive
                ? 'text-amber-500 fill-amber-500/20'
                : 'text-text-muted group-hover:text-amber-500'
            }`}
          />
          <span className="hidden xl:inline tracking-tight font-medium">
            {isSimulationActive ? 'Simulación' : 'Simular'}
          </span>
          <span
            className={`flex h-2 w-2 rounded-full ${
              isSimulationActive ? 'bg-amber-500 animate-pulse' : 'bg-text-muted/30'
            }`}
            aria-hidden="true"
          />
        </button>

        <PlatformHeaderActionButton
          label="Open help center"
          title="Help center"
          active={activeContext === 'help'}
          onClick={onOpenHelp}
        >
          <CircleHelp size={16} aria-hidden="true" />
        </PlatformHeaderActionButton>
      </div>
      {onOpenNotifications ? (
        <PlatformHeaderActionButton
          label="Open notifications"
          title="Notifications"
          active={activeContext === 'notifications'}
          danger={unreadCount > 0}
          onClick={onOpenNotifications}
        >
          <Lightbulb
            size={16}
            aria-hidden="true"
            className={
              activeContext === 'notifications'
                ? 'text-white'
                : unreadCount > 0
                  ? 'text-danger group-hover:text-danger'
                  : 'group-hover:text-primary'
            }
          />
          {unreadCount > 0 && (
            <span className="bg-danger absolute -right-0.5 -top-0.5 min-w-4 rounded-full px-1 text-center text-[9px] font-bold text-white">
              {unreadCount > 99 ? '+99' : unreadCount}
            </span>
          )}
        </PlatformHeaderActionButton>
      ) : (
        <NotificationCenter
          notifications={notifications}
          unreadCount={unreadCount}
          onViewAll={onViewAllNotifications}
          onMarkAsRead={onMarkAsRead}
          onMarkAllRead={onMarkAllRead}
          onRemove={onRemoveNotification}
          onClear={onClearNotifications}
        />
      )}
      <div className="flex">
        <PlatformHeaderActionButton
          label="Open AI assistant"
          title="AI assistant"
          active={activeContext === 'assistant'}
          onClick={onOpenAI}
        >
          <BrandLogo
            variant="isotype"
            surface="plain"
            size="xs"
            className="shrink-0"
            isotypeClassName={activeContext === 'assistant' ? 'text-white' : ''}
          />
        </PlatformHeaderActionButton>
      </div>
    </div>
  );
}
