
import React from 'react';
import { ComponentEntry } from '@blueprints/pages/functional/types';
import { DataTable } from '@blueprints/components/functional/DataTable/index';

const MOCK_DATA = [
  { id: '1', name: 'Project Alpha', status: 'Active', budget: '$12,000' },
  { id: '2', name: 'Project Beta', status: 'Pending', budget: '$8,500' },
  { id: '3', name: 'Internal Tools', status: 'Active', budget: '$4,000' },
  { id: '4', name: 'Website Redesign', status: 'Done', budget: '$15,000' },
];

const COLUMNS = [
  { key: 'name', header: 'Project Name', sortable: true },
  { key: 'status', header: 'Status', sortable: true },
  { key: 'budget', header: 'Budget', sortable: true }
];

export const tablesData: ComponentEntry[] = [
  {
    id: 'data-table',
    title: 'Advanced Data Table',
    category: 'Data',
    description: 'Sortable, filterable, expandable rows with selection.',
    size: 'full', 
    component: (
      <div className="w-full h-full min-h-[500px] flex flex-col">
        <DataTable data={MOCK_DATA} columns={COLUMNS} className="flex-1 h-full" />
      </div>
    )
  }
];
