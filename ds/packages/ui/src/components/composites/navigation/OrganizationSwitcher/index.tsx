'use client';

import React, { useState } from 'react';
import { Check, ChevronDown, Plus, Search } from 'lucide-react';
import {
  TechnicalDropdown,
  TechnicalDropdownItem,
  TechnicalDropdownSeparator,
} from '../../../atoms';
import type { OrganizationSwitcherProps } from './types';

export const OrganizationSwitcher: React.FC<OrganizationSwitcherProps> = ({
  organizations,
  activeOrganizationId,
  isLoading = false,
  onOrganizationNavigate,
  onOrganizationChange,
  onAllOrganizations,
  onCreateOrganization,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const activeOrganization = organizations.find(({ id }) => id === activeOrganizationId);
  const filteredOrganizations = organizations.filter(({ name }) =>
    name.toLowerCase().includes(searchValue.trim().toLowerCase()),
  );
  const label = isLoading ? 'Loading...' : (activeOrganization?.name ?? 'Select organization');

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) setSearchValue('');
  };

  return (
    <div className={`flex min-w-0 items-center gap-1 ${className}`}>
      <button
        type="button"
        disabled={isLoading || !onOrganizationNavigate}
        onClick={onOrganizationNavigate}
        className="focus-visible:ring-primary hover:bg-accent/10 group flex min-w-0 items-center gap-2 rounded-md px-2 py-1.5 text-left transition-all duration-200 hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 disabled:cursor-default disabled:opacity-100"
      >
        <span className="flex min-w-0 items-center gap-2">
          <span className="text-text-main group-hover:text-accent max-w-48 truncate text-xs font-normal group-hover:underline group-hover:underline-offset-4 dark:text-white">
            {label}
          </span>
          {activeOrganization?.planLabel && (
            <span className="border-border-technical text-text-muted group-hover:border-accent group-hover:text-accent inline-flex rounded border px-1.5 py-0.5 text-xs font-normal uppercase tracking-wide">
              {activeOrganization.planLabel}
            </span>
          )}
        </span>
      </button>

      <TechnicalDropdown
        open={isOpen}
        onOpenChange={handleOpenChange}
        trigger={
          <button
            type="button"
            aria-label="Select organization"
            disabled={isLoading}
            className="text-text-muted hover:text-accent focus-visible:ring-primary hover:bg-accent/10 group flex size-8 shrink-0 items-center justify-center rounded-md transition-all duration-200 hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2"
          >
            <ChevronDown
              size={14}
              className="text-text-muted group-hover:text-accent shrink-0 transition-colors"
              aria-hidden="true"
            />
          </button>
        }
      >
        <div className="dark:bg-surface-elevated bg-white">
          <div className="border-border-technical flex items-center gap-2 border-b px-3 py-2">
            <Search size={16} className="text-text-muted shrink-0" aria-hidden="true" />
            <input
              type="search"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Find organization..."
              aria-label="Find organization"
              className="text-text-main placeholder:text-text-muted min-w-0 flex-1 bg-transparent text-sm outline-none"
            />
          </div>

          <div className="max-h-64 overflow-y-auto py-1">
            {filteredOrganizations.map((organization) => {
              const isActive = organization.id === activeOrganizationId;
              return (
                <TechnicalDropdownItem
                  key={organization.id}
                  isActive={isActive}
                  onSelect={() => {
                    onOrganizationChange(organization.id);
                    setIsOpen(false);
                  }}
                >
                  <span className="flex min-w-0 flex-1 items-center gap-2">
                    {organization.icon ?? (
                      <span className="bg-background-subtle text-text-muted flex size-6 shrink-0 items-center justify-center rounded text-xs font-semibold dark:bg-white/10">
                        {organization.name.slice(0, 1).toUpperCase()}
                      </span>
                    )}
                    <span className="truncate">{organization.name}</span>
                  </span>
                  {isActive && (
                    <Check size={16} className="text-primary shrink-0" aria-hidden="true" />
                  )}
                </TechnicalDropdownItem>
              );
            })}
            {filteredOrganizations.length === 0 && (
              <p className="text-text-muted px-3 py-3 text-sm">No organizations found</p>
            )}
          </div>

          {onAllOrganizations && (
            <>
              <TechnicalDropdownSeparator />
              <TechnicalDropdownItem onClick={onAllOrganizations}>
                All Organizations
              </TechnicalDropdownItem>
            </>
          )}

          {onCreateOrganization && (
            <>
              <TechnicalDropdownSeparator />
              <TechnicalDropdownItem onClick={onCreateOrganization}>
                <Plus size={16} aria-hidden="true" />
                <span>New organization</span>
              </TechnicalDropdownItem>
            </>
          )}
        </div>
      </TechnicalDropdown>
    </div>
  );
};

export * from './types';
