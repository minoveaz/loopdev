'use client';

import { useState } from 'react';
import type React from 'react';
import { ActivityTable, type ActivityRow } from '@/components/composites/data-tables/ActivityTable';
import { DenseOperationalTable } from '@/components/composites/data-tables/DenseOperationalTable';
import { EntityTable } from '@/components/composites/data-tables/EntityTable';
import { QuantitativeTable } from '@/components/composites/data-tables/QuantitativeTable';
import { SelectionTable } from '@/components/composites/data-tables/SelectionTable';
import { FiltersActionsFixture } from '@/components/composites/data/FiltersActions.fixture';
import {
  entityTableColumns,
  entityTableFilters,
  entityTableLabels,
  entityTableRows,
} from './entity-table.fixture';

const FixtureSection = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <section
    className="min-w-0 max-w-full space-y-3"
    aria-labelledby={`${title.replaceAll(' ', '-').toLowerCase()}-heading`}
  >
    <div>
      <h2
        id={`${title.replaceAll(' ', '-').toLowerCase()}-heading`}
        className="text-lg font-semibold text-text-main"
      >
        {title}
      </h2>
      <p className="text-sm text-text-muted">{description}</p>
    </div>
    {children}
  </section>
);

export function DataTablesCatalog({
  onActivitySelect,
  selectedActivityId,
}: {
  onActivitySelect?: (row: ActivityRow) => void;
  selectedActivityId?: string;
}) {
  const [selectedEntityKeys, setSelectedEntityKeys] = useState<React.Key[]>([]);

  return (
    <div className="min-w-0 max-w-full space-y-8 p-4 md:p-6">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
          Certification section
        </p>
        <div className="mt-2 text-2xl font-semibold text-text-main">
          <h1>Data tables and filters</h1>
        </div>
        <p className="mt-1 max-w-2xl text-sm text-text-muted">
          Responsive data patterns for CRM records, metrics, activity and selection workflows.
        </p>
      </header>

      <FixtureSection
        title="FiltersActions"
        description="Controlled search, filters and customer actions."
      >
        <FiltersActionsFixture />
      </FixtureSection>

      <FixtureSection
        title="EntityTable"
        description="Identity-first CRM rows with filters and mobile row rendering."
      >
        <EntityTable
          rows={entityTableRows}
          columns={entityTableColumns}
          filters={entityTableFilters}
          labels={entityTableLabels}
          selectedRowKeys={selectedEntityKeys}
          onSelectedRowKeysChange={setSelectedEntityKeys}
          onAssignOwner={() => setSelectedEntityKeys([])}
          onExport={() => setSelectedEntityKeys([])}
        />
      </FixtureSection>

      <FixtureSection
        title="DenseOperationalTable"
        description="Sortable and paginated records for repeated operational scanning."
      >
        <DenseOperationalTable />
      </FixtureSection>

      <FixtureSection
        title="QuantitativeTable"
        description="Right-priority metrics, changes and targets for comparison."
      >
        <QuantitativeTable />
      </FixtureSection>

      <FixtureSection
        title="ActivityTable"
        description="Chronological events with actor, date and state."
      >
        <ActivityTable
          activeRowKey={selectedActivityId}
          onRowClick={(row) => onActivitySelect?.(row)}
        />
      </FixtureSection>

      <FixtureSection
        title="SelectionTable"
        description="Visible-page selection with contextual bulk action ownership."
      >
        <SelectionTable />
      </FixtureSection>
    </div>
  );
}
