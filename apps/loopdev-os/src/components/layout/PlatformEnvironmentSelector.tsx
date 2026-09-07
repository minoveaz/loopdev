'use client';

import { Check, ChevronDown, Cloud, Eye, FlaskConical } from 'lucide-react';
import {
  TechnicalDropdown,
  TechnicalDropdownItem,
} from '@loopdev/ui';
import type { PlatformEnvironmentMode } from '@loopdev/contracts';
import { usePlatformRuntime } from '@/providers/PlatformRuntimeProvider';

const ENVIRONMENT_OPTIONS: Array<{
  mode: PlatformEnvironmentMode;
  label: string;
  description: string;
  icon: typeof Cloud;
}> = [
  {
    mode: 'real',
    label: 'Real',
    description: 'Remote data and persistent operations',
    icon: Cloud,
  },
  {
    mode: 'sandbox',
    label: 'Sandbox',
    description: 'Local workflow without saving changes',
    icon: FlaskConical,
  },
  {
    mode: 'preview',
    label: 'Preview',
    description: 'Read-only demonstration data',
    icon: Eye,
  },
];

const modeLabel = (mode: PlatformEnvironmentMode) =>
  ENVIRONMENT_OPTIONS.find((option) => option.mode === mode)?.label ?? 'Real';

export function PlatformEnvironmentSelector() {
  const { mode, setMode } = usePlatformRuntime();
  const currentLabel = modeLabel(mode);

  return (
    <TechnicalDropdown
      align="end"
      sideOffset={6}
      className="w-[min(320px,calc(100vw-2rem))]"
      trigger={
        <button
          type="button"
          aria-label={`Environment: ${currentLabel}`}
          aria-haspopup="menu"
          className="flex h-9 items-center gap-1.5 rounded-full border border-black/10 bg-white/50 px-2.5 text-xs font-semibold text-text-muted transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:border-white/10 dark:bg-black/20"
        >
          <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
          <span className="hidden xl:inline">{currentLabel}</span>
          <ChevronDown size={14} aria-hidden="true" />
        </button>
      }
    >
      <div className="px-3 py-2">
        <p className="text-xs font-semibold text-text-main">Environment</p>
        <p className="text-xs text-text-muted">Choose how this workspace loads data</p>
      </div>
      {ENVIRONMENT_OPTIONS.map(({ mode: optionMode, label, description, icon: Icon }) => {
        const isActive = optionMode === mode;
        return (
          <TechnicalDropdownItem
            key={optionMode}
            isActive={isActive}
            onSelect={() => setMode(optionMode)}
          >
            <Icon size={15} aria-hidden="true" />
            <span className="min-w-0 flex-1">
              <span className="block truncate">{label}</span>
              <span className="block truncate text-xs text-text-muted">{description}</span>
            </span>
            {isActive ? <Check size={15} aria-hidden="true" /> : null}
          </TechnicalDropdownItem>
        );
      })}
    </TechnicalDropdown>
  );
}
