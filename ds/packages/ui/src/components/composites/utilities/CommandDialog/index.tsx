'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { CommandDialogGroup, CommandDialogItem, CommandDialogProps } from './types';

const getCommandGroups = (commands: CommandDialogItem[], groups: CommandDialogGroup[]) => {
  const result = groups.map((group) => ({ ...group, commands: [...group.commands] }));

  if (commands.length > 0) {
    result.unshift({ id: 'commands', commands });
  }

  return result;
};

const getSearchText = (command: CommandDialogItem) =>
  [command.label, command.description, ...(command.keywords ?? [])]
    .filter(Boolean)
    .join(' ')
    .toLocaleLowerCase();

export function CommandDialog({
  open,
  onOpenChange,
  commands,
  groups = [],
  placeholder,
  emptyMessage,
  title,
  description,
  closeLabel,
  closeOnSelect,
}: CommandDialogProps) {
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);

  const commandGroups = useMemo(() => getCommandGroups(commands, groups), [commands, groups]);
  const filteredGroups = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return commandGroups
      .map((group) => ({
        ...group,
        commands: group.commands.filter(
          (command) => !normalizedQuery || getSearchText(command).includes(normalizedQuery),
        ),
      }))
      .filter((group) => group.commands.length > 0);
  }, [commandGroups, query]);
  const selectableCommands = useMemo(
    () => filteredGroups.flatMap((group) => group.commands).filter((command) => !command.disabled),
    [filteredGroups],
  );

  useEffect(() => {
    if (!open) {
      setQuery('');
      setActiveId(null);
      return;
    }

    setActiveId(selectableCommands[0]?.id ?? null);
  }, [open, selectableCommands]);

  const executeCommand = (command: CommandDialogItem) => {
    if (command.disabled) return;
    command.onSelect?.();
    if (closeOnSelect) onOpenChange(false);
  };

  const moveActive = (direction: 1 | -1) => {
    if (selectableCommands.length === 0) return;
    const currentIndex = selectableCommands.findIndex((command) => command.id === activeId);
    const nextIndex =
      currentIndex < 0
        ? 0
        : (currentIndex + direction + selectableCommands.length) % selectableCommands.length;
    setActiveId(selectableCommands[nextIndex].id);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="lpd-command-dialog-backdrop fixed inset-0 data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Content
          className="lpd-command-dialog-content fixed left-1/2 top-[12vh] flex max-h-[min(38rem,calc(100vh-2rem))] w-[min(42rem,calc(100vw-2rem))] -translate-x-1/2 flex-col overflow-hidden rounded-lg border border-border-technical shadow-2xl backdrop-blur-md outline-none data-[state=open]:animate-in data-[state=open]:zoom-in-95 max-sm:top-1/2 max-sm:bottom-auto max-sm:max-h-[calc(100vh-2rem)] max-sm:w-[calc(100vw-1rem)] max-sm:-translate-y-1/2"
          aria-describedby={description ? undefined : undefined}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault();
              moveActive(1);
            }
            if (event.key === 'ArrowUp') {
              event.preventDefault();
              moveActive(-1);
            }
            if (event.key === 'Enter' && activeId) {
              event.preventDefault();
              const activeCommand = selectableCommands.find((command) => command.id === activeId);
              if (activeCommand) executeCommand(activeCommand);
            }
          }}
        >
          <div className="flex items-center gap-3 border-b border-border-subtle px-4 py-3">
            <Search aria-hidden="true" className="size-4 shrink-0 text-text-muted" />
            <Dialog.Title className="shrink-0 text-xs font-medium text-text-primary max-sm:sr-only">
              {title}
            </Dialog.Title>
            {description ? (
              <Dialog.Description className="sr-only">{description}</Dialog.Description>
            ) : null}
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={placeholder}
              aria-label={title}
              className="min-w-0 flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
            />
            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded p-1 text-text-muted transition-colors hover:bg-background-subtle hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                aria-label={closeLabel}
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </Dialog.Close>
          </div>

          <div className="min-h-0 overflow-y-auto p-2" role="listbox" aria-label={title}>
            {filteredGroups.length === 0 ? (
              <p className="px-3 py-10 text-center text-sm text-text-muted" role="status">
                {emptyMessage}
              </p>
            ) : (
              filteredGroups.map((group) => (
                <section key={group.id} aria-label={group.label}>
                  {group.label ? (
                    <h3 className="px-3 pb-1 pt-3 text-[10px] font-medium uppercase tracking-[0.14em] text-text-muted">
                      {group.label}
                    </h3>
                  ) : null}
                  {group.commands.map((command) => {
                    const isActive = command.id === activeId;
                    return (
                      <button
                        key={command.id}
                        type="button"
                        role="option"
                        aria-selected={isActive}
                        aria-disabled={command.disabled || undefined}
                        disabled={command.disabled}
                        onMouseEnter={() => setActiveId(command.id)}
                        onClick={() => executeCommand(command)}
                        className={`flex min-h-11 w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent ${isActive ? 'bg-background-subtle' : 'hover:bg-background-subtle/70'} ${command.disabled ? 'cursor-not-allowed opacity-45' : ''}`}
                      >
                        {command.icon ? (
                          <span
                            className="flex size-5 shrink-0 items-center justify-center text-text-muted"
                            aria-hidden="true"
                          >
                            {command.icon}
                          </span>
                        ) : null}
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm text-text-primary">
                            {command.label}
                          </span>
                          {command.description ? (
                            <span className="block truncate text-xs text-text-muted">
                              {command.description}
                            </span>
                          ) : null}
                        </span>
                        {command.shortcut ? (
                          <kbd className="shrink-0 rounded border border-border-subtle bg-background-subtle px-1.5 py-0.5 font-mono text-[10px] text-text-muted">
                            {command.shortcut}
                          </kbd>
                        ) : null}
                      </button>
                    );
                  })}
                </section>
              ))
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export * from './types';
