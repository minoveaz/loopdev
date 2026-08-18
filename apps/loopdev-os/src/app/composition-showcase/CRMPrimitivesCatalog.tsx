'use client';

import { useState } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import {
  Badge,
  Button,
  Checkbox,
  CommandBarTrigger,
  CommandDialog,
  EmptyState,
  FilterDropdown,
  IconButton,
  Icon,
  Input,
  LoadingState,
  PageHeader,
  SectionHeader,
  Select,
  TechnicalStatusBadge,
  TechnicalSurface,
  TrailingControl,
  UserAvatar,
} from '@loopdev/ui';

type Priority = 'P0' | 'P1' | 'P2';
type CatalogItem = {
  id: string;
  name: string;
  priority: Priority;
  usage: string;
  render: (state: CatalogState) => ReactNode;
};
type CatalogState = {
  selectedFilter: string[];
  setSelectedFilter: (values: string[]) => void;
  contactSelected: boolean;
  setContactSelected: (selected: boolean) => void;
  commandDialogOpen: boolean;
  setCommandDialogOpen: (open: boolean) => void;
};

const COMMAND_DIALOG_GROUPS = [
  {
    id: 'shortcuts',
    label: 'Shortcuts',
    commands: [
      { id: 'schema', label: 'Open schema selector', shortcut: 'O then S', icon: <Icon name="database" size="sm" /> },
      { id: 'tables', label: 'Search tables', shortcut: '⌘F', icon: <Icon name="search" size="sm" /> },
      { id: 'filters', label: 'Reset filters', shortcut: 'F then C', icon: <Icon name="filter_list" size="sm" /> },
    ],
  },
  {
    id: 'actions',
    label: 'Actions',
    commands: [
      { id: 'create-table', label: 'Create new table', shortcut: '⌘N', icon: <Icon name="add" size="sm" /> },
      { id: 'api-keys', label: 'Get API keys...', icon: <Icon name="key" size="sm" /> },
      { id: 'connect', label: 'Connect to your project', shortcut: 'O then C', icon: <Icon name="cable" size="sm" />, disabled: true },
    ],
  },
];

const INPUT_STATES = [
  { id: 'ready', label: 'Ready', props: { placeholder: 'Search contacts' } },
  { id: 'focused', label: 'Focused', props: { defaultValue: 'Northstar Labs', autoFocus: true } },
  { id: 'error', label: 'Error', props: { defaultValue: 'Unknown contact', error: 'Contact could not be found' } },
  { id: 'disabled', label: 'Disabled', props: { defaultValue: 'Read-only value', disabled: true } },
  { id: 'loading', label: 'Loading', props: { defaultValue: 'Searching contacts', isLoading: true } },
  { id: 'password', label: 'Password', props: { placeholder: 'Enter password', type: 'password' } },
] satisfies Array<{ id: string; label: string; props: ComponentProps<typeof Input> }>;

const INPUT_SIZES = [
  { id: 'sm', label: 'Small', size: 'sm' as const },
  { id: 'md', label: 'Medium', size: 'md' as const },
  { id: 'lg', label: 'Large', size: 'lg' as const },
];

const BUTTON_VARIANTS = [
  { id: 'primary', label: 'Primary', variant: 'primary' as const },
  { id: 'secondary', label: 'Secondary', variant: 'secondary' as const },
  { id: 'outline', label: 'Outline', variant: 'outline' as const },
  { id: 'ghost', label: 'Ghost', variant: 'ghost' as const },
  { id: 'energy', label: 'Energy', variant: 'energy' as const },
  { id: 'danger', label: 'Danger', variant: 'danger' as const },
];

const BUTTON_SIZES = [
  { id: 'sm', label: 'Small', size: 'sm' as const },
  { id: 'md', label: 'Medium', size: 'md' as const },
  { id: 'lg', label: 'Large', size: 'lg' as const },
];

