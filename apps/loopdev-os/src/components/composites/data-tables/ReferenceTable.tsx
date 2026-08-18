'use client';

import { useState } from 'react';
import type React from 'react';
import { EntityTable } from './EntityTable';
import {
  entityTableColumns,
  entityTableFilters,
  entityTableLabels,
  entityTableRows,
} from '@/app/composition-showcase/entity-table.fixture';

export function ReferenceTable() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  return (
    <EntityTable
      rows={entityTableRows}
      columns={entityTableColumns}
      filters={entityTableFilters}
      labels={entityTableLabels}
      selectedRowKeys={selectedRowKeys}
      onSelectedRowKeysChange={setSelectedRowKeys}
      onAssignOwner={() => setSelectedRowKeys([])}
      onExport={() => setSelectedRowKeys([])}
    />
  );
}
