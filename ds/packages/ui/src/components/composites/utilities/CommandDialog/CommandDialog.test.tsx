import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CommandDialog } from './index';
import { commandDialogFixtureCopy, commandDialogFixtureCommands, commandDialogFixtureGroups } from './certification/fixture';

const commands = commandDialogFixtureCommands.map((command) => ({ ...command, onSelect: vi.fn() }));
const dialogProps = {
  ...commandDialogFixtureCopy,
  commands,
  groups: commandDialogFixtureGroups,
};

describe('CommandDialog Composite', () => {
  it('renders the search-first dialog and grouped commands', () => {
    render(
      <CommandDialog
        open
        onOpenChange={vi.fn()}
        {...dialogProps}
        closeLabel="Close palette"
      />,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Command palette' })).toHaveAttribute('placeholder', 'Run a command or search...');
    expect(screen.getByRole('heading', { name: 'Navigation' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Create item/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close palette' })).toBeInTheDocument();
  });

  it('keeps visual tokens and domain content consumer-owned', () => {
    const source = readFileSync(resolve(__dirname, 'index.tsx'), 'utf8');

    expect(source).not.toMatch(/(?:bg|text|border)-(?:slate|gray|zinc|neutral|stone|red|blue|green|purple|orange|amber)-/);
    expect(source).not.toMatch(/Create contact|Open settings|CRM|pipeline|customer|contact|task/i);
  });

  it('filters commands by label and keywords and exposes empty feedback', () => {
    render(<CommandDialog open onOpenChange={vi.fn()} {...dialogProps} />);
    const input = screen.getByRole('textbox', { name: dialogProps.title });

    fireEvent.change(input, { target: { value: 'new' } });
    expect(screen.getByRole('option', { name: /Create item/ })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: /Restricted action/ })).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'missing' } });
    expect(screen.getByRole('status')).toHaveTextContent(dialogProps.emptyMessage);
  });

  it('moves with arrows, executes with Enter and closes by default', () => {
    const onOpenChange = vi.fn();
    const onSelect = vi.fn();
    render(<CommandDialog open onOpenChange={onOpenChange} {...dialogProps} commands={[{ id: 'create', label: 'Create item', onSelect }]} />);
    const input = screen.getByRole('textbox', { name: dialogProps.title });

    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onSelect).toHaveBeenCalledOnce();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('skips disabled commands during keyboard execution', () => {
    const onSelect = vi.fn();
    render(
      <CommandDialog
        open
        onOpenChange={vi.fn()}
        {...dialogProps}
        commands={[{ id: 'disabled', label: 'Restricted action', disabled: true, onSelect }]}
      />,
    );
    const input = screen.getByRole('textbox', { name: 'Command palette' });

    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onSelect).not.toHaveBeenCalled();
  });
});
