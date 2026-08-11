import type { ReactNode } from 'react';
import type { ModuleHeaderProps } from '../../workspace/ModuleHeader/types';
import type { ModuleWorkspaceProps } from '../../workspace/ModuleWorkspace/types';

export interface ModuleShellProps {
  moduleId: string;
  breadcrumbs: ModuleHeaderProps['segments'];
  headerProps?: Omit<ModuleHeaderProps, 'segments'>;
  toolbarSlot?: ReactNode;
  workspaceProps?: Omit<
    ModuleWorkspaceProps,
    'moduleId' | 'headerSlot' | 'toolbarSlot' | 'children'
  >;
  children: ReactNode;
}
