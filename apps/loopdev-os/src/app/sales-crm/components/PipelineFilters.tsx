'use client';

import React from 'react';
import { TechnicalSurface, Icon, Button, IconButton, Input, FilterDropdown } from '@loopdev/ui';
import { AVAILABLE_ASSIGNEES, AVAILABLE_LABELS, type LeadLabel } from '../context';

interface PipelineFiltersProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  companyFilter: 'all' | 'Sanitas' | 'Adeslas';
  onCompanyFilterChange: (company: 'all' | 'Sanitas' | 'Adeslas') => void;
  sourceFilter: 'all' | string;
  onSourceFilterChange: (source: 'all' | string) => void;
  timeFilter: '7d' | '14d' | '30d' | 'all';
  onTimeFilterChange: (filter: '7d' | '14d' | '30d' | 'all') => void;
  assigneeFilter: string[];
  onAssigneeFilterChange: (assignees: string[]) => void;
  labelFilter: LeadLabel[];
  onLabelFilterChange: (labels: LeadLabel[]) => void;
  onClearFilters: () => void;
}

type CompanyFilter = PipelineFiltersProps['companyFilter'];
type TimeFilter = PipelineFiltersProps['timeFilter'];
const timeFilterValues: Record<string, TimeFilter> = {
  'Últimos 7 días': '7d',
  'Últimos 14 días': '14d',
  'Último mes': '30d',
};

const isCompanyFilter = (value: string): value is CompanyFilter =>
  value === 'all' || value === 'Sanitas' || value === 'Adeslas';

const isTimeFilter = (value: string): value is TimeFilter =>
  value === 'all' || value === '7d' || value === '14d' || value === '30d';

export const PipelineFilters: React.FC<PipelineFiltersProps> = ({
  searchTerm,
  onSearchTermChange,
  companyFilter,
  onCompanyFilterChange,
  sourceFilter,
  onSourceFilterChange,
  timeFilter,
  onTimeFilterChange,
  assigneeFilter,
  onAssigneeFilterChange,
  labelFilter,
  onLabelFilterChange,
  onClearFilters
}) => {
  const toggleAssignee = (assignee: string) => {
    if (assigneeFilter.includes(assignee)) {
      onAssigneeFilterChange(assigneeFilter.filter(a => a !== assignee));
    } else {
      onAssigneeFilterChange([...assigneeFilter, assignee]);
    }
  };

  const toggleLabel = (label: string) => {
    const typedLabel = label as LeadLabel;
    if (labelFilter.includes(typedLabel)) {
      onLabelFilterChange(labelFilter.filter(l => l !== typedLabel));
    } else {
      onLabelFilterChange([...labelFilter, typedLabel]);
    }
  };

  return (
    <TechnicalSurface 
      variant="surface" 
      depth="flat" 
      overflow="visible"
      className="px-6 py-4 border border-border-technical/60 rounded-3xl shadow-sm bg-shell-surface/60 backdrop-blur-md shrink-0 relative z-30"
    >
      <div className="flex items-center gap-3 w-full">
        {/* Search */}
        <div className="flex-1 min-w-0">
          <Input
            id="search"
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            placeholder="Buscar lead..."
            startIcon={<Icon name="search" size="sm" className="text-text-muted" />}
            size="sm"
            fullWidth
          />
        </div>

        {/* Company Dropdown */}
        <div className="flex-1 min-w-0">
          <FilterDropdown
            icon="business"
            label={companyFilter === 'all' ? 'Compañía' : companyFilter}
            options={['Todas', 'Sanitas', 'Adeslas']}
            selected={companyFilter === 'all' ? [] : [companyFilter]}
            onToggle={(value) => {
              if (value === 'Todas') onCompanyFilterChange('all');
              else if (isCompanyFilter(value)) onCompanyFilterChange(value);
            }}
          />
        </div>

        {/* Source Dropdown */}
        <div className="flex-1 min-w-0">
          <FilterDropdown
            icon="public"
            label={sourceFilter === 'all' ? 'Origen' : sourceFilter}
            options={['Todos', 'Marketing Campaign', 'Referral', 'Web', 'Social Media', 'WhatsApp', 'CRM', 'Other']}
            selected={sourceFilter === 'all' ? [] : [sourceFilter]}
            onToggle={(value) => onSourceFilterChange(value === 'Todos' ? 'all' : value)}
          />
        </div>

        {/* Time Filter */}
        <div className="flex-1 min-w-0">
          <FilterDropdown
            icon="calendar_month"
            label={timeFilter === 'all' ? 'Todos' : ({ '7d': 'Últimos 7 días', '14d': 'Últimos 14 días', '30d': 'Último mes' }[timeFilter] ?? 'Todos')}
            options={['Todos', 'Últimos 7 días', 'Últimos 14 días', 'Último mes']}
            selected={timeFilter === 'all' ? [] : [{ '7d': 'Últimos 7 días', '14d': 'Últimos 14 días', '30d': 'Último mes' }[timeFilter] ?? '']}
            onToggle={(value) => {
              const timeValue = timeFilterValues[value];
              if (value === 'Todos') onTimeFilterChange('all');
              else if (timeValue) onTimeFilterChange(timeValue);
            }}
          />
        </div>

        {/* Assignee Button Filter */}
        <div className="flex-1 min-w-0">
        <FilterDropdown
          icon="person"
          label="Asignado"
          options={[...AVAILABLE_ASSIGNEES]}
          selected={assigneeFilter}
          onToggle={toggleAssignee}
        />
        </div>

        {/* Label Button Filter */}
        <div className="flex-1 min-w-0">
        <FilterDropdown
          icon="label"
          label="Etiqueta"
          options={[...AVAILABLE_LABELS]}
          selected={labelFilter}
          onToggle={toggleLabel}
        />
        </div>

        {/* Clear Filters */}
        <div className="shrink-0">
        <Button
          variant="energy"
          size="sm"
          onClick={onClearFilters}
          className="justify-center rounded-lg whitespace-nowrap"
        >
          Limpiar Filtros
        </Button>
        </div>
      </div>

      {/* Active filter tags — only shown when filters are active */}
      {(assigneeFilter.length > 0 || labelFilter.length > 0) && (
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          {assigneeFilter.map(a => (
            <span 
              key={a} 
              className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-[10px] font-semibold rounded-md border border-primary/20"
            >
              {a}
              <IconButton icon="close" size="sm" aria-label={`Quitar asignado ${a}`} onClick={() => toggleAssignee(a)} className="hover:text-primary/70 cursor-pointer" />
            </span>
          ))}
          {labelFilter.map(l => (
            <span 
              key={l} 
              className="inline-flex items-center gap-1 px-2 py-1 bg-energy-yellow/10 text-energy-yellow text-[10px] font-semibold rounded-md border border-energy-yellow/20"
            >
              {l}
              <IconButton icon="close" size="sm" aria-label={`Quitar etiqueta ${l}`} onClick={() => toggleLabel(l)} className="hover:text-energy-yellow/70 cursor-pointer" />
            </span>
          ))}
        </div>
      )}
    </TechnicalSurface>
  );
};
