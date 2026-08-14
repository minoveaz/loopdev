'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  AVAILABLE_SUITES_FIXTURES,
  BOARD_WORKSPACE_COMPOSITION,
  BrandLogo,
  Button,
  CommandBarTrigger,
  CompositionGrid,
  CREATIVE_EDITOR_COMPOSITION,
  DATA_WORKSPACE_COMPOSITION,
  GlobalContextPanel,
  IconButton,
  ICON_REGISTRY,
  EmptyState,
  LoadingState,
  IMMERSIVE_WORKFLOW_COMPOSITION,
  MARKETING_STUDIO_SCHEMA,
  ModuleHeader,
  ModuleToolbar,
  NOTIFICATION_CENTER_FIXTURES,
  OrganizationSwitcher,
  RECORD_WORKSPACE_COMPOSITION,
  SPLIT_WORKSPACE_COMPOSITION,
  SUITE_OVERVIEW_COMPOSITION,
  SuiteRuntime,
  SuiteSwitcher,
  TechnicalCanvas,
  TechnicalSurface,
  UserMenu,
  type GlobalContextPanelMode,
} from '@loopdev/ui';
import type { ViewComposition } from '@loopdev/contracts';
import type { ModuleShellUsage, NavigationSchema, SuiteConfig } from '@loopdev/contracts';
import { themes } from '@loopdev/tokens';
import { PlatformHeaderControls } from '@/components/layout/PlatformHeaderControls';
import {
  resolveShowcaseZonePanelRenderer,
  resolveShowcaseZoneFooterRenderer,
  resolveShowcaseZoneRenderer,
} from '@/suites/showcase/zoneRenderers';
import { useRouter } from 'next/navigation';

const FIXTURES: Record<string, ViewComposition> = {
  SuiteOverview: SUITE_OVERVIEW_COMPOSITION,
  DataWorkspace: DATA_WORKSPACE_COMPOSITION,
  SplitWorkspace: SPLIT_WORKSPACE_COMPOSITION,
  RecordWorkspace: RECORD_WORKSPACE_COMPOSITION,
  BoardWorkspace: BOARD_WORKSPACE_COMPOSITION,
  ImmersiveWorkflow: IMMERSIVE_WORKFLOW_COMPOSITION,
  CreativeEditor: CREATIVE_EDITOR_COMPOSITION,
};

const regionClass = (component: string, recipe?: RecipeName) =>
  component === 'VideoStage' || component === 'TechnicalCanvas'
    ? recipe === 'CreativeEditor'
      ? 'h-full min-h-0'
      : 'min-h-[18rem]'
    : recipe === 'CreativeEditor' && component === 'Timeline'
      ? 'h-full min-h-0'
      : 'min-h-[5rem]';

const STATES = [
  'ready',
  'loading',
  'empty',
  'error',
  'forbidden',
  'read-only',
  'offline',
  'stale',
  'conflict',
] as const;
type ShowcaseState = (typeof STATES)[number];

type RecipeName = keyof typeof FIXTURES;

const RECIPE_NAMES = Object.keys(FIXTURES) as RecipeName[];
const RECIPE_ICONS: Record<RecipeName, string> = {
  SuiteOverview: 'LayoutDashboard',
  DataWorkspace: 'Table2',
  SplitWorkspace: 'Columns3',
  RecordWorkspace: 'PanelTop',
  BoardWorkspace: 'KanbanSquare',
  ImmersiveWorkflow: 'Maximize2',
  CreativeEditor: 'Clapperboard',
};

const SHOWCASE_THEME_VARIABLES = [
  '--lpd-color-brand-primary',
  '--lpd-color-brand-primary-rgb',
  '--lpd-color-bg-primary-subtle',
  '--lpd-color-brand-secondary',
  '--lpd-color-brand-secondary-rgb',
  '--lpd-color-brand-energy',
  '--lpd-color-bg-base',
  '--lpd-color-text-base',
  '--background',
  '--foreground',
  '--primary',
  '--accent',
  '--ring',
];

const SHOWCASE_ORGANIZATIONS = [
  { id: 'showcase-workspace', name: 'Showcase Workspace', planLabel: 'PRO', theme: '' },
  {
    id: 'northstar-labs',
    name: 'Northstar Labs',
    planLabel: 'FREE',
    theme: themes.estarProtegidos,
  },
];

type ShowcaseTheme = 'light' | 'dark';

const emitShowcaseEvent = (name: string, detail: Record<string, string | number | boolean>) => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(`loopdev:showcase:${name}`, { detail }));
};

const RECIPE_SHELL_USAGE: Partial<Record<RecipeName, ModuleShellUsage>> = {
  SplitWorkspace: {
    canvasMode: 'split',
    suiteHeader: { label: 'SplitWorkspace', contentKey: 'split.header' },
    suiteToolbar: { label: 'Records', contentKey: 'split.toolbar' },
    moduleContextSidebar: {
      label: 'ModuleContextSidebar',
      contentKey: 'split.context-sidebar',
      width: 'standard',
      collapsible: true,
      collapseIcon: 'menu',
      expandIcon: 'menu',
      footer: { contentKey: 'split.context-sidebar-footer' },
    },
    moduleContextPanel: {
      label: 'ModuleContextPanel',
      contentKey: 'split.context-panel',
      width: 'extra-wide',
      footer: { contentKey: 'split.context-panel-footer' },
    },
  },
  CreativeEditor: {
    canvasMode: 'full-bleed',
    contextualAction: { label: 'Open Media Library', icon: 'menu', tone: 'accent' },
    moduleContextSidebar: {
      label: 'Media Library',
      contentKey: 'creative-editor.media-library',
      width: 'standard',
      collapsible: true,
      collapsedPresentation: 'trigger',
      defaultCollapsed: true,
      collapseIcon: 'menu',
      expandIcon: 'menu',
      footer: { contentKey: 'creative-editor.media-library-footer' },
    },
    moduleContextPanel: {
      label: 'Media Details',
      contentKey: 'creative-editor.media-details',
      width: 'standard',
      footer: { contentKey: 'creative-editor.media-details-footer' },
    },
  },
};

const SHOWCASE_NAVIGATION: NavigationSchema = {
  version: '1.0',
  suite: MARKETING_STUDIO_SCHEMA.suite,
  exitHatch: MARKETING_STUDIO_SCHEMA.exitHatch,
  groups: [
    {
      id: 'composition-recipes',
      label: 'Composition recipes',
      priority: 1,
      items: RECIPE_NAMES.map((name, index) => ({
        id: `composition.${name}`,
        kind: 'module' as const,
        moduleId: name,
        label: name,
        icon: RECIPE_ICONS[name],
        priority: index + 1,
        route: { routeId: `/composition-showcase?recipe=${name}` },
      })),
    },
  ],
};

