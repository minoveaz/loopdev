'use client';

import {
  Checkbox,
  FilterDropdown,
  Input,
  RadioGroup,
  Select,
  Switch,
  TechnicalCard,
  Textarea,
  Heading,
} from '@loopdev/ui';
import { useState } from 'react';

const FILTER_OPTIONS = ['Active', 'Paused', 'Prospect'];

export function ControlsCertification() {
  const [query, setQuery] = useState('Acme');
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['Active']);
  const [includeArchived, setIncludeArchived] = useState(false);
  const [view, setView] = useState('table');

  const toggleFilter = (value: string) => {
    setSelectedFilters((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );
  };

  return (
    <TechnicalCard className="space-y-5 p-4">
      <div>
        <Heading
          as="h2"
          size="sm"
          weight="bold"
          className="font-mono uppercase tracking-[0.14em] text-text-main"
        >
          Controls
        </Heading>
        <p className="mt-1 text-xs text-text-muted">
          A2 reference controls: input states and filter selection contracts.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section
          className="space-y-4 rounded-lg border border-border-subtle bg-surface-elevated/40 p-4"
          aria-labelledby="controls-inputs"
        >
          <div className="border-b border-border-subtle pb-3">
            <h3
              id="controls-inputs"
              className="text-xs font-semibold uppercase tracking-[0.12em] text-text-main"
            >
              Text input states
            </h3>
            <p className="mt-1 text-xs text-text-muted">
              Input contract and supported feedback states.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
            <Input
              label="Contact name"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              helperText="Controlled text input."
            />
            <Input
              label="Error state"
              value="Unavailable"
              error="Could not validate this value."
              readOnly
            />
            <Input label="Loading state" value="Searching records" isLoading readOnly />
            <Input label="Disabled state" value="Read only value" disabled />
          </div>
        </section>

        <section
          className="space-y-4 rounded-lg border border-border-subtle bg-surface-elevated/40 p-4"
          aria-labelledby="controls-filters"
        >
          <div className="border-b border-border-subtle pb-3">
            <h3
              id="controls-filters"
              className="text-xs font-semibold uppercase tracking-[0.12em] text-text-main"
            >
              Selection controls
            </h3>
            <p className="mt-1 text-xs text-text-muted">
              Single, multiple, disabled and read-only selection.
            </p>
          </div>
          <FilterDropdown
            icon="filter_alt"
            label="Status"
            options={FILTER_OPTIONS}
            selected={selectedFilters}
            onToggle={toggleFilter}
            onClear={() => setSelectedFilters([])}
          />
          <Select label="Workspace" defaultValue="crm">
            <option value="crm">CRM</option>
            <option value="marketing">Marketing Studio</option>
          </Select>
          <FilterDropdown
            icon="sort"
            label="Sort order"
            options={['Most recent', 'Name']}
            selected={['Most recent']}
            multiple={false}
            onToggle={() => undefined}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <FilterDropdown
              icon="lock"
              label="Disabled filter"
              options={FILTER_OPTIONS}
              selected={[]}
              onToggle={() => undefined}
              disabled
            />
            <FilterDropdown
              icon="visibility"
              label="Read-only filter"
              options={FILTER_OPTIONS}
              selected={['Active']}
              onToggle={() => undefined}
              readOnly
            />
          </div>
          <p className="text-xs text-text-muted" aria-live="polite">
            Active filters: {selectedFilters.join(', ') || 'none'}
          </p>
        </section>

        <section
          className="space-y-4 rounded-lg border border-border-subtle bg-surface-elevated/40 p-4"
          aria-labelledby="controls-composed"
        >
          <div className="border-b border-border-subtle pb-3">
            <h3
              id="controls-composed"
              className="text-xs font-semibold uppercase tracking-[0.12em] text-text-main"
            >
              Text and binary controls
            </h3>
            <p className="mt-1 text-xs text-text-muted">
              Multiline input, binary preference and mutually exclusive options.
            </p>
          </div>
          <Checkbox
            label="Include archived records"
            checked={includeArchived}
            onChange={(event) => setIncludeArchived(event.target.checked)}
          />
          <Textarea
            label="Notes"
            defaultValue="Reusable control notes"
            helperText="Consumer-owned multiline value."
          />
          <Switch label="Enable automation" defaultChecked />
          <RadioGroup
            label="View mode"
            name="control-view-mode"
            value={view}
            onValueChange={setView}
            orientation="horizontal"
            options={[
              { value: 'table', label: 'Table' },
              { value: 'cards', label: 'Cards' },
            ]}
          />
        </section>
      </div>
    </TechnicalCard>
  );
}
