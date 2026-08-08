'use client';

import { useOrganization } from '@/hooks/useOrganization';
import { useAuth } from '@/hooks/useAuth';

export function ContextSwitcher() {
  const { organizations, activeOrganizationId, activeMembership, setActiveOrganizationId, isLoading } = useOrganization();
  const { isLoading: isAuthLoading } = useAuth();

  if (isLoading || organizations.length === 0) {
    return <div className="rounded-lg border border-border-technical bg-background-subtle px-3 py-2"><span className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">{isLoading ? 'Loading context' : 'No organization context'}</span></div>;
  }

  const role = activeMembership?.role ?? (isAuthLoading ? 'loading' : 'no membership');
  if (organizations.length === 1) {
    return <div className="flex min-w-48 flex-col gap-1 rounded-lg border border-border-technical bg-background-subtle px-3 py-2"><span className="text-[9px] font-bold uppercase tracking-[0.18em] text-text-muted">Active organization · {role}</span><span className="text-sm font-semibold text-text-main">{organizations[0].name}</span></div>;
  }

  return <label className="flex min-w-48 flex-col gap-1 rounded-lg border border-border-technical bg-background-subtle px-3 py-2"><span className="text-[9px] font-bold uppercase tracking-[0.18em] text-text-muted">Active organization · {role}</span><select aria-label="Active organization" value={activeOrganizationId ?? ''} onChange={(event) => { setActiveOrganizationId(event.target.value); window.sessionStorage.setItem('loopdev.organizationTransition', 'pending'); window.location.reload(); }} className="w-full cursor-pointer bg-transparent text-sm font-semibold text-text-main outline-none">{organizations.map((organization) => <option key={organization.id} value={organization.id} className="bg-surface-elevated text-text-main">{organization.name}</option>)}</select></label>;
}
