'use client';

import { useEffect, useState } from 'react';

import {
  BrandLogo,
  CommandBarTrigger,
  NOTIFICATION_CENTER_FIXTURES,
  OrganizationSwitcher,
  SuiteSwitcher,
  UserMenu,
  SHELL_SHOWCASE_SUITES_FIXTURES,
  GlobalContextPanel,
  MARKETING_STUDIO_SCHEMA,
  SuiteRuntime,
  Button,
  Heading,
  ModuleHeader,
  ModuleToolbar,
  type GlobalContextPanelMode,
} from '@loopdev/ui';
import type { NavigationSchema, SuiteConfig } from '@loopdev/contracts';
import { themes } from '@loopdev/tokens';
import { PlatformHeaderControls } from '@/components/layout/PlatformHeaderControls';
import { useRouter } from 'next/navigation';
import { Menu } from 'lucide-react';

type ShowcaseNavMode = 'expanded' | 'rail' | 'hover';
type CanvasMode = 'overview' | 'data' | 'workspace' | 'split' | 'board' | 'full-bleed';

const CANVAS_MODES: Array<{ id: CanvasMode; label: string; description: string }> = [
  {
    id: 'overview',
    label: 'Overview',
    description: 'SuiteHome and summary blocks',
  },
  {
    id: 'data',
    label: 'Data',
    description: 'Filters, views, table and pagination',
  },
  {
    id: 'workspace',
    label: 'Workspace',
    description: 'Local navigation, tabs and results',
  },
  {
    id: 'split',
    label: 'Split',
    description: 'ModuleContextSidebar with SuiteCanvas',
  },
  {
    id: 'board',
    label: 'Board',
    description: 'Columns, cards and horizontal flow',
  },
  {
    id: 'full-bleed',
    label: 'Full-bleed',
    description: 'Immersive visualisation surface',
  },
];

const isCanvasMode = (value: string | null): value is CanvasMode =>
  value !== null && CANVAS_MODES.some((mode) => mode.id === value);

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

const SHOWCASE_SUITE = {
  ...MARKETING_STUDIO_SCHEMA.suite,
  suiteId: 'shell-showcase',
  suiteName: 'Shell Showcase',
  route: { routeId: '/shell-showcase' },
};

const SHOWCASE_NAVIGATION: NavigationSchema = {
  version: '1.0',
  suite: SHOWCASE_SUITE,
  exitHatch: MARKETING_STUDIO_SCHEMA.exitHatch,
  groups: [
    {
      id: 'canvas-modes',
      label: 'Canvas modes',
      priority: 1,
      items: CANVAS_MODES.map((mode, index) => ({
        id: `canvas.${mode.id}`,
        kind: 'module' as const,
        moduleId: mode.id,
        label: mode.label,
        icon:
          mode.id === 'overview'
            ? 'LayoutDashboard'
            : mode.id === 'data'
              ? 'Table2'
              : mode.id === 'workspace'
                ? 'PanelsTopLeft'
                : mode.id === 'split'
                  ? 'Columns3'
                  : mode.id === 'board'
                    ? 'KanbanSquare'
                    : 'Maximize2',
        priority: index + 1,
        route: { routeId: `/shell-showcase?canvasMode=${mode.id}` },
      })),
    },
  ],
};

const SHOWCASE_SUITE_CONFIG: SuiteConfig = {
  identity: SHOWCASE_SUITE,
  navigation: SHOWCASE_NAVIGATION,
  accessMap: {},
  modules: CANVAS_MODES.map((mode) => ({
    moduleId: mode.id,
    label: mode.label,
    route: `/shell-showcase?canvasMode=${mode.id}`,
    breadcrumbs: ['Shell Showcase', mode.label],
    capabilities: mode.id === 'data' ? ['sidebar', 'toolbar'] : ['sidebar'],
    shell:
      mode.id === 'split'
        ? {
            canvasMode: 'split',
            moduleContextSidebar: {
              label: 'ModuleContextSidebar',
              collapsible: true,
              collapsedPresentation: 'trigger',
              collapseIcon: 'menu',
              expandIcon: 'menu',
            },
            moduleContextPanel: {
              label: 'ModuleContextPanel',
            },
          }
        : undefined,
  })),
};

