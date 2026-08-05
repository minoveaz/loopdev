'use client';

import React, { useState, useRef, useEffect } from 'react';
import { TechnicalSurface, Icon, Button, Input, Select, FilterDropdown } from '@loopdev/ui';
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
          <Select 
            id="companyFilter" 
            value={companyFilter} 
            onChange={(e) => onCompanyFilterChange(e.target.value as any)} 
            size="sm"
          >
            <option value="all" className="bg-surface-light dark:bg-surface-dark text-text-main dark:text-white">Compañía</option>
            <option value="Sanitas" className="bg-surface-light dark:bg-surface-dark text-text-main dark:text-white">Sanitas</option>
            <option value="Adeslas" className="bg-surface-light dark:bg-surface-dark text-text-main dark:text-white">Adeslas</option>
          </Select>
        </div>

        {/* Source Dropdown */}
        <div className="flex-1 min-w-0">
          <Select 
            id="sourceFilter" 
            value={sourceFilter} 
            onChange={(e) => onSourceFilterChange(e.target.value)} 
            size="sm"
          >
            <option value="all" className="bg-surface-light dark:bg-surface-dark text-text-main dark:text-white">Origen</option>
            <option value="Marketing Campaign" className="bg-surface-light dark:bg-surface-dark text-text-main dark:text-white">Campaña Marketing</option>
            <option value="Referral" className="bg-surface-light dark:bg-surface-dark text-text-main dark:text-white">Referido</option>
            <option value="Web" className="bg-surface-light dark:bg-surface-dark text-text-main dark:text-white">Web</option>
            <option value="Social Media" className="bg-surface-light dark:bg-surface-dark text-text-main dark:text-white">Redes Sociales</option>
            <option value="WhatsApp" className="bg-surface-light dark:bg-surface-dark text-text-main dark:text-white">WhatsApp</option>
            <option value="CRM" className="bg-surface-light dark:bg-surface-dark text-text-main dark:text-white">CRM</option>
            <option value="Other" className="bg-surface-light dark:bg-surface-dark text-text-main dark:text-white">Otro</option>
          </Select>
        </div>

        {/* Time Filter */}
        <div className="flex-1 min-w-0">
          <Select 
            id="timeFilter" 
            value={timeFilter} 
            onChange={(e) => onTimeFilterChange(e.target.value as any)} 
            size="sm"
          >
            <option value="all" className="bg-surface-light dark:bg-surface-dark text-text-main dark:text-white">Todos</option>
            <option value="7d" className="bg-surface-light dark:bg-surface-dark text-text-main dark:text-white">Últimos 7 días</option>
            <option value="14d" className="bg-surface-light dark:bg-surface-dark text-text-main dark:text-white">Últimos 14 días</option>
            <option value="30d" className="bg-surface-light dark:bg-surface-dark text-text-main dark:text-white">Último mes</option>
          </Select>
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
              <button onClick={() => toggleAssignee(a)} className="hover:text-primary/70 cursor-pointer">
                <Icon name="close" size="sm" />
              </button>
            </span>
          ))}
          {labelFilter.map(l => (
            <span 
              key={l} 
              className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-semibold rounded-md border border-amber-500/20"
            >
              {l}
              <button onClick={() => toggleLabel(l)} className="hover:text-amber-400/70 cursor-pointer">
                <Icon name="close" size="sm" />
              </button>
            </span>
          ))}
        </div>
      )}
    </TechnicalSurface>
  );
};
