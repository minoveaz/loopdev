'use client';

import React from 'react';
import { ModuleHeader } from '../../workspace/ModuleHeader';
import { ModuleWorkspace } from '../../workspace/ModuleWorkspace';
import type { ModuleShellProps } from './types';

export const ModuleShell: React.FC<ModuleShellProps> = ({
  moduleId,
  breadcrumbs,
  headerProps,
  toolbarSlot,
  workspaceProps,
  children,
}) => (
  <ModuleWorkspace
    {...workspaceProps}
    moduleId={moduleId}
    headerSlot={<ModuleHeader {...headerProps} segments={breadcrumbs} />}
    toolbarSlot={toolbarSlot}
  >
    {children}
  </ModuleWorkspace>
);

export * from './types';
