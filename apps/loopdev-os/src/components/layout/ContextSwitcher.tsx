'use client';

import { useOrganization } from '@/hooks/useOrganization';
import { useAuth } from '@/hooks/useAuth';

export function ContextSwitcher() {
  const {
    organizations,
    activeOrganizationId,
    activeMembership,
    setActiveOrganizationId,
    isLoading: isOrgLoading,
  } = useOrganization();
  const { isLoading: isAuthLoading } = useAuth();

  const isStillLoading = isOrgLoading || isAuthLoading;

  if (isStillLoading) {
    return (
      <div
        className="border-border-technical bg-background-subtle flex min-w-48 animate-pulse flex-col justify-center gap-1.5 rounded-lg border px-3 py-2"
        aria-busy="true"
        aria-label="Loading organization context"
      >
        <div className="bg-border-technical/70 h-2 w-28 rounded" />
        <div className="bg-border-technical/40 h-4 w-36 rounded" />
      </div>
    );
  }

  if (organizations.length === 0) {
    return (
      <div className="border-border-technical bg-background-subtle flex min-w-48 flex-col gap-1 rounded-lg border px-3 py-2">
        <span className="text-text-muted text-[9px] font-bold uppercase tracking-[0.18em]">
          Active organization
        </span>
        <span className="text-text-muted text-xs font-medium">No organization assigned</span>
      </div>
    );
  }

  const role = activeMembership?.role ?? 'Member';

  if (organizations.length === 1) {
    return (
      <div className="border-border-technical bg-background-subtle flex min-w-48 flex-col gap-1 rounded-lg border px-3 py-2">
        <span className="text-text-muted text-[9px] font-bold uppercase tracking-[0.18em]">
          Active organization · {role}
        </span>
        <span className="text-text-main text-sm font-semibold">{organizations[0].name}</span>
      </div>
    );
  }

  return (
    <label className="border-border-technical bg-background-subtle flex min-w-48 flex-col gap-1 rounded-lg border px-3 py-2">
      <span className="text-text-muted text-[9px] font-bold uppercase tracking-[0.18em]">
        Active organization · {role}
      </span>
      <select
        aria-label="Active organization"
        value={activeOrganizationId ?? ''}
        onChange={(event) => {
          setActiveOrganizationId(event.target.value);
          window.sessionStorage.setItem('loopdev.organizationTransition', 'pending');
          window.location.reload();
        }}
        className="text-text-main w-full cursor-pointer bg-transparent text-sm font-semibold outline-none"
      >
        {organizations.map((organization) => (
          <option
            key={organization.id}
            value={organization.id}
            className="bg-surface-elevated text-text-main"
          >
            {organization.name}
          </option>
        ))}
      </select>
    </label>
  );
}
