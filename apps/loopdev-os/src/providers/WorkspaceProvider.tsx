'use client';

import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { WorkspaceSchema, type Workspace } from '@loopdev/contracts';
import { createClient } from '@/lib/supabase/client';
import { useOrganization } from '@/hooks/useOrganization';

const storageKey = (organizationId: string) => `loopdev.activeWorkspaceId:${organizationId}`;

export type WorkspaceContextType = {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  activeWorkspaceId: string | null;
  setActiveWorkspaceId: (workspaceId: string | null) => void;
  isSuiteEnabled: (suiteKey: Workspace['suiteKey']) => boolean;
  isLoading: boolean;
};

export const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { activeOrganizationId } = useOrganization();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [requestedWorkspaceId, setRequestedWorkspaceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadWorkspaces = async () => {
      if (!activeOrganizationId) {
        setWorkspaces([]);
        setRequestedWorkspaceId(null);
        return;
      }
      setIsLoading(true);
      const { data, error } = await createClient()
        .from('workspaces')
        .select('id, organization_id, suite_key, name, slug, status, configuration, created_at, updated_at')
        .eq('organization_id', activeOrganizationId)
        .eq('status', 'active')
        .order('name');

      if (!isMounted) return;
      if (error) {
        console.warn('Workspaces are not available yet:', error.message);
        setWorkspaces([]);
      } else {
        setWorkspaces((data ?? []).map((row) => WorkspaceSchema.safeParse({
          id: row.id, organizationId: row.organization_id, suiteKey: row.suite_key,
          name: row.name, slug: row.slug, status: row.status, configuration: row.configuration,
          createdAt: row.created_at, updatedAt: row.updated_at,
        })).flatMap((result) => result.success ? [result.data] : []));
      }
      setIsLoading(false);
    };
    void loadWorkspaces();
    return () => { isMounted = false; };
  }, [activeOrganizationId]);

  const activeWorkspaceId = useMemo(() => {
    if (!activeOrganizationId || workspaces.length === 0) return null;
    if (requestedWorkspaceId && workspaces.some(({ id }) => id === requestedWorkspaceId)) return requestedWorkspaceId;
    const stored = window.localStorage.getItem(storageKey(activeOrganizationId));
    return workspaces.some(({ id }) => id === stored) ? stored : workspaces[0].id;
  }, [activeOrganizationId, requestedWorkspaceId, workspaces]);

  const setActiveWorkspaceId = useCallback((workspaceId: string | null) => {
    if (!activeOrganizationId) return;
    if (workspaceId !== null && !workspaces.some(({ id }) => id === workspaceId)) return;
    setRequestedWorkspaceId(workspaceId);
    if (workspaceId) window.localStorage.setItem(storageKey(activeOrganizationId), workspaceId);
    else window.localStorage.removeItem(storageKey(activeOrganizationId));
  }, [activeOrganizationId, workspaces]);

  const activeWorkspace = useMemo(() => workspaces.find(({ id }) => id === activeWorkspaceId) ?? null, [activeWorkspaceId, workspaces]);
  const isSuiteEnabled = useCallback((suiteKey: Workspace['suiteKey']) => workspaces.some((workspace) => workspace.suiteKey === suiteKey), [workspaces]);

  return <WorkspaceContext.Provider value={{ workspaces, activeWorkspace, activeWorkspaceId, setActiveWorkspaceId, isSuiteEnabled, isLoading }}>{children}</WorkspaceContext.Provider>;
}
