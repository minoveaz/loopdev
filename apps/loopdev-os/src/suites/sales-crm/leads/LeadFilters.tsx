'use client';

import { Search } from 'lucide-react';
import { FilterDropdown, IconButton, Input } from '@loopdev/ui';
import type { CrmLead } from '@loopdev/contracts';
import type { LeadFilterKey, LeadFilterValues } from './types';

export type LeadFilterOptions = Partial<Record<LeadFilterKey, string[]>>;

type LeadFiltersProps = {
  query: string;
  onQueryChange: (value: string) => void;
  filters: LeadFilterValues;
  onFilterChange: (key: LeadFilterKey, value: string | undefined) => void;
  options?: LeadFilterOptions;
  disabled?: boolean;
};

const STATUS_OPTIONS: CrmLead['status'][] = [
  'nuevo',
  'contactado',
  'cualificado',
  'estancado',
  'inactivo',
  'convertido',
];
const SOURCE_OPTIONS: CrmLead['source']['kind'][] = [
  'manual',
  'campaign',
  'whatsapp_simulated',
  'referral',
  'social',
  'partner',
];

export function LeadFilters({
  query,
  onQueryChange,
  filters,
  onFilterChange,
  options = {},
  disabled = false,
}: LeadFiltersProps) {
  const filterDefinitions: Array<{ key: LeadFilterKey; label: string; values: string[] }> = [
    { key: 'status', label: 'Estado', values: STATUS_OPTIONS },
    { key: 'source', label: 'Origen', values: SOURCE_OPTIONS },
    ...(options.assignedUserId?.length
      ? [{ key: 'assignedUserId' as const, label: 'Asignado a', values: options.assignedUserId }]
      : []),
    ...(options.workspaceId?.length
      ? [{ key: 'workspaceId' as const, label: 'Workspace', values: options.workspaceId }]
      : []),
  ];

  return (
    <div
      className="grid min-w-0 grid-cols-1 items-end gap-2 lg:grid-cols-[minmax(16rem,1fr)_repeat(4,minmax(9rem,auto))]"
      role="toolbar"
      aria-label="Filtros de Leads"
    >
      <Input
        aria-label="Buscar leads"
        placeholder="Buscar por contacto, interés u origen"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        startIcon={<Search size={14} aria-hidden="true" />}
        endIcon={
          query ? (
            <IconButton
              icon="close"
              variant="ghost"
              size="sm"
              aria-label="Limpiar búsqueda"
              onClick={() => onQueryChange('')}
            />
          ) : undefined
        }
        size="sm"
        fullWidth
        disabled={disabled}
      />
      {filterDefinitions.map(({ key, label, values }) => {
        const selected = filters[key] ? [filters[key] as string] : [];
        return (
          <FilterDropdown
            key={key}
            icon="filter_alt"
            label={selected.length ? `${label} · ${selected[0]}` : label}
            options={values}
            selected={selected}
            multiple={false}
            disabled={disabled}
            onToggle={(value) => onFilterChange(key, selected[0] === value ? undefined : value)}
          />
        );
      })}
    </div>
  );
}
