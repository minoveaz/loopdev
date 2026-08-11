import type { ReactNode } from 'react';
import type { ModuleConfig, SuiteConfig } from '@loopdev/contracts';
import type { NavMode, NavRouteRef } from '@loopdev/contracts';
import type { SuiteShellProps } from '../SuiteShell/types';

export type SuiteModuleRenderer = (module: ModuleConfig) => ReactNode;

export interface SuiteRuntimeProps {
  config: SuiteConfig;
  activeModuleId?: string;
  moduleRenderers?: Record<string, SuiteModuleRenderer>;
  children?: ReactNode;
  leftSlot: ReactNode;
  centerSlot: ReactNode;
  rightSlot: ReactNode;
  profileSlot?: ReactNode;
  platformHeaderProps?: SuiteShellProps['platformHeaderProps'];
  onNavigate: (route: NavRouteRef) => void;
  onNavModeChange?: (mode: Exclude<NavMode, 'hidden'>) => void;
  appShellProps?: SuiteShellProps['appShellProps'];
}