const ICON_BUTTON_VARIANTS = [
  { id: 'neutral', label: 'Neutral', variant: 'neutral' as const },
  { id: 'primary', label: 'Primary', variant: 'primary' as const },
  { id: 'danger', label: 'Danger', variant: 'danger' as const },
  { id: 'success', label: 'Success', variant: 'success' as const },
  { id: 'ghost', label: 'Ghost', variant: 'ghost' as const },
  { id: 'energy', label: 'Energy', variant: 'energy' as const },
];

const ICON_BUTTON_SIZES = [
  { id: 'sm', label: 'Small', size: 'sm' as const },
  { id: 'md', label: 'Medium', size: 'md' as const },
  { id: 'lg', label: 'Large', size: 'lg' as const },
];

const SELECT_CASES = [
  { id: 'default', label: 'Default', props: { defaultValue: 'active' } },
  { id: 'disabled', label: 'Disabled', props: { defaultValue: 'prospect', disabled: true } },
] satisfies Array<{ id: string; label: string; props: ComponentProps<typeof Select> }>;

const SELECT_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'prospect', label: 'Prospect' },
  { value: 'paused', label: 'Paused' },
];

const BADGE_CASES = [
  { id: 'neutral', label: 'New', props: { status: 'neutral' as const } },
  { id: 'success', label: 'Active', props: { status: 'success' as const, showDot: true } },
  { id: 'error', label: 'Blocked', props: { status: 'error' as const, variant: 'outline' as const } },
  { id: 'live', label: 'Processing', props: { status: 'energy' as const, isLive: true, isTechnical: true } },
] satisfies Array<{ id: string; label: string; props: Omit<ComponentProps<typeof Badge>, 'children'> }>;

const EMPTY_STATE_CASES = [
  { id: 'empty', label: 'Empty', title: 'No contacts yet', description: 'Create a contact to begin building the CRM list.', status: 'default' as const },
  { id: 'filtered', label: 'Filtered empty', title: 'No contacts found', description: 'Clear the active filters to recover the full list.', status: 'default' as const },
  { id: 'error', label: 'Error', title: 'Contacts unavailable', description: 'The contact list could not be loaded.', status: 'error' as const },
] satisfies Array<{ id: string; label: string; title: string; description: string; status: 'default' | 'error' }>;

const LOADING_CASES = [
  { id: 'one', label: 'One line', lines: 1 },
  { id: 'two', label: 'Two lines', lines: 2 },
  { id: 'four', label: 'Four lines', lines: 4 },
] satisfies Array<{ id: string; label: string; lines: number }>;

const AVATAR_CASES = [
  { id: 'initials', label: 'Initials', props: { name: 'Alex Morgan', size: 'md' as const } },
  { id: 'status', label: 'With status', props: { name: 'Maya Chen', size: 'md' as const, status: 'online' as const, withStatus: true } },
  { id: 'fallback', label: 'Fallback', props: { size: 'sm' as const } },
] satisfies Array<{ id: string; label: string; props: ComponentProps<typeof UserAvatar> }>;

