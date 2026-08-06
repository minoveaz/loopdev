'use client';

import { useOrganization } from '@/hooks/useOrganization';

export function OrganizationSwitcher() {
  const {
    organizations,
    activeOrganizationId,
    activeMembership,
    setActiveOrganizationId,
    isLoading,
  } = useOrganization();

  if (isLoading || organizations.length === 0) {
    return (
      <div className="rounded-lg border border-black/10 bg-black/5 px-3 py-2 dark:border-white/10 dark:bg-white/5">
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          {isLoading ? 'Loading context' : 'No organization context'}
        </span>
      </div>
    );
  }

  return (
    <label className="flex min-w-48 flex-col gap-1 rounded-lg border border-black/10 bg-black/5 px-3 py-2 dark:border-white/10 dark:bg-white/5">
      <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
        Active organization · {activeMembership?.role ?? 'member'}
      </span>
      <select
        aria-label="Active organization"
        value={activeOrganizationId ?? ''}
        onChange={(event) => setActiveOrganizationId(event.target.value)}
        className="w-full cursor-pointer bg-transparent text-sm font-semibold text-slate-900 outline-none dark:text-white"
      >
        {organizations.map((organization) => (
          <option key={organization.id} value={organization.id} className="bg-slate-900 text-white">
            {organization.name}
          </option>
        ))}
      </select>
    </label>
  );
}
