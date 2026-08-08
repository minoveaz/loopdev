import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { KanbanBoard } from './index';
import { MOCK_KANBAN_COLUMNS, MOCK_KANBAN_ITEMS } from './fixtures';

describe('KanbanBoard Composite', () => {
  it('renders columns and cards', () => {
    render(
      <KanbanBoard
        columns={MOCK_KANBAN_COLUMNS}
        items={MOCK_KANBAN_ITEMS}
        getColumnId={(item) => item.stage}
        getItemId={(item) => item.id}
        renderCard={(item) => <div>{item.name}</div>}
      />,
    );

    expect(screen.getByText('Nuevos Leads')).toBeInTheDocument();
    expect(screen.getByText('Carlos Mendoza')).toBeInTheDocument();
    expect(screen.getByText('Valentina Ortiz')).toBeInTheDocument();
  });

  it('renders empty state slot when no items exist', () => {
    render(
      <KanbanBoard
        columns={MOCK_KANBAN_COLUMNS}
        items={[]}
        getColumnId={(item) => item.stage}
        getItemId={(item) => item.id}
        renderCard={(item) => <div>{item.name}</div>}
        emptyStateSlot={<div>No items in board</div>}
      />,
    );

    expect(screen.getByText('No items in board')).toBeInTheDocument();
  });

  it('calls onCardDrop on drop transaction', () => {
    const onCardDrop = vi.fn();

    const { container } = render(
      <KanbanBoard
        columns={MOCK_KANBAN_COLUMNS}
        items={MOCK_KANBAN_ITEMS}
        getColumnId={(item) => item.stage}
        getItemId={(item) => item.id}
        renderCard={(item) => <div>{item.name}</div>}
        onCardDrop={onCardDrop}
      />,
    );

    const draggable = container.querySelector('[draggable="true"]') as HTMLElement;
    const targetColumn = screen.getByText('Propuesta').closest('div') as HTMLElement;

    const dataTransfer = {
      data: '' as string,
      setData: vi.fn(function (_type: string, value: string) {
        this.data = value;
      }),
      getData: vi.fn(function () {
        return this.data;
      }),
      effectAllowed: 'move',
    };

    fireEvent.dragStart(draggable, { dataTransfer });
    fireEvent.drop(targetColumn, { dataTransfer });

    expect(onCardDrop).toHaveBeenCalledWith('lead-1', 'proposal');
  });

  it('has no accessibility violations in base render', async () => {
    const { container } = render(
      <KanbanBoard
        columns={MOCK_KANBAN_COLUMNS}
        items={MOCK_KANBAN_ITEMS}
        getColumnId={(item) => item.stage}
        getItemId={(item) => item.id}
        renderCard={(item) => <div>{item.name}</div>}
      />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