const CATALOG: CatalogItem[] = [
  {
    id: 'input',
    name: 'Input',
    priority: 'P0',
    usage: 'Search, forms and filters',
    render: () => (
      <>
        <div className="grid gap-3 font-mono [&_label]:font-mono [&_label]:normal-case sm:grid-cols-2">
          {INPUT_STATES.map(({ id, label, props }) => (
            <Input key={id} {...props} label={`${label} {${id}}`} aria-label={`${label} {${id}}`} />
          ))}
        </div>
        <div className="mt-5 space-y-2 border-t border-border-subtle pt-4">
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Sizes</p>
          <div className="flex flex-wrap items-end gap-3 font-mono [&_label]:font-mono [&_label]:normal-case">
            {INPUT_SIZES.map(({ id, label, size }) => (
              <Input key={id} label={`${label} {${size}}`} size={size} defaultValue="Sample value" />
            ))}
          </div>
        </div>
        <div className="mt-5 space-y-2 border-t border-border-subtle pt-4">
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Icons</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Start icon {startIcon}" startIcon={<Icon name="search" size="sm" />} placeholder="Search contacts" />
            <Input label="End icon {endIcon}" endIcon={<Icon name="calendar_today" size="sm" />} placeholder="Select date" />
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'button',
    name: 'Button',
    priority: 'P0',
    usage: 'Create, save, confirm and clear',
    render: () => (
      <div className="space-y-5">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Variants</p>
          <div className="flex flex-wrap gap-2">
            {BUTTON_VARIANTS.map(({ id, label, variant }) => (
              <Button key={id} variant={variant} size="sm"><span className="font-mono">{label} {'{'}{variant}{'}'}</span></Button>
            ))}
          </div>
        </div>
        <div className="space-y-2 border-t border-border-subtle pt-4">
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Sizes</p>
          <div className="flex flex-wrap items-end gap-2">
            {BUTTON_SIZES.map(({ id, label, size }) => (
              <Button key={id} size={size}><span className="font-mono">{label} {'{'}{size}{'}'}</span></Button>
            ))}
          </div>
        </div>
        <div className="space-y-2 border-t border-border-subtle pt-4">
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted">States and composition</p>
          <div className="flex flex-wrap gap-2">
            <Button startIcon="add"><span className="font-mono">Start icon {'{startIcon: add}'}</span></Button>
            <Button endIcon="arrow_forward" variant="outline"><span className="font-mono">End icon {'{endIcon: arrow_forward}'}</span></Button>
            <Button isLoading><span className="font-mono">Loading {'{isLoading: true}'}</span></Button>
            <Button disabled><span className="font-mono">Disabled {'{disabled: true}'}</span></Button>
            <Button fullWidth variant="secondary"><span className="font-mono">Full width {'{fullWidth: true, variant: secondary}'}</span></Button>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'icon-button',
    name: 'IconButton',
    priority: 'P0',
    usage: 'Clear, row actions and compact menus',
    render: () => (
      <div className="space-y-5">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Variants</p>
          <div className="flex flex-wrap items-center gap-2">
            {ICON_BUTTON_VARIANTS.map(({ id, label, variant }) => (
              <div key={id} className="flex flex-col items-center gap-1 font-mono text-[10px] text-text-muted">
                <IconButton icon="more_vert" variant={variant} tooltip={`${label} {${variant}}`} ariaLabel={`${label} {${variant}}`} />
                <span>{label} {'{'}{variant}{'}'}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-2 border-t border-border-subtle pt-4">
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Sizes</p>
          <div className="flex flex-wrap items-center gap-2">
            {ICON_BUTTON_SIZES.map(({ id, label, size }) => (
              <div key={id} className="flex flex-col items-center gap-1 font-mono text-[10px] text-text-muted">
                <IconButton icon="more_vert" size={size} tooltip={`${label} {${size}}`} ariaLabel={`${label} {${size}}`} />
                <span>{label} {'{'}{size}{'}'}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-2 border-t border-border-subtle pt-4">
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted">States</p>
          <div className="flex flex-wrap items-center gap-2">
            <IconButton icon="more_vert" tooltip="Loading {isLoading: true}" ariaLabel="Loading {isLoading: true}" isLoading />
            <IconButton icon="more_vert" tooltip="Disabled {disabled: true}" ariaLabel="Disabled {disabled: true}" disabled />
          </div>
        </div>
      </div>
    ),
  },
  { id: 'filter-dropdown', name: 'FilterDropdown', priority: 'P0', usage: 'Single- and multi-select filters', render: ({ selectedFilter, setSelectedFilter }) => <div data-testid="crm-filter-dropdown-fixture"><FilterDropdown icon="filter_list" label="Segment" options={['Enterprise', 'SMB', 'Partner']} selected={selectedFilter} multiple onToggle={(value) => setSelectedFilter(selectedFilter.includes(value) ? selectedFilter.filter((item) => item !== value) : [...selectedFilter, value])} onClear={() => setSelectedFilter([])} /></div> },
  { id: 'select', name: 'Select', priority: 'P0', usage: 'Native select when a CRM contract requires it', render: () => <div className="grid gap-3 sm:grid-cols-2">{SELECT_CASES.map(({ id, label, props }) => <Select key={id} {...props} aria-label={`Contact status ${label}`}>{SELECT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</Select>)}</div> },
  { id: 'checkbox', name: 'Checkbox', priority: 'P0', usage: 'Custom selection control for table compositions', render: ({ contactSelected, setContactSelected }) => <div className="space-y-2"><Checkbox aria-label="Select contact" label="Select contact" checked={contactSelected} onChange={(event) => setContactSelected(event.target.checked)} /><span className="block pl-6 font-mono text-xs text-text-muted">{contactSelected ? 'checked' : 'unchecked'}</span></div> },
  { id: 'badge', name: 'Badge / TechnicalStatusBadge', priority: 'P0', usage: 'Contact, pipeline and task status', render: () => <div className="flex flex-wrap items-center gap-2">{BADGE_CASES.map(({ id, label, props }) => <Badge key={id} {...props}>{label}</Badge>)}<TechnicalStatusBadge label="ACTIVE" severity="success" withPulse /></div> },
  { id: 'empty-state', name: 'EmptyState', priority: 'P0', usage: 'Empty and filtered-empty recovery', render: () => <div className="space-y-4">{EMPTY_STATE_CASES.map(({ id, label, title, description, status }) => <div key={id} className="space-y-2"><p className="font-mono text-[10px] uppercase text-text-muted">{label}</p><EmptyState size="sm" icon="inbox" title={title} description={description} status={status} action={id === 'filtered' ? <Button size="sm" variant="outline">Clear filters</Button> : undefined} /></div>)}</div> },
  { id: 'loading-state', name: 'LoadingState / Skeleton', priority: 'P0', usage: 'Loading without layout shift', render: () => <div className="space-y-3">{LOADING_CASES.map(({ id, label, lines }) => <div key={id} className="space-y-1"><p className="font-mono text-[10px] uppercase text-text-muted">{label}</p><LoadingState label="Loading contacts" lines={lines} /></div>)}</div> },
  { id: 'page-header', name: 'PageHeader', priority: 'P1', usage: 'CRM view heading and primary action', render: () => <div className="space-y-5">{['Compact context', 'Long content'].map((label, index) => <div key={label} className="space-y-2"><p className="font-mono text-[10px] uppercase text-text-muted">{label}</p><PageHeader eyebrow="CRM" title={index === 0 ? 'Contacts' : 'Customer contacts and relationship history'} description={index === 0 ? 'Customer relationship workspace' : 'Review ownership, activity and lifecycle information across the customer relationship workspace.'} actions={<Button size="sm">Create contact</Button>} /></div>)}</div> },
  { id: 'section-header', name: 'SectionHeader', priority: 'P1', usage: 'Content grouping', render: () => <div className="space-y-5">{['With action', 'Without action'].map((label, index) => <div key={label} className="space-y-2"><p className="font-mono text-[10px] uppercase text-text-muted">{label}</p><SectionHeader title={index === 0 ? 'Recent contacts' : 'Contact activity'} action={index === 0 ? <Button size="sm" variant="ghost">View all</Button> : undefined} /></div>)}</div> },
  { id: 'user-avatar', name: 'UserAvatar', priority: 'P1', usage: 'Owner and assignee identity', render: () => <div className="flex flex-wrap items-end gap-4">{AVATAR_CASES.map(({ id, label, props }) => <div key={id} className="flex flex-col items-center gap-1"><UserAvatar {...props} /><span className="font-mono text-[10px] uppercase text-text-muted">{label}</span></div>)}</div> },
  { id: 'command-bar', name: 'CommandBarTrigger', priority: 'P1', usage: 'Only when the CRM shell consumes it', render: ({ setCommandDialogOpen }) => <div data-testid="crm-command-bar-fixture" className="grid gap-3 sm:grid-cols-2"><div className="space-y-1"><p className="font-mono text-[10px] uppercase text-text-muted">Full</p><CommandBarTrigger className="w-full" placeholder="Search or type a command..." onOpen={() => setCommandDialogOpen(true)} /></div><div className="space-y-1"><p className="font-mono text-[10px] uppercase text-text-muted">Icon</p><CommandBarTrigger mode="icon" shortcut="⌘K" aria-label="Open command palette" onOpen={() => setCommandDialogOpen(true)} /></div><div className="space-y-1"><p className="font-mono text-[10px] uppercase text-text-muted">Disabled</p><CommandBarTrigger className="w-full" placeholder="Search or type a command..." disabled onOpen={() => undefined} /></div><div className="space-y-1"><p className="font-mono text-[10px] uppercase text-text-muted">Custom shortcut</p><CommandBarTrigger className="w-full" placeholder="Search CRM actions" shortcut="Ctrl K" onOpen={() => setCommandDialogOpen(true)} /></div></div> },
  { id: 'command-dialog', name: 'CommandDialog', priority: 'P1', usage: 'Command search overlay owned by the CRM shell', render: ({ commandDialogOpen, setCommandDialogOpen }) => <div data-testid="crm-command-dialog-fixture" className="space-y-3"><div className="flex flex-wrap items-center gap-2"><CommandBarTrigger placeholder="Search or type a command..." onOpen={() => setCommandDialogOpen(true)} /><span className="font-mono text-[10px] uppercase text-text-muted">Interactive grouped palette</span></div><CommandDialog open={commandDialogOpen} onOpenChange={setCommandDialogOpen} commands={[]} groups={COMMAND_DIALOG_GROUPS} title="Command palette" description="Available CRM workspace commands" placeholder="Run a command or search..." emptyMessage="No commands found." closeLabel="Close command palette" closeOnSelect /></div> },
  { id: 'trailing-control', name: 'TrailingControl', priority: 'P2', usage: 'Deferred until a CRM composition requires it', render: () => <TrailingControl currentDistance={0.5} onUpdateDistance={async () => undefined} /> },
];

export function CRMPrimitivesCatalog() {
  const [selectedFilter, setSelectedFilter] = useState<string[]>([]);
  const [contactSelected, setContactSelected] = useState(false);
  const [commandDialogOpen, setCommandDialogOpen] = useState(false);
  const groups = (['P0', 'P1', 'P2'] as Priority[]).map((priority) => ({ priority, items: CATALOG.filter((item) => item.priority === priority) }));

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="CRM primitive inventory" title="Shared components" description="Current rendered contracts before CRM composition certification." />
      {groups.map(({ priority, items }) => (
        <section key={priority} aria-labelledby={`crm-${priority}`} className="space-y-3">
          <SectionHeader title={`${priority} · ${priority === 'P0' ? 'Required baseline' : priority === 'P1' ? 'Composition support' : 'Deferred candidate'}`} />
          <div className="grid gap-4 xl:grid-cols-2 xl:items-stretch">
            {items.map((item) => (
              <TechnicalSurface
                key={item.id}
                variant="surface"
                radius="md"
                border="technical"
                overflow={item.id === 'filter-dropdown' ? 'visible' : undefined}
                className="h-full p-4"
              >
                <div className="mb-4 flex items-start justify-between gap-4 border-b border-border-subtle pb-3">
                  <div><h3 className="font-mono text-sm uppercase tracking-[0.12em]">{item.name}</h3><p className="mt-1 text-xs text-text-muted">{item.usage}</p></div>
                  <span className="font-mono text-[10px] uppercase text-text-muted">{priority}</span>
                </div>
                <div className="min-h-16">{item.render({ selectedFilter, setSelectedFilter, contactSelected, setContactSelected, commandDialogOpen, setCommandDialogOpen })}</div>
              </TechnicalSurface>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
