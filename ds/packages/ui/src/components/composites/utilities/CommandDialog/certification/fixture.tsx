import type { CommandDialogGroup, CommandDialogItem } from '../types';

export const commandDialogFixtureCopy = {
  title: 'Command palette',
  placeholder: 'Run a command or search...',
  emptyMessage: 'No commands found.',
  closeLabel: 'Close command palette',
  description: 'Search and run an available command.',
  closeOnSelect: true,
} as const;

export const commandDialogFixtureCommands: CommandDialogItem[] = [
  { id: 'create', label: 'Create item', keywords: ['new'], shortcut: '⌘N' },
  { id: 'disabled', label: 'Restricted action', disabled: true },
];

export const commandDialogFixtureGroups: CommandDialogGroup[] = [
  { id: 'navigation', label: 'Navigation', commands: [{ id: 'settings', label: 'Open settings' }] },
];