function CanvasFixture({ mode }: { mode: CanvasMode }) {
  if (mode === 'data') {
    return (
      <div className="text-lpd-sm flex min-h-full flex-col gap-4 p-4 font-sans leading-normal sm:p-6 lg:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-text-muted text-lpd-xs font-semibold uppercase leading-tight tracking-[0.18em]">
              {'{DataFixture}'}
            </p>
            <Heading as="h2" size="xl" weight="semibold" className="text-text-main mt-1 leading-tight">
              Resource directory
            </Heading>
          </div>
          <span className="border-border-technical bg-shell-canvas text-text-muted text-lpd-xs rounded-md border px-3 py-1.5 leading-tight">
            128 records
          </span>
        </div>
        <div className="border-border-technical bg-background flex flex-wrap gap-3 rounded-lg border p-3">
          <div className="bg-shell-canvas text-text-muted text-lpd-sm min-w-44 rounded-md border px-3 py-2 leading-normal">
            Search resources
          </div>
          <Button variant="primary" size="sm">Filter</Button>
          <Button variant="outline" size="sm">
            Export
          </Button>
        </div>
        <div className="border-border-technical bg-background overflow-hidden rounded-lg border">
          <div className="border-border-technical text-text-muted text-lpd-xs grid grid-cols-3 gap-4 border-b px-4 py-3 font-medium uppercase leading-tight tracking-wide">
            <span>Name</span>
            <span>Status</span>
            <span>Updated</span>
          </div>
          {['Northstar workspace', 'Launch sequence', 'Shared resources'].map((name, index) => (
            <div
              key={name}
              className="border-border-technical text-text-main text-lpd-sm grid grid-cols-3 gap-4 border-b px-4 py-3 leading-normal last:border-b-0"
            >
              <span>{name}</span>
              <span className="text-text-muted">{index === 1 ? 'Review' : 'Ready'}</span>
              <span className="text-text-muted">Today, 09:{index + 2}0</span>
            </div>
          ))}
        </div>
        <div className="text-text-muted text-lpd-xs flex flex-wrap items-center justify-between gap-3 leading-tight">
          <span>Showing 1-3 of 128</span>
          <div className="flex gap-1" aria-label="Pagination">
            {['Previous', '1', '2', 'Next'].map((item) => (
              <Button key={item} variant="outline" size="sm">
                {item}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'workspace') {
    return (
      <div className="text-lpd-sm flex min-h-full flex-col font-sans leading-normal">
          <div className="border-border-technical flex items-center gap-1 overflow-x-auto px-3 pt-2">
          {['Untitled query', 'Resource audit', 'New document'].map((tab, index) => (
            <Button
              key={tab}
              variant="ghost"
              size="sm"
              className={`whitespace-nowrap !rounded-none border-b-[2px] px-4 ${index === 0 ? 'border-primary bg-background text-text-main' : 'text-text-muted border-transparent'}`}
            >
              {tab}
            </Button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="text-lpd-lg !rounded-none px-3 leading-none"
            aria-label="Create workspace tab"
          >
            +
          </Button>
        </div>
        <div className="text-lpd-sm flex flex-1 flex-col gap-4 p-4 font-sans leading-normal sm:p-6 lg:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-text-muted text-lpd-xs font-semibold uppercase leading-tight tracking-[0.18em]">
                {'{WorkspaceFixture}'}
              </p>
              <Heading as="h2" size="xl" weight="semibold" className="text-text-main mt-1 leading-tight">
                Document workspace
              </Heading>
            </div>
            <Button variant="primary" size="sm">Run action</Button>
          </div>
          <div className="border-border-technical bg-background text-lpd-sm flex min-h-48 flex-1 items-center justify-center rounded-lg border font-mono leading-normal">
            <span className="text-text-muted">{'// Main workspace content'}</span>
          </div>
          <div className="border-border-technical text-lpd-sm flex items-center gap-4 border-t pt-3 leading-normal">
            <Button
              variant="ghost"
              size="sm"
              className="border-primary text-primary !rounded-none border-b-[2px] pb-2"
            >
              Results
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-text-muted !rounded-none border-b-[2px] border-transparent pb-2"
            >
              Chart
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'split') {
    return <SplitModuleFixture />;
  }

  if (mode === 'board') {
    return (
      <div className="text-lpd-sm flex min-h-full flex-col gap-4 p-4 font-sans leading-normal sm:p-6 lg:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-text-muted text-lpd-xs font-semibold uppercase leading-tight tracking-[0.18em]">
              {'{BoardFixture}'}
            </p>
            <Heading as="h2" size="xl" weight="semibold" className="text-text-main mt-1 leading-tight">
              Work queue
            </Heading>
          </div>
          <Button variant="primary" size="sm">Add card</Button>
        </div>
        <div className="flex min-w-0 gap-4 overflow-x-auto pb-2">
          {[
            ['Queued', ['Prepare brief', 'Review access']],
            ['In progress', ['Build fixture', 'Check responsive']],
            ['Complete', ['Approve mode']],
          ].map(([column, cards]) => (
            <section
              key={column as string}
              className="border-border-technical bg-background min-w-64 flex-1 rounded-lg border p-3"
            >
              <Heading as="h2" size="sm" weight="semibold" className="text-text-main leading-normal">{column}</Heading>
              <div className="mt-3 space-y-2">
                {(cards as string[]).map((card) => (
                  <div
                    key={card}
                    className="border-border-technical bg-shell-canvas text-lpd-sm rounded-md border p-3 leading-normal"
                  >
                    <p className="text-text-main">{card}</p>
                    <p className="text-text-muted text-lpd-xs mt-2 leading-tight">
                      Neutral fixture card
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    );
  }

  if (mode === 'full-bleed') {
    return (
      <div className="bg-shell-canvas text-lpd-sm relative min-h-full overflow-hidden font-sans leading-normal">
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,var(--lpd-color-border-technical)_1px,transparent_1px),linear-gradient(to_bottom,var(--lpd-color-border-technical)_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="relative flex min-h-[28rem] flex-col justify-between p-4 sm:p-6 lg:p-8">
          <div>
            <p className="text-text-muted text-lpd-xs font-semibold uppercase leading-tight tracking-[0.18em]">
              {'{FullBleedFixture}'}
            </p>
            <Heading as="h2" size="xl" weight="semibold" className="text-text-main mt-1 leading-tight">
              Immersive canvas
            </Heading>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Zoom in', 'Zoom out', 'Reset view'].map((action) => (
              <Button key={action} variant="outline" size="sm">
                {action}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-lpd-sm flex min-h-full flex-col gap-6 p-4 font-sans leading-normal sm:p-6 lg:p-8">
      <div>
        <p className="text-text-muted text-lpd-xs font-semibold uppercase leading-tight tracking-[0.18em]">
          {'{OverviewFixture}'}
        </p>
        <Heading as="h2" size="xl" weight="semibold" className="text-text-main mt-1 leading-tight">
          SuiteHome canvas
        </Heading>
        <p className="text-text-muted text-lpd-sm mt-2 max-w-2xl leading-normal">
          A neutral overview surface for summary blocks, activity and suite actions.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          ['System status', 'All services operational'],
          ['Active resources', '24 resources in scope'],
          ['Recent activity', '8 updates this week'],
        ].map(([label, value]) => (
          <div key={label} className="border-border-technical bg-background rounded-lg border p-5">
            <p className="text-text-muted text-lpd-xs font-semibold uppercase leading-tight tracking-wide">
              {label}
            </p>
            <p className="text-text-main text-lpd-lg mt-3 font-semibold leading-tight">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ModuleContextFixture() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <p className="text-primary text-lpd-xs leading-tight tracking-[0.18em]">{'{Content}'}</p>
      <p className="text-text-muted text-lpd-sm leading-normal">
        Context content for the active module.
      </p>
    </div>
  );
}

function ModuleContextFooterFixture() {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-primary text-lpd-xs leading-tight tracking-[0.18em]">{'{Footer}'}</p>
      <Button variant="outline" size="sm" className="w-full justify-start">
        View details
      </Button>
      <Button variant="outline" size="sm" className="w-full justify-start">
        Manage access
      </Button>
    </div>
  );
}

function ModuleContextPanelFixture() {
  return (
    <div className="flex flex-col gap-4 p-4 text-xs">
      <div>
        <p className="text-text-muted uppercase tracking-wide">Selected user</p>
        <p className="text-text-main mt-2 text-sm font-semibold">admin@localhost.com</p>
      </div>
      <dl className="border-border-technical divide-border-technical divide-y rounded-md border">
        {[
          ['User ID', '07b3b75e-58d8-4d8c-900b-8be98150375f'],
          ['Created at', '04 Aug 2026 12:23'],
          ['Updated at', '12 Aug 2026 00:29'],
          ['Last signed in', '07 Aug 2026 09:15'],
        ].map(([label, value]) => (
          <div key={label} className="px-3 py-2">
            <dt className="text-text-muted">{label}</dt>
            <dd className="text-text-main mt-1 break-all">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function ModuleContextPanelFooterFixture() {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-primary text-lpd-xs leading-tight tracking-[0.18em]">{'{Footer}'}</p>
      <Button variant="primary" size="sm" className="w-full justify-start">
        Apply changes
      </Button>
    </div>
  );
}

function SplitModuleFixture() {
  return (
    <div className="bg-background min-h-full min-w-0 overflow-auto p-4 sm:p-6">
          <p className="text-primary text-lpd-xs font-semibold leading-tight tracking-[0.18em]">
            {'{SuiteCanvas}'}
          </p>
          <Heading as="h2" size="xl" weight="semibold" className="text-text-main mt-1 leading-tight">Users</Heading>
          <div className="border-border-technical mt-5 overflow-hidden rounded-lg border">
            <div className="border-border-technical text-text-muted grid min-w-[62rem] grid-cols-[2rem_minmax(12rem,1fr)_minmax(10rem,1fr)_minmax(12rem,1fr)_7rem_8rem_9rem] gap-4 border-b px-4 py-3 text-xs font-semibold uppercase tracking-wide">
              <span aria-label="Select" />
              <span>Email</span>
              <span>UID</span>
              <span>Display name</span>
              <span>Phone</span>
              <span>Role</span>
              <span>Last sign in</span>
            </div>
            {[
              'admin@localhost.com',
              'editor@localhost.com',
              'minoveaz@hotmail.com',
              'superdev@loopdev.io',
              'test@loopdev.dev',
              'test2@test.com',
              'viewer@localhost.com',
            ].map((email) => (
                <div
                  key={email}
                  className="border-border-technical text-text-main grid min-w-[62rem] grid-cols-[2rem_minmax(12rem,1fr)_minmax(10rem,1fr)_minmax(12rem,1fr)_7rem_8rem_9rem] gap-4 border-b px-4 py-3 text-sm last:border-b-0"
                >
                  <span className="text-text-muted">□</span>
                  <span>{email}</span>
                  <span className="text-text-muted">07b3b75e...</span>
                  <span className="text-text-muted">-</span>
                  <span className="text-text-muted">-</span>
                  <span className="text-text-muted">Member</span>
                  <span className="text-text-muted">Today</span>
                </div>
            ))}
          </div>
    </div>
  );
}

function SplitModuleHeader() {
  return (
    <ModuleHeader
      segments={[
        { id: 'suite', label: 'Shell Showcase' },
        { id: 'module', label: 'Users', isActive: true },
      ]}
      statusLabel="Active"
      statusSeverity="success"
      rightSlot={
        <div className="flex items-center gap-3">
          <span className="text-primary text-lpd-xs font-mono tracking-[0.16em]">{'{SuiteHeader}'}</span>
          <Button variant="outline" size="sm">
            Module action
          </Button>
        </div>
      }
    />
  );
}

function SplitModuleToolbar() {
  return (
    <ModuleToolbar
      left={
        <div className="border-border-technical bg-background text-text-muted flex items-center gap-2 rounded-md border px-3 py-1.5">
          <span aria-hidden="true">⌕</span>
          <span>Search users</span>
        </div>
      }
      center={
        <div className="text-text-muted flex items-center gap-3 text-xs">
          <span className="text-primary font-mono text-[10px] tracking-[0.16em]">{'{SuiteToolbar}'}</span>
          <Button variant="ghost" size="sm">
            All columns
          </Button>
          <Button variant="ghost" size="sm">
            Sorted by user ID
          </Button>
        </div>
      }
      right={<Button variant="primary" size="sm">Add user</Button>}
    />
  );
}

function ModeModuleHeader({ mode }: { mode: CanvasMode }) {
  if (mode === 'full-bleed') return undefined;
  if (mode === 'split') return <SplitModuleHeader />;

  const fixtures: Record<Exclude<CanvasMode, 'split'>, { label: string; action: string }> = {
    overview: { label: 'Overview', action: 'Customize overview' },
    data: { label: 'Resource directory', action: 'Export data' },
    workspace: { label: 'Document workspace', action: 'Run action' },
    board: { label: 'Operations board', action: 'Add card' },
    'full-bleed': { label: 'Immersive workflow', action: 'Start workflow' },
  };
  const fixture = fixtures[mode];

  return (
    <ModuleHeader
      segments={[
        { id: 'suite', label: 'Shell Showcase' },
        { id: 'mode', label: fixture.label, isActive: true },
      ]}
      statusLabel="Reference"
      statusSeverity="success"
      rightSlot={<Button variant="outline" size="sm">{fixture.action}</Button>}
    />
  );
}

function ModeModuleToolbar({ mode }: { mode: CanvasMode }) {
  if (mode === 'full-bleed') return undefined;
  if (mode === 'split') return <SplitModuleToolbar />;

  const fixtures: Record<Exclude<CanvasMode, 'split'>, { left: string; center: string; action: string }> = {
    overview: { left: 'Period: This week', center: 'Dashboard filters', action: 'Refresh' },
    data: { left: 'Search resources', center: 'All columns', action: 'Filter' },
    workspace: { left: 'Active document', center: 'Results / Chart', action: 'Save' },
    board: { left: 'All stages', center: 'Group by status', action: 'New card' },
    'full-bleed': { left: 'Workflow: Draft', center: 'Timeline controls', action: 'Preview' },
  };
  const fixture = fixtures[mode];

  return (
    <ModuleToolbar
      left={<span className="border-border-technical bg-background text-text-muted rounded-md border px-3 py-1.5 text-xs">{fixture.left}</span>}
      center={<span className="text-text-muted text-xs">{fixture.center}</span>}
      right={<Button variant="primary" size="sm">{fixture.action}</Button>}
    />
  );
}

function ShowcaseCanvas({ mode }: { mode: CanvasMode }) {
  return (
    <div className="bg-shell-canvas text-lpd-sm h-full min-h-full font-sans leading-normal">
      <p className="text-primary px-4 pt-4 font-mono text-[10px] tracking-[0.16em]">{'{SuiteCanvas}'}</p>
      <CanvasFixture mode={mode} />
    </div>
  );
}

export default function ShellShowcasePage() {
  const [contextMode, setContextMode] = useState<GlobalContextPanelMode | null>(null);
  const [navMode, setNavMode] = useState<ShowcaseNavMode>('expanded');
  const [canvasMode, setCanvasMode] = useState<CanvasMode>('overview');
  const [isSplitPanelOpen, setIsSplitPanelOpen] = useState(true);
  const [isSplitContextOpen, setIsSplitContextOpen] = useState(true);
  const [activeOrganizationId, setActiveOrganizationId] = useState(SHOWCASE_ORGANIZATIONS[0].id);
  const router = useRouter();
  const currentSuite =
    SHELL_SHOWCASE_SUITES_FIXTURES.find((suite) => suite.suiteId === 'salesCRM') ??
    SHELL_SHOWCASE_SUITES_FIXTURES[0];
  const activeOrganization = SHOWCASE_ORGANIZATIONS.find(({ id }) => id === activeOrganizationId);

  useEffect(() => {
    const syncCanvasMode = () => {
      const requestedMode = new URLSearchParams(window.location.search).get('canvasMode');
      setCanvasMode(isCanvasMode(requestedMode) ? requestedMode : 'overview');
    };

    syncCanvasMode();
    window.addEventListener('popstate', syncCanvasMode);
    return () => window.removeEventListener('popstate', syncCanvasMode);
  }, []);

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

  return (
    <div className={`${activeOrganization?.theme ?? ''} h-full`}>
      <SuiteRuntime
        config={{ ...SHOWCASE_SUITE_CONFIG, navMode }}
        activeModuleId={canvasMode === 'overview' ? undefined : canvasMode}
        moduleRenderers={Object.fromEntries(
          CANVAS_MODES.map((mode) => [mode.id, () => <ShowcaseCanvas mode={mode.id} />]),
        )}
        moduleContextRenderers={{ split: () => <ModuleContextFixture /> }}
        moduleContextFooterRenderers={{ split: () => <ModuleContextFooterFixture /> }}
        moduleContextLabels={{ split: 'ModuleContextSidebar' }}
        moduleContextWidths={{ split: 'standard' }}
        moduleContextPanelRenderers={{
          split: () => (isSplitPanelOpen ? <ModuleContextPanelFixture /> : null),
        }}
        moduleContextPanelFooterRenderers={{
          split: () => (isSplitPanelOpen ? <ModuleContextPanelFooterFixture /> : null),
        }}
        moduleContextPanelLabels={{ split: 'ModuleContextPanel' }}
        moduleContextPanelWidths={{ split: 'extra-wide' }}
        moduleContextPanelOnClose={() => setIsSplitPanelOpen(false)}
        moduleContextSidebarCollapsed={canvasMode === 'split' ? !isSplitContextOpen : undefined}
        moduleContextSidebarShowCollapsedTrigger={canvasMode !== 'split'}
        moduleContextSidebarOnCollapsedChange={(collapsed) => setIsSplitContextOpen(!collapsed)}
        contextualSidebarAction={(isRail) =>
          canvasMode === 'split' && !isSplitContextOpen ? (
            <button
              type="button"
              aria-label="Open module context"
              onClick={() => setIsSplitContextOpen(true)}
              className="text-accent border-accent/30 bg-accent/10 hover:bg-primary hover:text-white flex min-w-0 items-center gap-3 rounded-md border p-2 text-left text-xs font-semibold transition-colors"
            >
              <Menu aria-hidden="true" size={18} className="shrink-0" />
              {!isRail ? <span className="truncate">Open module context</span> : null}
            </button>
          ) : null
        }
        canvasProps={{
          mode: canvasMode,
          header: <ModeModuleHeader mode={canvasMode} />,
          toolbar: <ModeModuleToolbar mode={canvasMode} />,
        }}
        onNavModeChange={setNavMode}
        onNavigate={(route) => {
          const selectedMode = new URL(route.routeId, window.location.origin).searchParams.get(
            'canvasMode',
          );
          if (isCanvasMode(selectedMode)) {
            setCanvasMode(selectedMode);
            router.push(route.routeId);
            return;
          }

          if (new URL(route.routeId, window.location.origin).pathname === '/shell-showcase') {
            setCanvasMode('overview');
          }
          router.push(route.routeId);
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
                currentSuite={currentSuite}
                availableSuites={SHELL_SHOWCASE_SUITES_FIXTURES}
                showIcon={false}
                onSuiteChange={(suiteId) => {
                  if (suiteId === 'os.home') {
                    router.push('/launchpad');
                    return;
                  }

                  const suite = SHELL_SHOWCASE_SUITES_FIXTURES.find((item) => item.suiteId === suiteId);
                  router.push(suite?.route?.routeId ?? '/launchpad');
                }}
              />
            </div>
          ),
        }}
        rightSlot={
          <PlatformHeaderControls
            notifications={NOTIFICATION_CENTER_FIXTURES.recent}
            unreadCount={NOTIFICATION_CENTER_FIXTURES.recent.filter(({ read }) => !read).length}
            activeContext={contextMode}
            onOpenNotifications={() => setContextMode('notifications')}
            onOpenHelp={() => setContextMode('help')}
            onOpenAI={() => setContextMode('assistant')}
          />
        }
        profileSlot={
          <UserMenu
            userName="Alex Morgan"
            userEmail="showcase@loopdev.local"
            userRole="Tenant_Admin"
            tenantName="Showcase Workspace"
            userSrc="https://i.pravatar.cc/64?img=12"
            timezoneOptions={[
              { label: 'Auto detect', isActive: true },
              { label: '(UTC) Coordinated Universal Time' },
              { label: '(UTC-05:00) Eastern Time' },
            ]}
            onOpenChange={() => undefined}
            onLogout={() => undefined}
          />
        }
        appShellProps={{
          config: { activeOverlay: contextMode ? 'context' : null },
        }}
      >
        <ShowcaseCanvas mode="overview" />
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