const SHOWCASE_SUITE_CONFIG: SuiteConfig = {
  identity: MARKETING_STUDIO_SCHEMA.suite,
  navigation: SHOWCASE_NAVIGATION,
  accessMap: {},
  modules: RECIPE_NAMES.map((name) => ({
    moduleId: name,
    label: name,
    route: `/composition-showcase?recipe=${name}`,
    breadcrumbs: ['Composition Showcase', name],
    capabilities: name === 'SplitWorkspace' ? ['sidebar', 'toolbar'] : ['sidebar'],
    shell: RECIPE_SHELL_USAGE[name],
  })),
};

const RECIPE_CANVAS_MODES: Record<
  RecipeName,
  'overview' | 'data' | 'workspace' | 'split' | 'board' | 'full-bleed'
> = {
  SuiteOverview: 'overview',
  DataWorkspace: 'data',
  SplitWorkspace: 'split',
  RecordWorkspace: 'workspace',
  BoardWorkspace: 'board',
  ImmersiveWorkflow: 'full-bleed',
  CreativeEditor: 'full-bleed',
};

const SplitRecipeHeader = () => (
  <ModuleHeader
    segments={[
      { id: 'suite', label: 'Composition Showcase' },
      { id: 'recipe', label: 'SplitWorkspace', isActive: true },
    ]}
    statusLabel="Reference"
    statusSeverity="success"
    rightSlot={
      <Button variant="outline" size="sm">
        Recipe action
      </Button>
    }
  />
);

const SplitRecipeToolbar = () => (
  <ModuleToolbar
    left={
      <TechnicalSurface
        variant="surface"
        radius="md"
        border="technical"
        className="text-text-muted flex items-center gap-2 px-3 py-1.5"
      >
        <IconButton
          icon={ICON_REGISTRY.actions.search}
          ariaLabel="Search records"
          tooltip="Search records"
          size="sm"
        />
        <span>Search records</span>
      </TechnicalSurface>
    }
    center={
      <div className="text-text-muted flex items-center gap-2 text-xs">
        <Button variant="ghost" size="sm">
          All fields
        </Button>
        <Button variant="ghost" size="sm">
          Sorted by relevance
        </Button>
      </div>
    }
    right={
      <Button variant="primary" size="sm">
        Create record
      </Button>
    }
  />
);

const SuiteOverviewCanvas = ({
  state,
  composition,
}: {
  state: ShowcaseState;
  composition: ViewComposition;
}) => {
  const blockedState = ['empty', 'error', 'forbidden'].includes(state);
  const regions: Record<string, ReactNode> = {
    summary: (
      <TechnicalSurface
        variant="surface"
        radius="md"
        border="technical"
        className={`h-full p-5 ${blockedState ? 'opacity-50' : ''}`}
      >
        <p className="text-text-muted text-xs font-semibold uppercase tracking-[0.16em]">
          Portfolio health
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {[
            ['Active workspaces', '24'],
            ['Open opportunities', '86'],
            ['Tasks due today', '12'],
            ['Team activity', '+18%'],
          ].map(([label, value]) => (
            <TechnicalSurface
              key={label}
              variant="surface"
              radius="sm"
              border="subtle"
              className="p-4"
            >
              <span className="text-text-muted text-xs">{label}</span>
              <strong className="text-text-main mt-2 block text-2xl font-semibold">{value}</strong>
            </TechnicalSurface>
          ))}
        </div>
      </TechnicalSurface>
    ),
    'visual-canvas': (
      <TechnicalSurface variant="canvas" radius="sm" border="technical" className="h-full p-5">
        <p className="text-text-muted text-xs font-semibold uppercase tracking-[0.16em]">
          Workspace map
        </p>
        <div className="relative mt-4 flex min-h-40 items-center justify-center overflow-hidden rounded-md border border-dashed border-primary/40 bg-primary/5">
          <TechnicalCanvas variant="blueprint" intensity="medium" size={40} showSubgrid />
          <span className="text-primary relative z-10 text-xs font-medium">Workspace map</span>
        </div>
      </TechnicalSurface>
    ),
    metrics: (
      <TechnicalSurface variant="surface" radius="md" border="technical" className="p-5">
        {state === 'loading' ? <LoadingState label="Loading overview" lines={3} /> : null}
        {blockedState ? (
          <EmptyState
            icon={state === 'error' ? 'error' : state === 'forbidden' ? 'lock' : 'inbox'}
            title={
              state === 'empty'
                ? 'No overview data'
                : state === 'error'
                  ? 'Overview unavailable'
                  : 'Overview restricted'
            }
            description="This fixture keeps the composition stable while the state explains the next action."
            action={
              <Button variant={state === 'error' ? 'danger' : 'primary'} size="sm">
                {state === 'error'
                  ? 'Retry'
                  : state === 'forbidden'
                    ? 'Request access'
                    : 'Create overview'}
              </Button>
            }
          />
        ) : null}
        {!['loading', 'empty', 'error', 'forbidden'].includes(state) ? (
          <span className="text-text-muted text-sm">
            Metrics remain available for the current review state.
          </span>
        ) : null}
      </TechnicalSurface>
    ),
    activity: (
      <TechnicalSurface variant="surface" radius="md" border="technical" className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-text-muted text-xs font-semibold uppercase tracking-[0.16em]">
              Recent activity
            </p>
            <h2 className="text-text-main mt-1 text-lg font-semibold">What needs attention</h2>
          </div>
          <Button variant="outline" size="sm">
            View all activity
          </Button>
        </div>
        <div className="mt-4 space-y-2">
          {[
            'Northstar workspace updated',
            'New opportunity moved to review',
            'Three tasks assigned to your team',
          ].map((item) => (
            <TechnicalSurface
              key={item}
              variant="surface"
              radius="sm"
              border="subtle"
              className="flex items-center justify-between gap-3 px-3 py-3 text-sm"
            >
              <span className="text-text-main">{item}</span>
              <span className="text-text-muted text-xs">Today</span>
            </TechnicalSurface>
          ))}
        </div>
      </TechnicalSurface>
    ),
  };

  return (
    <div className="p-4 font-sans sm:p-6">
      <CompositionGrid composition={composition} regions={regions} />
    </div>
  );
};

