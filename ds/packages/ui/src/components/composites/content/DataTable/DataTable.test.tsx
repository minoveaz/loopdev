import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DataTable } from './index';

const columns = [{ key: 'name', header: 'Name', sortable: true }];
const rows = [
  { id: 'one', name: 'Northstar Labs', status: 'Active' },
  { id: 'two', name: 'Helio Systems', status: 'Paused' },
];

describe('DataTable', () => {
  it('owns search and filters while delegating table behavior to ResponsiveTable', () => {
    render(
      <DataTable
        caption="Workspaces"
        rows={rows}
        columns={columns}
        getRowKey={(row) => row.id}
        search={{ placeholder: 'Search workspaces', fields: ['name'] }}
        filters={[{ key: 'status', label: 'Status', options: [{ value: 'Active', label: 'Active' }] }]}
      />,
    );

    expect(screen.getByPlaceholderText('Search workspaces')).toBeInTheDocument();
    expect(screen.getByText('Northstar Labs')).toBeInTheDocument();
    expect(screen.getByText('Helio Systems')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Search workspaces'), { target: { value: 'Northstar' } });
    expect(screen.getByText('Northstar Labs')).toBeInTheDocument();
    expect(screen.queryByText('Helio Systems')).not.toBeInTheDocument();
  });
});
