'use client';

import { Button, EmptyState, FilterBar, LoadingState, Pagination, QueryToolbar, SearchInput, StatusBadge, TechnicalCard } from '@loopdev/ui';
import { useState } from 'react';
import { ResponsiveTableCertification } from './ResponsiveTableCertification';
import { InteractionFeedbackCertification } from './InteractionFeedbackCertification';
import { ControlsCertification } from './ControlsCertification';

export function LoopdevComponentsCatalog() {
  const [query, setQuery] = useState('');
  const [accentQuery, setAccentQuery] = useState('Acme');
  const [filterValues, setFilterValues] = useState<Record<string, string[]>>({});
  const [sort, setSort] = useState('recent');
  const [view, setView] = useState('table');
  const [page, setPage] = useState(2);

  return (
    <div className="space-y-6" data-testid="loopdev-components-catalog">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
          Reusable suite catalog
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-text-main">Loopdev components</h1>
        <p className="mt-2 max-w-2xl text-sm leading-5 text-text-muted">
          Shared components with explicit surface, state, responsive and tenant contracts.
        </p>
      </div>

      <div className="space-y-4">
        <ControlsCertification />
        <TechnicalCard className="space-y-4 p-4">
          <InteractionFeedbackCertification />
        </TechnicalCard>
        <TechnicalCard className="space-y-4 p-4">
          <ResponsiveTableCertification />
        </TechnicalCard>
        <TechnicalCard className="space-y-4 p-4">
          <div>
            <h2 className="font-mono text-sm uppercase tracking-[0.14em] text-text-main">FilterBar</h2>
            <p className="mt-1 text-xs text-text-muted">Controlled search, multi-select filters, clear behavior and actions.</p>
          </div>
          <FilterBar
            search={{ value: query, onChange: setQuery, placeholder: 'Search contacts', ariaLabel: 'Search contacts' }}
            filters={[
              { id: 'status', label: 'Status', options: ['Active', 'Paused'] },
              { id: 'segment', label: 'Segment', options: ['Enterprise', 'SMB'], multiple: true },
            ]}
            filterValues={filterValues}
            onFilterValuesChange={(id, values) => setFilterValues((current) => ({ ...current, [id]: values }))}
            actions={<Button size="sm" variant="primary">Create contact</Button>}
          />
        </TechnicalCard>
        <TechnicalCard className="space-y-4 p-4">
          <div>
            <h2 className="font-mono text-sm uppercase tracking-[0.14em] text-text-main">Pagination</h2>
            <p className="mt-1 text-xs text-text-muted">Controlled page navigation with disabled boundaries and labels.</p>
          </div>
          <Pagination currentPage={page} totalPages={8} totalItems={184} onPageChange={setPage} />
        </TechnicalCard>
        <TechnicalCard className="space-y-4 p-4">
          <div>
            <h2 className="font-mono text-sm uppercase tracking-[0.14em] text-text-main">QueryToolbar</h2>
            <p className="mt-1 text-xs text-text-muted">FilterBar plus result count, sorting and view selection.</p>
          </div>
          <QueryToolbar
            search={{ value: query, onChange: setQuery, placeholder: 'Search records', ariaLabel: 'Search records' }}
            filters={[{ id: 'status', label: 'Status', options: ['Active', 'Paused'] }]}
            filterValues={filterValues}
            onFilterValuesChange={(id, values) => setFilterValues((current) => ({ ...current, [id]: values }))}
            resultCount={24}
            sort={{ value: sort, onChange: setSort, options: [{ value: 'recent', label: 'Most recent' }, { value: 'name', label: 'Name' }] }}
            view={{ value: view, onChange: setView, options: [{ value: 'table', label: 'Table' }, { value: 'cards', label: 'Cards' }] }}
          />
        </TechnicalCard>
        <TechnicalCard className="space-y-5 p-4">
          <div>
            <h2 className="font-mono text-sm uppercase tracking-[0.14em] text-text-main">SearchInput</h2>
            <p className="mt-1 text-xs text-text-muted">Tones, controlled values, clear, loading and tenant color overrides.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              ['default', 'Default tone', 'Search reusable components'],
              ['quiet', 'Quiet tone', 'Search in a quiet surface'],
              ['accent', 'Accent tone', 'Search tenant records'],
            ].map(([tone, label, placeholder]) => (
              <div key={tone} className="space-y-2">
                <p className="text-xs text-text-muted">{label}</p>
                <SearchInput
                  value={tone === 'accent' ? accentQuery : query}
                  onValueChange={tone === 'accent' ? setAccentQuery : setQuery}
                  placeholder={placeholder}
                  aria-label={label}
                  tone={tone as 'default' | 'quiet' | 'accent'}
                  onSubmit={() => undefined}
                />
              </div>
            ))}
            <div className="space-y-2">
              <p className="text-xs text-text-muted">Loading</p>
              <SearchInput value="Loading query" onValueChange={() => undefined} loading aria-label="Loading search" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <p className="text-xs text-text-muted">Tenant color override + clear state</p>
              <SearchInput
                value={accentQuery}
                onValueChange={setAccentQuery}
                aria-label="Tenant search with clear"
                colors={{
                  surface: 'color-mix(in srgb, var(--color-primary) 8%, transparent)',
                  border: 'var(--color-primary)',
                  text: 'var(--color-text-main)',
                  placeholder: 'var(--color-text-muted)',
                  accent: 'var(--color-primary)',
                }}
              />
            </div>
          </div>
          <p className="text-xs text-text-muted" aria-live="polite">Controlled query: {query || 'empty'}</p>
        </TechnicalCard>

        <div className="grid gap-4 xl:grid-cols-2">
        <TechnicalCard className="space-y-4 p-4">
          <div>
            <h2 className="font-mono text-sm uppercase tracking-[0.14em] text-text-main">EmptyState</h2>
            <p className="mt-1 text-xs text-text-muted">Sizes, visual variants and error recovery.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ['sm', 'ghost', 'Small / ghost', 'No components found'],
              ['sm', 'card', 'Small / card', 'No matching components'],
              ['md', 'card', 'Medium / card', 'Nothing to display'],
              ['sm', 'card', 'Error', 'Could not load components'],
            ].map(([size, variant, label, title]) => (
              <div key={label} className="space-y-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-muted">{label}</p>
                <EmptyState
                  size={size as 'sm' | 'md' | 'lg'}
                  variant={variant as 'card' | 'ghost'}
                  status={label === 'Error' ? 'error' : 'default'}
                  icon={label === 'Error' ? 'error' : 'inbox'}
                  title={title}
                  description="Adjust the query or clear the active filters."
                  colors={{
                    surface: 'color-mix(in srgb, var(--color-primary) 5%, transparent)',
                    border: 'var(--color-border-technical)',
                    text: 'var(--color-text-main)',
                  }}
                  action={label === 'Error' ? <Button size="sm" variant="outline">Retry</Button> : undefined}
                />
              </div>
            ))}
          </div>
        </TechnicalCard>

        <TechnicalCard className="space-y-4 p-4">
          <div>
            <h2 className="font-mono text-sm uppercase tracking-[0.14em] text-text-main">LoadingState</h2>
            <p className="mt-1 text-xs text-text-muted">Line counts and density without layout shift.</p>
          </div>
          <div className="space-y-5">
            {[1, 2, 4].map((lines) => (
              <div key={lines} className="space-y-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-muted">{lines} {lines === 1 ? 'line' : 'lines'}</p>
                <LoadingState
                  label={`Loading ${lines} lines`}
                  lines={lines}
                  colors={{ text: 'var(--color-text-main)' }}
                />
              </div>
            ))}
          </div>
        </TechnicalCard>

        <TechnicalCard className="space-y-4 p-4">
          <div>
            <h2 className="font-mono text-sm uppercase tracking-[0.14em] text-text-main">StatusBadge</h2>
            <p className="mt-1 text-xs text-text-muted">Semantic status indicator with standardized colors and variants.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {([
              ['READY', 'success', 'glass', true],
              ['INFO', 'info', 'outline', false],
              ['REVIEW', 'warning', 'outline', false],
              ['ERROR', 'danger', 'ghost', false],
              ['AI', 'innovation', 'glass', true],
              ['IDLE', 'neutral', 'ghost', false],
            ] as const).map(([label, severity, variant, withPulse]) => (
              <StatusBadge
                key={label}
                label={label}
                severity={severity as 'success' | 'info' | 'warning' | 'danger' | 'innovation' | 'neutral'}
                variant={variant as 'glass' | 'outline' | 'ghost'}
                withPulse={withPulse as boolean}
              />
            ))}
          </div>
        </TechnicalCard>
        </div>
      </div>
    </div>
  );
}