const DataWorkspaceCanvas = ({ state }: { state: ShowcaseState }) => {
  const rows = [
    ['Northstar Labs', 'Enterprise', 'Active', '24 users', 'Today'],
    ['Estar Protegidos', 'Growth', 'Review', '12 users', 'Yesterday'],
    ['Helio Systems', 'Starter', 'Active', '8 users', 'Aug 12'],
    ['Monument Health', 'Enterprise', 'Paused', '41 users', 'Aug 11'],
  ];
  const blockedState = ['empty', 'error', 'forbidden'].includes(state);

  return (
    <div className="space-y-4 p-4 font-sans sm:p-6">
      <TechnicalSurface variant="surface" radius="md" border="technical" className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <TechnicalSurface
            variant="canvas"
            radius="sm"
            border="subtle"
            className="flex min-w-[12rem] flex-1 items-center gap-2 px-3 py-2 text-sm"
          >
            <IconButton
              icon={ICON_REGISTRY.actions.search}
              ariaLabel="Search workspaces"
              tooltip="Search workspaces"
              size="sm"
            />
            <span className="text-text-muted">Search workspaces</span>
          </TechnicalSurface>
          <Button variant="outline" size="sm">
            Status: All
          </Button>
          <Button variant="outline" size="sm">
            Plan: All
          </Button>
          <Button variant="ghost" size="sm">
            Reset
          </Button>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-text-muted">
          <span>24 workspaces</span>
          <span>Last synced today at 09:42</span>
        </div>
      </TechnicalSurface>

      {state === 'loading' ? (
        <TechnicalSurface variant="surface" radius="md" border="technical" className="p-5">
          <LoadingState label="Loading workspaces" lines={5} />
        </TechnicalSurface>
      ) : null}
      {blockedState ? (
        <TechnicalSurface variant="surface" radius="md" border="technical">
          <EmptyState
            icon={state === 'error' ? 'error' : state === 'forbidden' ? 'lock' : 'inbox'}
            title={
              state === 'empty'
                ? 'No workspaces found'
                : state === 'error'
                  ? 'Workspaces unavailable'
                  : 'Workspace access restricted'
            }
            description="The table keeps its layout while the state communicates the next action."
            action={
              <Button variant={state === 'error' ? 'danger' : 'primary'} size="sm">
                {state === 'error'
                  ? 'Retry'
                  : state === 'forbidden'
                    ? 'Request access'
                    : 'Create workspace'}
              </Button>
            }
          />
        </TechnicalSurface>
      ) : null}

      <TechnicalSurface
        variant="surface"
        radius="md"
        border="technical"
        className={blockedState || state === 'loading' ? 'opacity-50' : ''}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
            <thead className="border-b border-border-technical text-xs uppercase tracking-[0.12em] text-text-muted">
              <tr>
                {['Workspace', 'Plan', 'Status', 'Members', 'Updated'].map((heading) => (
                  <th key={heading} className="px-4 py-3 font-semibold">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([workspace, plan, status, members, updated]) => (
                <tr
                  key={workspace}
                  className="border-b border-border-subtle last:border-0 hover:bg-primary/5"
                >
                  <td className="px-4 py-3 font-medium text-text-main">{workspace}</td>
                  <td className="px-4 py-3 text-text-muted">{plan}</td>
                  <td className="px-4 py-3">
                    <span className="rounded border border-brand-cyan/40 bg-brand-cyan/10 px-2 py-1 text-xs text-text-main">
                      {status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-muted">{members}</td>
                  <td className="px-4 py-3 text-text-muted">{updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-border-technical flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-xs text-text-muted">
          <span>Showing 1-4 of 24</span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              Previous
            </Button>
            <span>Page 1 of 6</span>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </TechnicalSurface>
    </div>
  );
};

const RecordWorkspaceCanvas = ({ state }: { state: ShowcaseState }) => {
  const blockedState = ['empty', 'error', 'forbidden'].includes(state);
  const activities = [
    'Contract renewal moved to review',
    'Maya added a note to the account',
    'Quarterly health check completed',
  ];

  return (
    <div className="p-4 font-sans sm:p-6">
      <CompositionGrid
        composition={RECORD_WORKSPACE_COMPOSITION}
        regions={{
          record: (
            <TechnicalSurface
              variant="surface"
              radius="md"
              border="technical"
              className={`h-full p-5 ${blockedState ? 'opacity-50' : ''}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-text-muted text-xs font-semibold uppercase tracking-[0.16em]">
                    Customer record
                  </p>
                  <h2 className="text-text-main mt-2 text-xl font-semibold">Northstar Labs</h2>
                  <p className="text-text-muted mt-1 text-sm">
                    Enterprise workspace · Account owner Maya Chen
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={state === 'read-only' || state === 'forbidden'}
                >
                  Edit record
                </Button>
              </div>
              <div className="mt-5 flex flex-wrap gap-2 border-b border-border-technical pb-3 text-sm">
                {['Overview', 'Activity', 'Files', 'Notes'].map((tab, index) => (
                  <Button key={tab} variant={index === 0 ? 'primary' : 'ghost'} size="sm">
                    {tab}
                  </Button>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  ['Lifecycle', 'Customer'],
                  ['Industry', 'Technology'],
                  ['Renewal', '18 Sep 2026'],
                  ['Health', 'Good'],
                ].map(([label, value]) => (
                  <TechnicalSurface
                    key={label}
                    variant="surface"
                    radius="sm"
                    border="subtle"
                    className="p-3"
                  >
                    <span className="text-text-muted text-xs">{label}</span>
                    <strong className="text-text-main mt-1 block text-sm">{value}</strong>
                  </TechnicalSurface>
                ))}
              </div>
            </TechnicalSurface>
          ),
          inspector: (
            <TechnicalSurface
              variant="surface"
              depth="raised"
              radius="md"
              border="technical"
              className="h-full p-5"
            >
              <p className="text-text-muted text-xs font-semibold uppercase tracking-[0.16em]">
                Inspector
              </p>
              {state === 'loading' ? (
                <div className="mt-4">
                  <LoadingState label="Loading inspector" lines={4} />
                </div>
              ) : null}
              {blockedState ? (
                <div className="mt-4">
                  <EmptyState
                    icon={state === 'error' ? 'error' : state === 'forbidden' ? 'lock' : 'inbox'}
                    title={
                      state === 'empty'
                        ? 'No inspector data'
                        : state === 'error'
                          ? 'Inspector unavailable'
                          : 'Inspector restricted'
                    }
                    description="Review the record state before changing properties."
                    action={
                      <Button variant={state === 'error' ? 'danger' : 'outline'} size="sm">
                        {state === 'error' ? 'Retry' : 'Request access'}
                      </Button>
                    }
                  />
                </div>
              ) : null}
              {!['loading', 'empty', 'error', 'forbidden'].includes(state) ? (
                <div className="mt-4 space-y-3">
                  {[
                    ['Owner', 'Maya Chen'],
                    ['Segment', 'Enterprise'],
                    ['Last touch', 'Today, 09:42'],
                    ['Source', 'Account team'],
                  ].map(([label, value]) => (
                    <div key={label} className="border-b border-border-subtle pb-3">
                      <span className="text-text-muted block text-xs">{label}</span>
                      <span className="text-text-main mt-1 block text-sm">{value}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </TechnicalSurface>
          ),
          activity: (
            <TechnicalSurface variant="surface" radius="md" border="technical" className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-text-muted text-xs font-semibold uppercase tracking-[0.16em]">
                    Activity
                  </p>
                  <h3 className="text-text-main mt-1 text-lg font-semibold">Recent account work</h3>
                </div>
                <Button variant="outline" size="sm">
                  Add activity
                </Button>
              </div>
              <div className="mt-4 space-y-2">
                {activities.map((activity) => (
                  <TechnicalSurface
                    key={activity}
                    variant="surface"
                    radius="sm"
                    border="subtle"
                    className="flex flex-wrap items-center justify-between gap-2 px-3 py-3 text-sm"
                  >
                    <span className="text-text-main">{activity}</span>
                    <span className="text-text-muted text-xs">Today</span>
                  </TechnicalSurface>
                ))}
              </div>
            </TechnicalSurface>
          ),
        }}
      />
    </div>
  );
};

const BoardWorkspaceCanvas = ({ state }: { state: ShowcaseState }) => {
  const columns = [
    { title: 'Backlog', count: 4, cards: ['Renewal brief', 'Usage review'] },
    { title: 'In progress', count: 3, cards: ['Onboarding plan', 'Q3 expansion'] },
    { title: 'Review', count: 2, cards: ['Security assessment', 'Success plan'] },
    { title: 'Done', count: 8, cards: ['Kickoff meeting', 'Billing update'] },
  ];
  const blockedState = ['empty', 'error', 'forbidden'].includes(state);

  return (
    <div className="space-y-4 p-4 font-sans sm:p-6">
      <TechnicalSurface
        variant="surface"
        radius="md"
        border="technical"
        className="flex flex-wrap items-center justify-between gap-3 p-4"
      >
        <div>
          <p className="text-text-muted text-xs font-semibold uppercase tracking-[0.16em]">
            Pipeline board
          </p>
          <h2 className="text-text-main mt-1 text-lg font-semibold">Customer success workflow</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            Filter board
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={state === 'read-only' || state === 'forbidden'}
          >
            Add card
          </Button>
        </div>
      </TechnicalSurface>
      <CompositionGrid
        composition={BOARD_WORKSPACE_COMPOSITION}
        regions={{
          toolbar: (
            <TechnicalSurface
              variant="surface"
              radius="sm"
              border="subtle"
              className="flex items-center justify-between gap-3 p-3 text-sm"
            >
              <span className="text-text-muted">24 active cards</span>
              <span className="text-text-muted">Sorted by priority</span>
            </TechnicalSurface>
          ),
          board: (
            <TechnicalSurface
              variant="canvas"
              radius="md"
              border="technical"
              className="h-full min-w-0 overflow-hidden p-3"
            >
              {state === 'loading' ? <LoadingState label="Loading board" lines={5} /> : null}
              {blockedState ? (
                <EmptyState
                  icon={state === 'error' ? 'error' : state === 'forbidden' ? 'lock' : 'inbox'}
                  title={
                    state === 'empty'
                      ? 'No cards on this board'
                      : state === 'error'
                        ? 'Board unavailable'
                        : 'Board restricted'
                  }
                  description="The board layout stays stable while the state explains the next action."
                  action={
                    <Button variant={state === 'error' ? 'danger' : 'primary'} size="sm">
                      {state === 'error'
                        ? 'Retry'
                        : state === 'forbidden'
                          ? 'Request access'
                          : 'Create card'}
                    </Button>
                  }
                />
              ) : null}
              {!['loading', 'empty', 'error', 'forbidden'].includes(state) ? (
                <div className="flex min-w-[42rem] gap-3 overflow-x-auto pb-2">
                  {columns.map((column) => (
                    <TechnicalSurface
                      key={column.title}
                      variant="surface"
                      radius="sm"
                      border="subtle"
                      className="min-w-[11rem] flex-1 p-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-text-main text-sm font-semibold">{column.title}</span>
                        <span className="text-text-muted text-xs">{column.count}</span>
                      </div>
                      <div className="mt-3 space-y-2">
                        {column.cards.map((card) => (
                          <TechnicalSurface
                            key={card}
                            variant="surface"
                            radius="sm"
                            border="technical"
                            className="p-3 shadow-sm"
                          >
                            <span className="text-text-main block text-sm font-medium">{card}</span>
                            <span className="text-text-muted mt-2 block text-xs">
                              Northstar Labs
                            </span>
                          </TechnicalSurface>
                        ))}
                      </div>
                    </TechnicalSurface>
                  ))}
                </div>
              ) : null}
            </TechnicalSurface>
          ),
          metrics: (
            <TechnicalSurface
              variant="surface"
              depth="raised"
              radius="md"
              border="technical"
              className="h-full p-4"
            >
              <p className="text-text-muted text-xs font-semibold uppercase tracking-[0.16em]">
                Board metrics
              </p>
              <div className="mt-4 space-y-3">
                {[
                  ['Throughput', '18'],
                  ['At risk', '4'],
                  ['Completed', '62%'],
                ].map(([label, value]) => (
                  <div key={label} className="border-b border-border-subtle pb-3">
                    <span className="text-text-muted block text-xs">{label}</span>
                    <strong className="text-text-main mt-1 block text-xl">{value}</strong>
                  </div>
                ))}
              </div>
            </TechnicalSurface>
          ),
        }}
      />
    </div>
  );
};

const SplitWorkspaceCanvas = ({ state }: { state: ShowcaseState }) => {
  const blockedState = ['empty', 'error', 'forbidden'].includes(state);
  const records = ['Northstar Labs', 'Helio Systems', 'Monument Health', 'Estar Protegidos'];

  return (
    <div className="p-4 font-sans sm:p-6">
      <CompositionGrid
        composition={SPLIT_WORKSPACE_COMPOSITION}
        regions={{
          list: (
            <TechnicalSurface
              variant="surface"
              radius="md"
              border="technical"
              className="h-full p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-text-muted text-xs font-semibold uppercase tracking-[0.16em]">
                    Records
                  </p>
                  <h2 className="text-text-main mt-1 text-lg font-semibold">Accounts</h2>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={state === 'read-only' || state === 'forbidden'}
                >
                  New
                </Button>
              </div>
              <div className="mt-4 space-y-2">
                {records.map((record, index) => (
                  <TechnicalSurface
                    key={record}
                    variant="surface"
                    radius="sm"
                    border={index === 0 ? 'strong' : 'subtle'}
                    className="flex items-center justify-between gap-2 px-3 py-3 text-sm"
                  >
                    <span className="text-text-main">{record}</span>
                    <span className="text-text-muted text-xs">{index + 1} open</span>
                  </TechnicalSurface>
                ))}
              </div>
            </TechnicalSurface>
          ),
          detail: (
            <TechnicalSurface
              variant="surface"
              depth="raised"
              radius="md"
              border="technical"
              className="h-full p-5"
            >
              <p className="text-text-muted text-xs font-semibold uppercase tracking-[0.16em]">
                Selected record
              </p>
              {state === 'loading' ? (
                <div className="mt-4">
                  <LoadingState label="Loading selected record" lines={4} />
                </div>
              ) : null}
              {blockedState ? (
                <div className="mt-4">
                  <EmptyState
                    icon={state === 'error' ? 'error' : state === 'forbidden' ? 'lock' : 'inbox'}
                    title={
                      state === 'empty'
                        ? 'Select a record'
                        : state === 'error'
                          ? 'Detail unavailable'
                          : 'Detail restricted'
                    }
                    description="The split layout preserves list context while the detail state changes."
                    action={
                      <Button variant={state === 'error' ? 'danger' : 'outline'} size="sm">
                        {state === 'error'
                          ? 'Retry'
                          : state === 'forbidden'
                            ? 'Request access'
                            : 'Select record'}
                      </Button>
                    }
                  />
                </div>
              ) : null}
              {!['loading', 'empty', 'error', 'forbidden'].includes(state) ? (
                <>
                  <h2 className="text-text-main mt-2 text-xl font-semibold">Northstar Labs</h2>
                  <p className="text-text-muted mt-1 text-sm">
                    Enterprise account · selected from Accounts
                  </p>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {[
                      ['Owner', 'Maya Chen'],
                      ['Health', 'Good'],
                      ['Renewal', 'Sep 18'],
                      ['Open tasks', '6'],
                    ].map(([label, value]) => (
                      <TechnicalSurface
                        key={label}
                        variant="surface"
                        radius="sm"
                        border="subtle"
                        className="p-3"
                      >
                        <span className="text-text-muted block text-xs">{label}</span>
                        <strong className="text-text-main mt-1 block text-sm">{value}</strong>
                      </TechnicalSurface>
                    ))}
                  </div>
                </>
              ) : null}
            </TechnicalSurface>
          ),
        }}
      />
    </div>
  );
};

const ImmersiveWorkflowCanvas = ({ state }: { state: ShowcaseState }) => {
  const blockedState = ['empty', 'error', 'forbidden'].includes(state);
  return (
    <div className="relative min-h-full overflow-hidden bg-shell-canvas p-4 font-sans sm:p-6">
      <TechnicalCanvas variant="blueprint" intensity="low" size={48} showSubgrid />
      <div className="relative z-10 grid min-h-[32rem] grid-cols-1 gap-4 lg:grid-cols-12">
        <TechnicalSurface
          variant="surface"
          radius="md"
          border="technical"
          className="lg:col-span-9 p-5"
        >
          <p className="text-text-muted text-xs font-semibold uppercase tracking-[0.16em]">
            Workflow execution
          </p>
          <h2 className="text-text-main mt-2 text-2xl font-semibold">Launch campaign pipeline</h2>
          <div className="mt-6 space-y-3">
            {['Brief approved', 'Assets prepared', 'Audience reviewed', 'Ready to publish'].map(
              (step, index) => (
                <div key={step} className="flex items-center gap-3">
                  <span
                    className={`flex size-7 items-center justify-center rounded-full border text-xs ${index < 2 ? 'border-brand-cyan/50 bg-brand-cyan/10 text-text-main' : 'border-border-technical text-text-muted'}`}
                  >
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <span className="text-text-main block text-sm font-medium">{step}</span>
                    <div className="mt-2 h-1 overflow-hidden rounded bg-border-technical">
                      <span
                        className={`block h-full ${index < 2 ? 'w-full bg-brand-cyan' : 'w-1/3 bg-primary'}`}
                      />
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </TechnicalSurface>
        <div className="flex flex-col gap-4 lg:col-span-3">
          <TechnicalSurface
            variant="surface"
            depth="raised"
            radius="md"
            border="technical"
            className="p-4"
          >
            <p className="text-text-muted text-xs font-semibold uppercase tracking-[0.16em]">
              Actions
            </p>
            {blockedState ? (
              <div className="mt-3">
                <EmptyState
                  icon={state === 'error' ? 'error' : state === 'forbidden' ? 'lock' : 'inbox'}
                  title={
                    state === 'empty'
                      ? 'No workflow'
                      : state === 'error'
                        ? 'Workflow paused'
                        : 'Access restricted'
                  }
                  description="Resolve the workflow state before acting."
                  action={
                    <Button variant={state === 'error' ? 'danger' : 'outline'} size="sm">
                      {state === 'error' ? 'Retry' : 'Request access'}
                    </Button>
                  }
                />
              </div>
            ) : (
              <div className="mt-3 flex flex-col gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  disabled={state === 'read-only' || state === 'stale'}
                >
                  Continue workflow
                </Button>
                <Button variant="outline" size="sm">
                  Save checkpoint
                </Button>
              </div>
            )}
          </TechnicalSurface>
          <TechnicalSurface variant="surface" radius="md" border="technical" className="flex-1 p-4">
            <p className="text-text-muted text-xs font-semibold uppercase tracking-[0.16em]">
              Status
            </p>
            <strong className="text-text-main mt-3 block text-lg">
              {state === 'offline'
                ? 'Offline cache'
                : state === 'stale'
                  ? 'Needs refresh'
                  : 'On track'}
            </strong>
            <span className="text-text-muted mt-1 block text-sm">4 of 6 steps complete</span>
          </TechnicalSurface>
        </div>
      </div>
    </div>
  );
};

const CreativeEditorCanvas = ({
  regions,
  state,
}: {
  regions: Record<string, ReactNode>;
  state: ShowcaseState;
}) => (
  <div className="flex h-full min-h-0 flex-col overflow-hidden bg-shell-canvas p-3">
    <section className="relative min-h-0 flex-1 overflow-hidden bg-surface-dark">
      <div className="border-border-technical flex min-h-12 items-center gap-2 overflow-x-auto border-b bg-surface-elevated px-3 py-2">
        <span className="text-primary shrink-0 font-mono text-[10px] uppercase tracking-[0.16em]">
          StageToolBar
        </span>
        <span className="bg-border-technical h-4 w-px shrink-0" aria-hidden="true" />
        {[
          'Edit',
          'Crop',
          'Remove background',
          'Audio',
          'Subtitles',
          'Speed',
          'Color',
          'Rotate',
          'Animate',
          'Position',
        ].map((tool) => (
          <Button
            key={tool}
            variant={tool === 'Edit' ? 'primary' : 'ghost'}
            size="sm"
            className="shrink-0"
            aria-pressed={tool === 'Edit'}
          >
            {tool}
          </Button>
        ))}
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center p-2 sm:p-3">
        <div className="relative aspect-video h-full max-h-full w-full max-w-7xl overflow-hidden border-2 border-primary/60 bg-black/30 shadow-inner">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
            <span className="text-primary font-mono text-[10px] uppercase tracking-[0.18em]">
              VideoStage
            </span>
            <strong className="text-sm font-semibold text-text-main">Preview frame</strong>
            <span className="text-xs text-text-muted">Module-owned renderer insertion point</span>
            <span className="text-[10px] text-text-muted">
              16:9 reference / zoom controlled by module
            </span>
          </div>
        </div>
      </div>
    </section>
    <TechnicalSurface
      variant="surface"
      depth="raised"
      radius="md"
      border="technical"
      className="flex min-h-12 shrink-0 items-center justify-between gap-3 px-4 py-2"
    >
      <span className="text-text-muted text-xs font-semibold uppercase tracking-[0.16em]">
        Transport
      </span>
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          disabled={state === 'loading'}
          aria-label={state === 'loading' ? 'Loading transport' : 'Play preview'}
        >
          {state === 'loading' ? 'Loading' : 'Play'}
        </Button>
        <span className="text-text-muted text-xs">0:11 / 0:38</span>
      </div>
      <span className="text-text-muted text-xs">100%</span>
    </TechnicalSurface>
    <section className="mt-3 h-[clamp(10rem,22vh,18rem)] min-h-40 shrink-0 overflow-auto border-t border-border-technical bg-surface-dark">
      <div className="border-border-technical bg-surface-dark sticky top-0 z-10 flex min-h-10 items-center justify-between gap-3 border-b px-3 py-2 text-xs text-text-muted">
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="ghost" size="sm">
            Play
          </Button>
          <span>0:11 / 0:38</span>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span>Timeline</span>
          <span>44%</span>
          <Button variant="ghost" size="sm">
            Expand
          </Button>
        </div>
      </div>
      <div
        tabIndex={0}
        aria-label="Timeline tracks"
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {regions.timeline}
      </div>
    </section>
  </div>
);

export default function CompositionShowcasePage() {
  const [recipe, setRecipe] = useState<RecipeName>(() => {
    if (typeof window === 'undefined') return 'SuiteOverview';
    const requestedRecipe = new URLSearchParams(window.location.search).get('recipe');
    return requestedRecipe && requestedRecipe in FIXTURES
      ? (requestedRecipe as RecipeName)
      : 'SuiteOverview';
  });
  const [state, setState] = useState<ShowcaseState>('ready');
  const [contextMode, setContextMode] = useState<GlobalContextPanelMode | null>(null);
  const [navMode, setNavMode] = useState<'expanded' | 'rail' | 'hover'>('expanded');
  const [isModuleContextPanelOpen, setIsModuleContextPanelOpen] = useState(true);
  const [isSplitContextSidebarOpen, setIsSplitContextSidebarOpen] = useState(true);
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
  const [activeOrganizationId, setActiveOrganizationId] = useState(SHOWCASE_ORGANIZATIONS[0].id);
  const [themeMode, setThemeMode] = useState<ShowcaseTheme>(() => {
    if (typeof window === 'undefined') return 'light';
    return window.localStorage.getItem('showcase-theme') === 'dark' ? 'dark' : 'light';
  });
  const router = useRouter();
  const composition = FIXTURES[recipe];
  const activeOrganization = SHOWCASE_ORGANIZATIONS.find(({ id }) => id === activeOrganizationId);

  useEffect(() => {
    window.localStorage.setItem('showcase-theme', themeMode);
    emitShowcaseEvent('theme', { theme: themeMode });
  }, [themeMode]);

  useEffect(() => {
    const mark = `composition-showcase:${recipe}`;
    performance.mark(`${mark}:start`);
    emitShowcaseEvent('view', { recipe, state });
    return () => {
      performance.mark(`${mark}:end`);
      performance.measure(mark, `${mark}:start`, `${mark}:end`);
    };
  }, [recipe, state]);

  useEffect(() => {
    const themeClass = activeOrganization?.theme;
    if (!themeClass) return;

    const root = document.documentElement;
    const previousValues = new Map(
      SHOWCASE_THEME_VARIABLES.map((variable) => [variable, root.style.getPropertyValue(variable)]),
    );
    const probe = document.createElement('div');
    probe.className = themeClass;
    document.body.appendChild(probe);
    const themeStyles = getComputedStyle(probe);

    root.classList.add(themeClass);
    SHOWCASE_THEME_VARIABLES.forEach((variable) => {
      const value = themeStyles.getPropertyValue(variable).trim();
      if (value) root.style.setProperty(variable, value);
    });
    probe.remove();

    return () => {
      root.classList.remove(themeClass);
      previousValues.forEach((value, variable) => {
        if (value) root.style.setProperty(variable, value);
        else root.style.removeProperty(variable);
      });
    };
  }, [activeOrganization?.theme]);
  const regions = useMemo(
    () =>
      Object.fromEntries(
        composition.regions
          .filter(
            (region) =>
              !(recipe === 'SplitWorkspace' && region.slot === 'toolbar') &&
              !(
                recipe === 'CreativeEditor' && ['asset-sidebar', 'inspector'].includes(region.slot)
              ),
          )
          .map((region) => [
            region.id,
            <TechnicalSurface
              key={region.id}
              variant={
                recipe === 'CreativeEditor' || region.component === 'TechnicalCanvas'
                  ? 'canvas'
                  : 'surface'
              }
              depth={
                recipe === 'RecordWorkspace' && region.component === 'Inspector'
                  ? 'raised'
                  : region.id === 'transport'
                    ? 'overlay'
                    : 'flat'
              }
              radius={
                recipe === 'CreativeEditor' ? (region.id === 'transport' ? 'md' : 'none') : 'md'
              }
              border={region.id === 'transport' ? 'strong' : 'technical'}
              borderWidth={region.id === 'transport' ? 'medium' : 'thin'}
              className={`${regionClass(region.component, recipe)} ${
                recipe === 'CreativeEditor'
                  ? region.id === 'transport'
                    ? 'px-3 py-2'
                    : region.id === 'timeline'
                      ? 'border-t px-4 py-3'
                      : 'border-0 bg-transparent'
                  : ''
              } ${state === 'forbidden' ? 'opacity-60' : ''}`}
            >
              {region.component === 'TechnicalCanvas' && (
                <TechnicalCanvas variant="blueprint" intensity="medium" size={40} showSubgrid />
              )}
              <div className="flex h-full min-h-[inherit] flex-col justify-between gap-3 p-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
                  {region.slot}
                </span>
                {state === 'loading' ? (
                  <LoadingState label={`Loading ${region.slot}`} lines={2} />
                ) : null}
                {state === 'empty' ? (
                  <EmptyState
                    variant="ghost"
                    size="sm"
                    icon="inbox"
                    title="Nothing here yet"
                    description="Create or connect content to populate this region."
                    action={
                      <Button variant="primary" size="sm">
                        Create item
                      </Button>
                    }
                  />
                ) : null}
                {state === 'error' ? (
                  <EmptyState
                    variant="ghost"
                    size="sm"
                    icon="error"
                    title="Unable to load"
                    description="The region could not be loaded."
                    action={
                      <Button variant="danger" size="sm">
                        Retry
                      </Button>
                    }
                  />
                ) : null}
                {state === 'forbidden' ? (
                  <EmptyState
                    variant="ghost"
                    size="sm"
                    icon="lock"
                    title="Access restricted"
                    description="Your current role cannot view this region."
                    action={
                      <Button variant="outline" size="sm">
                        Request access
                      </Button>
                    }
                  />
                ) : null}
                {!['loading', 'empty', 'error', 'forbidden'].includes(state) ? (
                  <>
                    <strong className="text-sm text-text-main">{region.component}</strong>
                    {state === 'read-only' && (
                      <span className="text-xs text-text-muted">
                        Read-only view · actions disabled
                      </span>
                    )}
                    {state === 'offline' && (
                      <span className="border-danger/40 bg-danger/10 text-danger rounded-md border px-2 py-1 text-xs">
                        Offline · showing cached data
                      </span>
                    )}
                    {state === 'stale' && (
                      <span className="border-accent/40 bg-accent/10 text-accent rounded-md border px-2 py-1 text-xs">
                        Stale · refresh before acting
                      </span>
                    )}
                    {state === 'conflict' && (
                      <Button variant="danger" size="sm">
                        Resolve conflict
                      </Button>
                    )}
                  </>
                ) : null}
              </div>
            </TechnicalSurface>,
          ]),
      ),
    [composition, recipe, state],
  );

  return (
    <div
      className={`${activeOrganization?.theme ?? ''} ${themeMode === 'dark' ? 'dark' : ''} h-full`}
      data-showcase-theme={themeMode}
    >
      <SuiteRuntime
        config={{ ...SHOWCASE_SUITE_CONFIG, navMode }}
        activeModuleId={recipe}
        moduleContextRenderers={{
          SplitWorkspace: () =>
            resolveShowcaseZoneRenderer(
              RECIPE_SHELL_USAGE.SplitWorkspace?.moduleContextSidebar?.contentKey,
            )?.(),
          CreativeEditor: () =>
            resolveShowcaseZoneRenderer(
              RECIPE_SHELL_USAGE.CreativeEditor?.moduleContextSidebar?.contentKey,
            )?.(),
        }}
        moduleContextFooterRenderers={{
          SplitWorkspace: () =>
            resolveShowcaseZoneFooterRenderer(
              RECIPE_SHELL_USAGE.SplitWorkspace?.moduleContextSidebar?.footer?.contentKey,
            )?.(),
          CreativeEditor: () =>
            resolveShowcaseZoneFooterRenderer(
              RECIPE_SHELL_USAGE.CreativeEditor?.moduleContextSidebar?.footer?.contentKey,
            )?.(),
        }}
        moduleContextPanelRenderers={{
          SplitWorkspace: () =>
            isModuleContextPanelOpen
              ? resolveShowcaseZonePanelRenderer(
                  RECIPE_SHELL_USAGE.SplitWorkspace?.moduleContextPanel?.contentKey,
                )?.()
              : null,
          CreativeEditor: () =>
            isModuleContextPanelOpen
              ? resolveShowcaseZonePanelRenderer(
                  RECIPE_SHELL_USAGE.CreativeEditor?.moduleContextPanel?.contentKey,
                )?.()
              : null,
        }}
        moduleContextPanelFooterRenderers={{
          SplitWorkspace: () =>
            resolveShowcaseZoneFooterRenderer(
              RECIPE_SHELL_USAGE.SplitWorkspace?.moduleContextPanel?.footer?.contentKey,
            )?.(),
          CreativeEditor: () =>
            resolveShowcaseZoneFooterRenderer(
              RECIPE_SHELL_USAGE.CreativeEditor?.moduleContextPanel?.footer?.contentKey,
            )?.(),
        }}
        moduleContextPanelOnClose={() => setIsModuleContextPanelOpen(false)}
        moduleContextSidebarCollapsed={
          recipe === 'CreativeEditor'
            ? !isMediaLibraryOpen
            : recipe === 'SplitWorkspace'
              ? !isSplitContextSidebarOpen
              : undefined
        }
        moduleContextSidebarShowCollapsedTrigger={
          recipe !== 'CreativeEditor' && recipe !== 'SplitWorkspace'
        }
        moduleContextSidebarOnCollapsedChange={(collapsed) => {
          if (recipe === 'CreativeEditor') setIsMediaLibraryOpen(!collapsed);
          if (recipe === 'SplitWorkspace') setIsSplitContextSidebarOpen(!collapsed);
        }}
        contextualSidebarAction={(isRail) =>
          (recipe === 'CreativeEditor' && !isMediaLibraryOpen) ||
          (recipe === 'SplitWorkspace' && !isSplitContextSidebarOpen) ? (
            <Button
              variant="energy"
              size="sm"
              startIcon="menu"
              aria-label={
                recipe === 'CreativeEditor' ? 'Open Media Library' : 'Open selection context'
              }
              onClick={() => {
                if (recipe === 'CreativeEditor') setIsMediaLibraryOpen(true);
                if (recipe === 'SplitWorkspace') setIsSplitContextSidebarOpen(true);
              }}
              className="min-w-0 hover:bg-primary hover:text-white"
            >
              {!isRail ? (
                <span className="truncate">
                  {recipe === 'CreativeEditor'
                    ? RECIPE_SHELL_USAGE.CreativeEditor?.contextualAction?.label
                    : 'Open selection context'}
                </span>
              ) : null}
            </Button>
          ) : null
        }
        canvasProps={{
          mode: RECIPE_CANVAS_MODES[recipe],
          header: recipe === 'SplitWorkspace' ? <SplitRecipeHeader /> : undefined,
          toolbar: recipe === 'SplitWorkspace' ? <SplitRecipeToolbar /> : undefined,
        }}
        onNavModeChange={setNavMode}
        onNavigate={(route) => {
          const selectedRecipe = new URL(route.routeId, window.location.origin).searchParams.get(
            'recipe',
          );
          if (selectedRecipe && selectedRecipe in FIXTURES) {
            emitShowcaseEvent('navigation', { recipe: selectedRecipe, fallback: false });
            setRecipe(selectedRecipe);
            router.push(route.routeId);
            return;
          }
          emitShowcaseEvent('navigation', { recipe: 'SuiteOverview', fallback: true });
          setRecipe('SuiteOverview');
          router.push('/composition-showcase?recipe=SuiteOverview');
        }}
        leftSlot={
          <div className="flex min-w-0 items-center gap-3">
            <BrandLogo variant="isotype" size="sm" className="shrink-0" />
          </div>
        }
        centerSlot={<CommandBarTrigger className="w-full" onOpen={() => undefined} />}
        platformHeaderProps={{
          contextSlot: (
            <div className="flex min-w-0 items-center gap-2">
              <OrganizationSwitcher
                organizations={SHOWCASE_ORGANIZATIONS}
                activeOrganizationId={activeOrganization?.id}
                onOrganizationNavigate={() => router.push('/launchpad')}
                onOrganizationChange={setActiveOrganizationId}
                onAllOrganizations={() => undefined}
                onCreateOrganization={() => undefined}
              />
              <span className="text-primary px-1 text-xs font-normal" aria-hidden="true">
                |
              </span>
              <SuiteSwitcher
                currentSuite={MARKETING_STUDIO_SCHEMA.suite}
                availableSuites={AVAILABLE_SUITES_FIXTURES}
                showIcon={false}
                onSuiteChange={(suiteId) => {
                  const suite = AVAILABLE_SUITES_FIXTURES.find((item) => item.suiteId === suiteId);
                  router.push(suite?.route?.routeId ?? '/launchpad');
                }}
              />
            </div>
          ),
        }}
        rightSlot={
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              aria-label={`Switch to ${themeMode === 'dark' ? 'light' : 'dark'} theme`}
              onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
            >
              {themeMode === 'dark' ? 'Light' : 'Dark'}
            </Button>
            <PlatformHeaderControls
              notifications={NOTIFICATION_CENTER_FIXTURES.recent}
              unreadCount={NOTIFICATION_CENTER_FIXTURES.recent.filter(({ read }) => !read).length}
              activeContext={contextMode}
              onOpenNotifications={() => setContextMode('notifications')}
              onOpenHelp={() => setContextMode('help')}
              onOpenAI={() => setContextMode('assistant')}
            />
          </div>
        }
        profileSlot={
          <UserMenu
            userName="Alex Morgan"
            userEmail="showcase@loopdev.local"
            userRole="Tenant_Admin"
            tenantName="Showcase Workspace"
            userSrc="https://i.pravatar.cc/64?img=12"
            timezoneOptions={[{ label: 'Auto detect', isActive: true }]}
            onOpenChange={() => undefined}
            onLogout={() => undefined}
          />
        }
        appShellProps={{ config: { activeOverlay: contextMode ? 'context' : null } }}
      >
        <main
          className={`h-full min-h-0 ${recipe === 'CreativeEditor' ? 'overflow-hidden' : 'overflow-y-auto overflow-x-hidden'} bg-shell-canvas text-text-main ${recipe === 'CreativeEditor' ? '' : 'p-3 sm:p-5'}`}
        >
          <section className={recipe === 'CreativeEditor' ? 'h-full min-h-0' : 'mx-auto max-w-7xl'}>
            {recipe !== 'CreativeEditor' ? (
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="font-mono text-xs uppercase tracking-[0.16em]">
                    {composition.recipe}
                  </h1>
                  <span className="text-xs text-text-muted">
                    {composition.grid.columns} columns / {composition.grid.gap} gap
                  </span>
                </div>
                <label className="flex items-center gap-2 text-xs text-text-muted">
                  <span>Review state</span>
                  <select
                    value={state}
                    onChange={(event) => setState(event.target.value as ShowcaseState)}
                    className="rounded-md border border-border-technical bg-shell-canvas px-2 py-1.5 text-text-main"
                  >
                    {STATES.map((nextState) => (
                      <option key={nextState} value={nextState}>
                        {nextState}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            ) : null}
            {recipe === 'CreativeEditor' ? (
              <CreativeEditorCanvas regions={regions} state={state} />
            ) : recipe === 'SuiteOverview' ? (
              <SuiteOverviewCanvas state={state} composition={composition} />
            ) : recipe === 'DataWorkspace' ? (
              <DataWorkspaceCanvas state={state} />
            ) : recipe === 'RecordWorkspace' ? (
              <RecordWorkspaceCanvas state={state} />
            ) : recipe === 'BoardWorkspace' ? (
              <BoardWorkspaceCanvas state={state} />
            ) : recipe === 'SplitWorkspace' ? (
              <SplitWorkspaceCanvas state={state} />
            ) : recipe === 'ImmersiveWorkflow' ? (
              <ImmersiveWorkflowCanvas state={state} />
            ) : (
              <div className="overflow-x-auto">
                <div className="min-w-[20rem] sm:min-w-0">
                  <CompositionGrid composition={composition} regions={regions} />
                </div>
              </div>
            )}
          </section>
        </main>
      </SuiteRuntime>
      {contextMode && (
        <div className="fixed bottom-0 right-0 top-[var(--lpd-space-14)] z-50 w-[min(400px,100vw)] shadow-2xl">
          <GlobalContextPanel
            mode={contextMode}
            notifications={NOTIFICATION_CENTER_FIXTURES.recent}
            unreadCount={NOTIFICATION_CENTER_FIXTURES.recent.filter(({ read }) => !read).length}
            onClose={() => setContextMode(null)}
          />
        </div>
      )}
    </div>
  );
}
