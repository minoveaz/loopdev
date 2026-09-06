'use client';

import { startTransition, useEffect, useMemo, useState, type ReactNode } from 'react';
import { CircleHelp } from 'lucide-react';
import {
  AVAILABLE_SUITES_FIXTURES,
  BOARD_WORKSPACE_COMPOSITION,
  BrandLogo,
  Button,
  Badge,
  CommandBarTrigger,
  CompositionGrid,
  CREATIVE_EDITOR_COMPOSITION,
  DATA_WORKSPACE_COMPOSITION,
  EmptyState,
  Heading,
  LoadingState,
  IMMERSIVE_WORKFLOW_COMPOSITION,
  MARKETING_STUDIO_SCHEMA,
  ModuleHeader,
  ModuleSearch,
  ModuleToolbar,
  NOTIFICATION_CENTER_FIXTURES,
  NavSidebarItem,
  OrganizationSwitcher,
  PageHeader,
  RECORD_WORKSPACE_COMPOSITION,
  DataTable,
  SectionHeader,
  SPLIT_WORKSPACE_COMPOSITION,
  SUITE_OVERVIEW_COMPOSITION,
  SuiteRuntime,
  SuiteSwitcher,
  TechnicalCanvas,
  TechnicalCard,
  TechnicalSurface,
  ThemeToggle,
  UserMenu,
  UserAvatar,
  SUITE_CANVAS_GEOMETRY_CLASSES,
  type PlatformContextPanelMode,
} from '@loopdev/ui';
import type { ViewComposition } from '@loopdev/contracts';
import type { ModuleShellUsage, NavigationSchema, SuiteConfig } from '@loopdev/contracts';
import { themes } from '@loopdev/tokens';
import { PlatformHeaderControls } from '@/components/layout/PlatformHeaderControls';
import { ContextPanelHost } from '@/components/layout/ContextPanelHost';
import {
  resolveShowcaseZonePanelRenderer,
  resolveShowcaseZoneFooterRenderer,
  resolveShowcaseZoneRenderer,
} from '@/suites/showcase/zoneRenderers';
import { usePathname, useRouter } from 'next/navigation';
import { TechnicalCanvasCertification } from './certification-lab/TechnicalCanvasCertification';
import { TechnicalSurfaceCertification } from './certification-lab/TechnicalSurfaceCertification';
import { TechnicalCardCertification } from './certification-lab/TechnicalCardCertification';
import { SearchInputCertification } from './certification-lab/SearchInputCertification';
import { LoopdevComponentsCatalog } from './certification-lab/LoopdevComponentsCatalog';
import { ResponsiveTableCertification } from './certification-lab/ResponsiveTableCertification';
import { SuiteCompositionPatternsCertification } from './certification-lab/SuiteCompositionPatternsCertification';
import { OperationalActionsCertification } from './certification-lab/OperationalActionsCertification';
import { DashboardSummaryCertification } from './certification-lab/DashboardSummaryCertification';
import { KanbanBoardCertification } from './certification-lab/KanbanBoardCertification';
import { InteractionFeedbackCertification } from './certification-lab/InteractionFeedbackCertification';
import { CRMPrimitivesCatalog } from './CRMPrimitivesCatalog';
import { DataTablesCatalog } from './DataTablesCatalog';
import type { ActivityRow } from '@/components/composites/data-tables/ActivityTable';

const isVisualCertification = process.env.NEXT_PUBLIC_VISUAL_CERTIFICATION === 'true';

const FIXTURES: Record<string, ViewComposition> = {
  SuiteOverview: SUITE_OVERVIEW_COMPOSITION,
  DataWorkspace: DATA_WORKSPACE_COMPOSITION,
  SplitWorkspace: SPLIT_WORKSPACE_COMPOSITION,
  RecordWorkspace: RECORD_WORKSPACE_COMPOSITION,
  BoardWorkspace: BOARD_WORKSPACE_COMPOSITION,
  ImmersiveWorkflow: IMMERSIVE_WORKFLOW_COMPOSITION,
  CreativeEditor: CREATIVE_EDITOR_COMPOSITION,
  CertificationLab: SPLIT_WORKSPACE_COMPOSITION,
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
type ShowcaseDataset =
  'default' | 'crm-contacts' | 'crm-leads' | 'crm-pipeline' | 'crm-customer-360';

const DATASET_LABELS: Record<ShowcaseDataset, string> = {
  default: 'Platform reference fixture',
  'crm-contacts': 'CRM fixture · Contacts',
  'crm-leads': 'CRM fixture · Leads',
  'crm-pipeline': 'CRM fixture · Pipeline',
  'crm-customer-360': 'CRM fixture · Customer 360',
};

const isShowcaseDataset = (value: string | null): value is ShowcaseDataset =>
  value !== null && value in DATASET_LABELS;

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
  CertificationLab: 'BadgeCheck',
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
const emitShowcaseEvent = (name: string, detail: Record<string, string | number | boolean>) => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(`loopdev:showcase:${name}`, { detail }));
};

const RECIPE_SHELL_USAGE: Partial<Record<RecipeName, ModuleShellUsage>> = {
  CertificationLab: {
    canvasMode: 'split',
    suiteHeader: { label: 'Component Certification Lab', contentKey: 'certification.header' },
    suiteToolbar: { label: 'Evidence', contentKey: 'certification.toolbar' },
    moduleContextSidebar: {
      label: 'Components',
      contentKey: 'certification.sidebar',
      width: 'standard',
      collapsible: true,
      collapseIcon: 'menu',
      expandIcon: 'menu',
    },
    moduleContextPanel: { label: 'Evidence', contentKey: 'certification.panel', width: 'standard' },
  },
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
    {
      id: 'crm-fixtures',
      label: 'CRM fixtures',
      priority: 2,
      items: [
        {
          id: 'composition.crm-contacts',
          kind: 'module' as const,
          moduleId: 'crm-contacts',
          label: 'Contacts fixture',
          icon: RECIPE_ICONS.SuiteOverview,
          priority: 1,
          route: { routeId: '/composition-showcase?recipe=SuiteOverview&dataset=crm-contacts' },
        },
      ],
    },
  ],
};

const SHOWCASE_SUITE_CONFIG: SuiteConfig = {
  identity: MARKETING_STUDIO_SCHEMA.suite,
  navigation: SHOWCASE_NAVIGATION,
  accessMap: {},
  modules: [
    ...RECIPE_NAMES.map((name) => ({
      moduleId: name,
      label: name,
      route: `/composition-showcase?recipe=${name}`,
      breadcrumbs: ['Composition Showcase', name],
      capabilities: (name === 'SplitWorkspace' ? ['sidebar', 'toolbar'] : ['sidebar']) as (
        'sidebar' | 'toolbar'
      )[],
      shell: RECIPE_SHELL_USAGE[name],
    })),
    {
      moduleId: 'crm-contacts',
      label: 'Contacts fixture',
      route: '/composition-showcase?recipe=SuiteOverview&dataset=crm-contacts',
      breadcrumbs: ['Composition Showcase', 'Contacts fixture'],
      capabilities: ['sidebar'] as 'sidebar'[],
      shell: undefined,
    },
  ],
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
  CertificationLab: 'split',
};

const RECIPE_CANVAS_GEOMETRY: Record<RecipeName, 'bounded' | 'split' | 'wide' | 'full-bleed'> = {
  SuiteOverview: 'bounded',
  DataWorkspace: 'wide',
  SplitWorkspace: 'split',
  RecordWorkspace: 'bounded',
  BoardWorkspace: 'wide',
  ImmersiveWorkflow: 'full-bleed',
  CreativeEditor: 'full-bleed',
  CertificationLab: 'split',
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
    leftSlot={<ModuleSearch placeholder="Search records" />}
    centerSlot={
      <div className="text-text-muted flex items-center gap-2 text-xs">
        <Button variant="ghost" size="sm">
          All fields
        </Button>
        <Button variant="ghost" size="sm">
          Sorted by relevance
        </Button>
      </div>
    }
    rightSlot={
      <Button variant="primary" size="sm">
        Create record
      </Button>
    }
  />
);

const CertificationLabHeader = () => (
  <ModuleHeader
    visibleOnMobile={false}
    segments={[
      { id: 'suite', label: 'Shell Showcase' },
      { id: 'module', label: 'Resource directory', isActive: true },
    ]}
    statusLabel="Reference"
    statusSeverity="success"
    rightSlot={
      <Button variant="outline" size="sm">
        Export data
      </Button>
    }
  />
);

const CertificationLabToolbar = ({ onOpenComponents }: { onOpenComponents: () => void }) => (
  <ModuleToolbar
    visibleOnMobile={true}
    visibleOnDesktop={true}
    className="px-3"
    contextSlot={
      <Button
        variant="ghost"
        size="sm"
        startIcon="Menu"
        aria-label="Open components"
        onClick={onOpenComponents}
      />
    }
    leftSlot={
      <div className="flex min-w-0 w-full items-center gap-2">
        <ModuleSearch placeholder="Search resources" className="max-w-none" />
      </div>
    }
    centerSlot={<span className="text-text-muted text-xs">All columns</span>}
    rightSlot={
      <Button variant="primary" size="sm">
        Filter
      </Button>
    }
  />
);

const SuiteOverviewCanvas = ({
  state,
  composition,
  dataset,
}: {
  state: ShowcaseState;
  composition: ViewComposition;
  dataset: ShowcaseDataset;
}) => {
  const blockedState = ['empty', 'error', 'forbidden'].includes(state);
  const isContactsFixture = dataset === 'crm-contacts';
  const regions: Record<string, ReactNode> = {
    summary: (
      <TechnicalSurface
        variant="surface"
        radius="md"
        border="technical"
        className={`h-full p-5 ${blockedState ? 'opacity-50' : ''}`}
      >
        <p className="text-text-muted text-xs font-semibold uppercase tracking-[0.16em]">
          {isContactsFixture ? 'Contact health' : 'Portfolio health'}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {[
            ...(isContactsFixture
              ? [
                  ['Total contacts', '248'],
                  ['Active relationships', '184'],
                  ['Follow-ups due', '17'],
                  ['New this month', '+32'],
                ]
              : [
                  ['Active workspaces', '24'],
                  ['Open opportunities', '86'],
                  ['Tasks due today', '12'],
                  ['Team activity', '+18%'],
                ]),
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
          {isContactsFixture ? 'Relationship map' : 'Workspace map'}
        </p>
        <div className="relative mt-4 flex min-h-40 items-center justify-center overflow-hidden rounded-md border border-dashed border-primary/40 bg-primary/5">
          <TechnicalCanvas variant="blueprint" intensity="medium" size={40} showSubgrid />
          <span className="text-primary relative z-10 text-xs font-medium">
            {isContactsFixture ? 'Relationship map' : 'Workspace map'}
          </span>
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
            {isContactsFixture
              ? 'Contact activity remains available for the current review state.'
              : 'Metrics remain available for the current review state.'}
          </span>
        ) : null}
      </TechnicalSurface>
    ),
    activity: (
      <TechnicalSurface variant="surface" radius="md" border="technical" className="p-5">
        <SectionHeader
          title={isContactsFixture ? 'Contact activity' : 'Recent activity'}
          action={
            <Button variant="outline" size="sm">
              {isContactsFixture ? 'View all contacts' : 'View all activity'}
            </Button>
          }
        />
        <Heading as="h2" size="lg" weight="bold" className="text-text-main mt-3">
          {isContactsFixture ? 'Who needs attention' : 'What needs attention'}
        </Heading>
        <div className="mt-4 space-y-2">
          {(isContactsFixture
            ? [
                'Marta Ruiz requested a follow-up',
                'Northstar Labs contact updated',
                'Leo Martín added a new note',
              ]
            : [
                'Northstar workspace updated',
                'New opportunity moved to review',
                'Three tasks assigned to your team',
              ]
          ).map((item) => (
            <TechnicalSurface
              key={item}
              variant="surface"
              radius="sm"
              border="subtle"
              className="flex items-center justify-between gap-3 px-3 py-3 text-sm"
            >
              <span className="min-w-0 flex-1 text-text-main">{item}</span>
              <span className="ml-3 min-w-[3rem] shrink-0 text-right text-text-muted text-xs">
                Today
              </span>
            </TechnicalSurface>
          ))}
        </div>
      </TechnicalSurface>
    ),
  };

  return (
    <div className="font-sans">
      <PageHeader
        eyebrow="CRM foundation fixture"
        title={isContactsFixture ? 'Contacts overview' : 'Suite overview'}
        description={
          isContactsFixture
            ? 'Review relationship health and recent contact activity in the selected fixture.'
            : 'Reference composition for validating the overview recipe.'
        }
        actions={
          isContactsFixture ? (
            <Button variant="outline" size="sm">
              Add contact
            </Button>
          ) : undefined
        }
        className="mb-5"
      />
      <CompositionGrid composition={composition} regions={regions} />
    </div>
  );
};

const DATA_WORKSPACE_ROWS = [
  {
    workspace: 'Northstar Labs',
    plan: 'Enterprise',
    status: 'Active',
    members: '24 users',
    updated: 'Today',
  },
  {
    workspace: 'Estar Protegidos',
    plan: 'Growth',
    status: 'Review',
    members: '12 users',
    updated: 'Yesterday',
  },
  {
    workspace: 'Helio Systems',
    plan: 'Starter',
    status: 'Active',
    members: '8 users',
    updated: 'Aug 12',
  },
  {
    workspace: 'Monument Health',
    plan: 'Enterprise',
    status: 'Paused',
    members: '41 users',
    updated: 'Aug 11',
  },
  {
    workspace: 'Asteria Group',
    plan: 'Growth',
    status: 'Active',
    members: '19 users',
    updated: 'Aug 10',
  },
  {
    workspace: 'Blueforge Labs',
    plan: 'Starter',
    status: 'Review',
    members: '6 users',
    updated: 'Aug 09',
  },
  {
    workspace: 'Cobalt Retail',
    plan: 'Enterprise',
    status: 'Active',
    members: '58 users',
    updated: 'Aug 08',
  },
  {
    workspace: 'Delta Civic',
    plan: 'Growth',
    status: 'Paused',
    members: '27 users',
    updated: 'Aug 07',
  },
  {
    workspace: 'Evergreen Care',
    plan: 'Enterprise',
    status: 'Active',
    members: '73 users',
    updated: 'Aug 06',
  },
  {
    workspace: 'Faro Mobility',
    plan: 'Starter',
    status: 'Review',
    members: '4 users',
    updated: 'Aug 05',
  },
  {
    workspace: 'Granite Works',
    plan: 'Growth',
    status: 'Active',
    members: '31 users',
    updated: 'Aug 04',
  },
  {
    workspace: 'Horizon Public',
    plan: 'Enterprise',
    status: 'Paused',
    members: '46 users',
    updated: 'Aug 03',
  },
  {
    workspace: 'Iris Education',
    plan: 'Starter',
    status: 'Active',
    members: '11 users',
    updated: 'Aug 02',
  },
  {
    workspace: 'Juniper Finance',
    plan: 'Growth',
    status: 'Review',
    members: '22 users',
    updated: 'Aug 01',
  },
  {
    workspace: 'Kite Commerce',
    plan: 'Enterprise',
    status: 'Active',
    members: '64 users',
    updated: 'Jul 31',
  },
  {
    workspace: 'Lumen Health',
    plan: 'Starter',
    status: 'Paused',
    members: '9 users',
    updated: 'Jul 30',
  },
  {
    workspace: 'Meridian Foods',
    plan: 'Growth',
    status: 'Active',
    members: '36 users',
    updated: 'Jul 29',
  },
  {
    workspace: 'Nexa Transit',
    plan: 'Enterprise',
    status: 'Review',
    members: '52 users',
    updated: 'Jul 28',
  },
  {
    workspace: 'Orion Civic',
    plan: 'Starter',
    status: 'Active',
    members: '7 users',
    updated: 'Jul 27',
  },
  {
    workspace: 'Pioneer Studio',
    plan: 'Growth',
    status: 'Paused',
    members: '15 users',
    updated: 'Jul 26',
  },
  {
    workspace: 'Quartz Security',
    plan: 'Enterprise',
    status: 'Active',
    members: '88 users',
    updated: 'Jul 25',
  },
] as const;

const DataWorkspaceCanvas = ({
  state,
  selectedWorkspace,
  onSelectWorkspace,
}: {
  state: ShowcaseState;
  selectedWorkspace: string | null;
  onSelectWorkspace: (workspace: string) => void;
}) => {
  const [selectedWorkspaces, setSelectedWorkspaces] = useState<string[]>([]);
  const blockedState = ['empty', 'error', 'forbidden'].includes(state);

  return (
    <div className="space-y-4 p-4 font-sans sm:p-6">
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

      <div className={blockedState || state === 'loading' ? 'opacity-50' : ''}>
        <DataTable
          caption="Workspaces"
          rows={[...DATA_WORKSPACE_ROWS]}
          getRowKey={(row) => row.workspace}
          search={{ placeholder: 'Search workspaces', fields: ['workspace', 'plan', 'status'] }}
          filters={[
            {
              key: 'status',
              label: 'Status',
              options: ['Active', 'Review', 'Paused'].map((value) => ({ value, label: value })),
            },
            {
              key: 'plan',
              label: 'Plan',
              options: ['Enterprise', 'Growth', 'Starter'].map((value) => ({
                value,
                label: value,
              })),
            },
          ]}
          columns={[
            {
              key: 'workspace',
              header: 'Workspace',
              sortable: true,
              className: 'max-w-[18rem] truncate',
              render: (row) => <span title={row.workspace}>{row.workspace}</span>,
            },
            { key: 'plan', header: 'Plan', sortable: true, className: 'whitespace-nowrap' },
            {
              key: 'status',
              header: 'Status',
              sortable: true,
              className: 'whitespace-nowrap',
              render: (row) => (
                <span className="rounded border border-brand-cyan/40 bg-brand-cyan/10 px-2 py-1 text-xs text-text-main">
                  {row.status}
                </span>
              ),
            },
            { key: 'members', header: 'Members', sortable: true, className: 'whitespace-nowrap' },
            { key: 'updated', header: 'Updated', sortable: true, className: 'whitespace-nowrap' },
          ]}
          selectable
          selectedRowKeys={selectedWorkspaces}
          onSelectedRowKeysChange={(keys) => {
            const nextKeys = keys.map(String);
            setSelectedWorkspaces(nextKeys);
            if (nextKeys[0]) onSelectWorkspace(nextKeys[0]);
          }}
          selectedRowKey={selectedWorkspace ?? undefined}
          onRowClick={(row) => onSelectWorkspace(row.workspace)}
          bulkActions={
            <Button variant="outline" size="sm" onClick={() => setSelectedWorkspaces([])}>
              Clear selection
            </Button>
          }
          emptyState="No workspaces match the current filters."
          loading={state === 'loading'}
          loadingState="Loading workspaces"
          errorState={state === 'error' ? 'Workspaces unavailable' : undefined}
          forbidden={state === 'forbidden'}
          forbiddenState="Workspace access restricted"
          pageSizeOptions={[5, 10, 20]}
        />
      </div>
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
                  <Heading as="h2" size="xl" weight="bold" className="text-text-main mt-2">
                    Northstar Labs
                  </Heading>
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
                  <Heading as="h3" size="lg" weight="bold" className="text-text-main mt-1">
                    Recent account work
                  </Heading>
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
          <Heading as="h2" size="lg" weight="bold" className="text-text-main mt-1">
            Customer success workflow
          </Heading>
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
                  <Heading as="h2" size="lg" weight="bold" className="text-text-main mt-1">
                    Accounts
                  </Heading>
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
                  <Heading as="h2" size="xl" weight="bold" className="text-text-main mt-2">
                    Northstar Labs
                  </Heading>
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
  const regions = {
    workflow: (
      <TechnicalSurface variant="surface" radius="md" border="technical" className="h-full p-5">
        <p className="text-text-muted text-xs font-semibold uppercase tracking-[0.16em]">
          Workflow execution
        </p>
        <Heading as="h2" size="2xl" weight="bold" className="text-text-main mt-2">
          Launch campaign pipeline
        </Heading>
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
    ),
    actions: (
      <TechnicalSurface
        variant="surface"
        depth="raised"
        radius="md"
        border="technical"
        className="h-full p-4"
      >
        <p className="text-text-muted text-xs font-semibold uppercase tracking-[0.16em]">Actions</p>
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
    ),
    status: (
      <TechnicalSurface variant="surface" radius="md" border="technical" className="h-full p-4">
        <p className="text-text-muted text-xs font-semibold uppercase tracking-[0.16em]">Status</p>
        <strong className="text-text-main mt-3 block text-lg">
          {state === 'offline' ? 'Offline cache' : state === 'stale' ? 'Needs refresh' : 'On track'}
        </strong>
        <span className="text-text-muted mt-1 block text-sm">4 of 6 steps complete</span>
      </TechnicalSurface>
    ),
  };

  return (
    <div className="relative min-h-full overflow-hidden bg-shell-canvas p-4 font-sans sm:p-6">
      <TechnicalCanvas variant="blueprint" intensity="low" size={48} showSubgrid />
      <div className="relative z-10 min-h-[32rem]">
        <CompositionGrid composition={IMMERSIVE_WORKFLOW_COMPOSITION} regions={regions} />
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
  <div className="flex h-full min-h-0 flex-col overflow-hidden bg-shell-canvas">
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
      depth="flat"
      radius="none"
      border="technical"
      className="flex min-h-12 shrink-0 items-center justify-between gap-3 border-x-0 px-4 py-2"
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
    <section className="h-[clamp(10rem,22vh,18rem)] min-h-40 shrink-0 overflow-auto border-x-0 border-t border-border-technical bg-surface-dark">
      <div className="border-border-technical bg-surface-dark sticky top-0 z-10 flex min-h-10 items-center justify-between gap-3 border-x-0 border-b px-3 py-2 text-xs text-text-muted">
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

const CERTIFICATION_COMPONENTS = [
  {
    id: 'TechnicalCanvas',
    label: 'TechnicalCanvas',
    status: 'partial',
    statusTone: 'warning',
    action: 'Canonical grid primitive',
  },
  {
    id: 'TechnicalSurface',
    label: 'TechnicalSurface',
    status: 'partial',
    statusTone: 'warning',
    action: 'Surface contract',
  },
  {
    id: 'TechnicalCard',
    label: 'TechnicalCard',
    status: 'pending',
    statusTone: 'neutral',
    action: 'Thin surface composition',
  },
  {
    id: 'SharedFoundation',
    label: 'Shared foundation',
    status: 'partial',
    statusTone: 'warning',
    action: 'Headers and shared states',
  },
  {
    id: 'FiltersActions',
    label: 'Filters and actions',
    status: 'partial',
    statusTone: 'warning',
    action: 'Controlled filter and action composition',
  },
  {
    id: 'SearchInput',
    label: 'SearchInput',
    status: 'experimental',
    statusTone: 'warning',
    action: 'Reusable controlled search pattern',
  },
  {
    id: 'CRMPrimitives',
    label: 'CRM primitives',
    status: 'certified',
    statusTone: 'neutral',
    action: 'Certified CRM component inventory',
  },
  {
    id: 'LoopdevComponents',
    label: 'Loopdev components',
    status: 'experimental',
    statusTone: 'warning',
    action: 'Reusable component contracts for future suites',
  },
  {
    id: 'SuiteCompositionPatterns',
    label: 'Suite composition patterns',
    status: 'experimental',
    statusTone: 'warning',
    action: 'Phase B6-B8 operational flow composition',
  },
  {
    id: 'OperationalActions',
    label: 'Operational actions',
    status: 'experimental',
    statusTone: 'warning',
    action: 'Phase C9 actions, confirmation and recovery patterns',
  },
  {
    id: 'DashboardSummary',
    label: 'Dashboard and summary',
    status: 'experimental',
    statusTone: 'warning',
    action: 'Phase C10 metrics, activity and summary composition',
  },
  {
    id: 'KanbanBoard',
    label: 'Generic Kanban board',
    status: 'experimental',
    statusTone: 'warning',
    action: 'Phase C11 visual and contract composition',
  },
  {
    id: 'InteractionFeedback',
    label: 'Feedback and global context',
    status: 'experimental',
    statusTone: 'warning',
    action: 'Phase C12 confirmation, recovery and command composition',
  },
] as const;

type CertificationComponent = (typeof CERTIFICATION_COMPONENTS)[number]['id'];

const CERTIFICATION_GROUPS = [
  {
    id: 'ui-foundation',
    label: 'UI Foundation',
    description: 'Shared layout, surfaces and interaction contracts',
    status: 'partial',
    statusTone: 'warning',
    entryComponent: 'TechnicalCanvas',
    componentIds: ['TechnicalCanvas', 'TechnicalSurface', 'TechnicalCard'],
  },
  {
    id: 'data-tables-filters',
    label: 'Data tables and filters',
    description: 'Data presentation, filtering and controlled actions',
    status: 'partial',
    statusTone: 'warning',
    entryComponent: 'FiltersActions',
    componentIds: ['FiltersActions'],
  },
  {
    id: 'suite-patterns',
    label: 'Suite patterns',
    description: 'Reusable interaction patterns for CRM and future suites',
    status: 'experimental',
    statusTone: 'warning',
    entryComponent: 'SearchInput',
    componentIds: ['SearchInput'],
  },
  {
    id: 'crm-primitives',
    label: 'CRM Primitives',
    description: 'Certified CRM component inventory',
    status: 'certified',
    statusTone: 'neutral',
    entryComponent: 'CRMPrimitives',
    componentIds: ['CRMPrimitives'],
  },
  {
    id: 'loopdev-components',
    label: 'Loopdev components',
    description: 'Reusable components with explicit suite contracts',
    status: 'experimental',
    statusTone: 'warning',
    entryComponent: 'LoopdevComponents',
    componentIds: ['LoopdevComponents'],
  },
  {
    id: 'suite-composition-patterns',
    label: 'Suite composition patterns',
    description: 'B6-B8 query, data and list-detail workspace flow',
    status: 'experimental',
    statusTone: 'warning',
    entryComponent: 'SuiteCompositionPatterns',
    componentIds: ['SuiteCompositionPatterns'],
  },
  {
    id: 'phase-c-operations',
    label: 'Phase C',
    description: 'Reusable actions, summaries and advanced suite patterns',
    status: 'experimental',
    statusTone: 'warning',
    entryComponent: 'OperationalActions',
    componentIds: ['OperationalActions', 'DashboardSummary'],
  },
  {
    id: 'phase-c11-kanban',
    label: 'Phase C11',
    description: 'Visual contract for a domain-neutral Kanban board',
    status: 'experimental',
    statusTone: 'warning',
    entryComponent: 'KanbanBoard',
    componentIds: ['KanbanBoard'],
  },
  {
    id: 'phase-c12-feedback',
    label: 'Phase C12',
    description: 'Confirmation, recovery and global context feedback patterns',
    status: 'experimental',
    statusTone: 'warning',
    entryComponent: 'InteractionFeedback',
    componentIds: ['InteractionFeedback'],
  },
] as const satisfies ReadonlyArray<{
  id: string;
  label: string;
  description: string;
  status: string;
  statusTone: string;
  entryComponent: CertificationComponent;
  componentIds: readonly CertificationComponent[];
}>;

const CertificationSidebar = ({
  selected,
  onSelect,
}: {
  selected: CertificationComponent;
  onSelect: (component: CertificationComponent) => void;
}) => (
  <div className="flex h-full min-h-0 flex-col gap-4 p-4">
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
        Component inventory
      </p>
      <Heading as="h2" size="lg" weight="bold" className="mt-2 text-text-main">
        Certification Lab
      </Heading>
    </div>
    <nav aria-label="Certification groups" className="space-y-3">
      {CERTIFICATION_GROUPS.map((group) => {
        const isGroupSelected = (group.componentIds as readonly CertificationComponent[]).includes(
          selected,
        );
        const childComponents = group.componentIds
          .map((id) => CERTIFICATION_COMPONENTS.find((item) => item.id === id))
          .filter((item): item is (typeof CERTIFICATION_COMPONENTS)[number] => Boolean(item));

        return (
          <div key={group.id} className="space-y-1">
            <Button
              type="button"
              variant="ghost"
              className={`w-full justify-start border px-3 py-4 text-left ${isGroupSelected ? 'border-primary bg-primary/10' : 'border-border-subtle hover:border-border-technical'}`}
              aria-current={isGroupSelected ? 'true' : undefined}
              onClick={() => onSelect(group.entryComponent as CertificationComponent)}
            >
              <span className="block font-mono text-xs uppercase tracking-[0.14em] text-text-main">
                {group.label}
              </span>
              <span className="mt-2 block text-[11px] leading-4 text-text-muted">
                {group.description}
              </span>
              <span
                className={`mt-3 inline-block border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] ${group.statusTone === 'warning' ? 'border-warning/40 bg-warning/10 text-warning' : 'border-border-technical bg-shell-surface text-text-muted'}`}
              >
                {group.status}
              </span>
            </Button>
            {childComponents.length > 1 && (
              <div
                className="ml-3 border-l border-border-subtle pl-2"
                aria-label={`${group.label} components`}
              >
                {childComponents.map((component) => (
                  <Button
                    key={component.id}
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`block w-full justify-start border-b px-2 py-2 text-left text-[11px] ${selected === component.id ? 'border-primary text-primary' : 'border-border-subtle text-text-muted hover:text-text-main'}`}
                    aria-current={selected === component.id ? 'true' : undefined}
                    onClick={() => onSelect(component.id)}
                  >
                    {component.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  </div>
);

const CertificationPanel = ({ selected }: { selected: CertificationComponent }) => {
  const component = CERTIFICATION_COMPONENTS.find((item) => item.id === selected);
  return (
    <div className="space-y-5 p-4">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
          Evidence record
        </p>
        <Heading as="h2" size="lg" weight="bold" className="mt-2 text-text-main">
          {component?.label}
        </Heading>
        <p className="mt-1 text-sm text-text-muted">{component?.action}</p>
      </div>
      <dl className="divide-y divide-border-subtle border-y border-border-subtle text-sm">
        {[
          ['Contract', selected === 'TechnicalCanvas' ? 'verified' : 'partial'],
          ['Tests', selected === 'TechnicalCanvas' ? 'verified' : 'pending'],
          ['Visual', 'pending'],
          ['Responsive', 'pending'],
          ['Registry', 'deferred'],
        ].map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 py-3">
            <dt className="text-text-muted">{label}</dt>
            <dd className="font-mono text-xs uppercase text-text-main">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="text-xs leading-5 text-text-muted">
        Certification is contextual. This panel records evidence; it does not certify a component by
        itself.
      </p>
    </div>
  );
};

const CertificationFoundationCatalog = () => (
  <div className="space-y-5">
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
        Certification section
      </p>
      <Heading as="h1" size="2xl" weight="bold" className="mt-2 text-text-main">
        UI Foundation
      </Heading>
      <p className="mt-1 text-sm text-text-muted">
        Shared layout, surfaces and interaction contracts
      </p>
    </div>
    <section className="space-y-3" aria-labelledby="technical-canvas-examples">
      <div>
        <Heading
          as="h2"
          id="technical-canvas-examples"
          size="lg"
          weight="bold"
          className="text-text-main"
        >
          TechnicalCanvas
        </Heading>
        <p className="text-sm text-text-muted">Canonical grid primitive · all variants</p>
      </div>
      <TechnicalCanvasCertification />
    </section>
    <section className="space-y-3" aria-labelledby="technical-surface-examples">
      <div>
        <Heading
          as="h2"
          id="technical-surface-examples"
          size="lg"
          weight="bold"
          className="text-text-main"
        >
          TechnicalSurface
        </Heading>
        <p className="text-sm text-text-muted">Surface contract · all variants</p>
      </div>
      <TechnicalSurfaceCertification />
    </section>
    <section className="space-y-3" aria-labelledby="technical-card-examples">
      <div>
        <Heading
          as="h2"
          id="technical-card-examples"
          size="lg"
          weight="bold"
          className="text-text-main"
        >
          TechnicalCard
        </Heading>
        <p className="text-sm text-text-muted">Thin surface composition · all states</p>
      </div>
      <TechnicalCardCertification />
    </section>
  </div>
);

const CertificationLabCanvas = ({
  selected,
  selectedActivityId,
  onActivitySelect,
}: {
  selected: CertificationComponent;
  selectedActivityId?: string;
  onActivitySelect?: (row: ActivityRow) => void;
}) => {
  if (selected === 'TechnicalCanvas') {
    return <CertificationFoundationCatalog />;
  }
  if (selected === 'FiltersActions') {
    return (
      <DataTablesCatalog
        selectedActivityId={selectedActivityId}
        onActivitySelect={onActivitySelect}
      />
    );
  }
  if (selected === 'SearchInput') {
    return <SearchInputCertification />;
  }
  if (selected === 'CRMPrimitives') {
    return <CRMPrimitivesCatalog />;
  }
  if (selected === 'LoopdevComponents') {
    return <LoopdevComponentsCatalog />;
  }
  if (selected === 'SuiteCompositionPatterns') {
    return <SuiteCompositionPatternsCertification />;
  }
  if (selected === 'OperationalActions') {
    return <OperationalActionsCertification />;
  }
  if (selected === 'DashboardSummary') {
    return <DashboardSummaryCertification />;
  }
  if (selected === 'KanbanBoard') {
    return <KanbanBoardCertification />;
  }
  if (selected === 'InteractionFeedback') {
    return <InteractionFeedbackCertification />;
  }
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
            Component Certification Lab
          </p>
          <Heading as="h1" size="2xl" weight="bold" className="mt-2 text-text-main">
            {selected}
          </Heading>
        </div>
        <span className="border border-warning/40 bg-warning/10 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-warning">
          Evidence pending
        </span>
      </div>
      {selected === 'SharedFoundation' ? (
        <div className="space-y-4">
          <PageHeader
            eyebrow="Shared foundation fixture"
            title="Customer workspace"
            description="Page context and actions remain owned by the consuming composition."
            actions={
              <Button variant="primary" size="sm">
                Create customer
              </Button>
            }
          />
          <TechnicalSurface variant="surface" radius="md" border="technical" className="p-4">
            <SectionHeader
              title="Customer activity"
              action={
                <Button variant="outline" size="sm">
                  Refresh
                </Button>
              }
            />
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <TechnicalSurface variant="surface" radius="sm" border="subtle" className="p-4">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-text-muted">
                  Loading
                </p>
                <LoadingState label="Loading customer activity" lines={3} />
              </TechnicalSurface>
              <TechnicalSurface variant="surface" radius="sm" border="subtle" className="p-4">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-text-muted">
                  Empty
                </p>
                <EmptyState
                  variant="ghost"
                  size="sm"
                  icon="inbox"
                  title="No activity yet"
                  description="New activity will appear here when the customer engages."
                  action={
                    <Button variant="outline" size="sm">
                      Add activity
                    </Button>
                  }
                />
              </TechnicalSurface>
              <TechnicalSurface variant="surface" radius="sm" border="subtle" className="p-4">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-warning">
                  Error
                </p>
                <EmptyState
                  variant="ghost"
                  status="error"
                  size="sm"
                  icon="error_outline"
                  title="Activity unavailable"
                  description="The activity feed could not be loaded."
                  action={
                    <Button variant="danger" size="sm">
                      Try again
                    </Button>
                  }
                />
              </TechnicalSurface>
              <TechnicalSurface variant="surface" radius="sm" border="subtle" className="p-4">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-text-muted">
                  Forbidden / read-only
                </p>
                <EmptyState
                  variant="ghost"
                  size="sm"
                  icon="lock"
                  title="Activity access is restricted"
                  description="You can view the workspace, but you cannot add or change activity."
                />
              </TechnicalSurface>
            </div>
          </TechnicalSurface>
        </div>
      ) : selected === 'TechnicalSurface' ? (
        <div className="grid gap-4 md:grid-cols-2">
          {(['surface', 'glass', 'canvas'] as const).map((variant) => (
            <TechnicalSurface
              key={variant}
              variant={variant}
              depth={variant === 'glass' ? 'raised' : 'flat'}
              radius="md"
              border="technical"
              className="min-h-32 p-4"
            >
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-text-main">
                {variant} surface
              </span>
            </TechnicalSurface>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <TechnicalCard className="min-h-32 max-lg:min-h-24 p-4 max-lg:p-3">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-text-main">
              flat card
            </span>
          </TechnicalCard>
          <TechnicalCard variant="interactive" className="min-h-32 max-lg:min-h-24 p-4 max-lg:p-3">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-text-main">
              interactive card
            </span>
          </TechnicalCard>
          <TechnicalCard variant="warning" className="min-h-32 max-lg:min-h-24 p-4 max-lg:p-3">
            <div className="flex h-full flex-col justify-between gap-2">
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-text-main">
                warning card
              </span>
              <span className="text-xs text-warning">
                Warning semantics belong to the consuming state.
              </span>
            </div>
          </TechnicalCard>
          <TechnicalCard variant="disabled" className="min-h-32 max-lg:min-h-24 p-4 max-lg:p-3">
            <div className="flex h-full flex-col justify-between gap-2">
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-text-main">
                disabled card
              </span>
              <span className="text-xs text-text-muted">Unavailable for interaction.</span>
            </div>
          </TechnicalCard>
          <TechnicalCard data-read-only="true" className="min-h-32 max-lg:min-h-24 p-4 max-lg:p-3">
            <div className="flex h-full flex-col justify-between gap-2">
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-text-main">
                read-only card
              </span>
              <span className="text-xs text-text-muted">Readable; mutations are disabled.</span>
            </div>
          </TechnicalCard>
        </div>
      )}
    </div>
  );
};

export default function CompositionShowcasePage() {
  const pathname = usePathname();
  const [recipe, setRecipe] = useState<RecipeName>('SuiteOverview');
  const [state, setState] = useState<ShowcaseState>('ready');
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<ActivityRow | null>(null);
  const [dataset, setDataset] = useState<ShowcaseDataset>('default');
  const [contextMode, setContextMode] = useState<PlatformContextPanelMode | null>(null);
  const [navMode, setNavMode] = useState<'expanded' | 'rail' | 'hover'>('expanded');
  const [isModuleContextPanelOpen, setIsModuleContextPanelOpen] = useState(false);
  const [isSplitContextSidebarOpen, setIsSplitContextSidebarOpen] = useState(false);
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
  const [selectedCertificationComponent, setSelectedCertificationComponent] =
    useState<CertificationComponent>('TechnicalCanvas');
  const [activeOrganizationId, setActiveOrganizationId] = useState(SHOWCASE_ORGANIZATIONS[0].id);
  const router = useRouter();
  const composition = FIXTURES[recipe];
  const canvasGeometry = RECIPE_CANVAS_GEOMETRY[recipe];
  const activeOrganization = SHOWCASE_ORGANIZATIONS.find(({ id }) => id === activeOrganizationId);

  useEffect(() => {
    const certificationPath = window.location.pathname;
    const isUiFoundationRoute =
      certificationPath === '/composition-showcase/certification-lab/UI-foundation';
    const isCrmPrimitivesRoute =
      certificationPath === '/composition-showcase/certification-lab/CRMPrimitives';
    const isDataTablesRoute =
      certificationPath === '/composition-showcase/certification-lab/data-tables';
    const isSuitePatternsRoute =
      certificationPath === '/composition-showcase/certification-lab/suite-patterns';
    const isLoopdevComponentsRoute =
      certificationPath === '/composition-showcase/certification-lab/loopdev-components';
    const params = new URLSearchParams(window.location.search);
    const requestedRecipe = params.get('recipe');
    const requestedDataset = params.get('dataset');
    const requestedComponent = params.get('component');

    startTransition(() => {
      setRecipe(
        isCrmPrimitivesRoute ||
          isUiFoundationRoute ||
          isDataTablesRoute ||
          isSuitePatternsRoute ||
          isLoopdevComponentsRoute
          ? 'CertificationLab'
          : requestedRecipe && requestedRecipe in FIXTURES
            ? (requestedRecipe as RecipeName)
            : 'SuiteOverview',
      );
      setDataset(isShowcaseDataset(requestedDataset) ? requestedDataset : 'default');
      setSelectedCertificationComponent(
        isCrmPrimitivesRoute
          ? 'CRMPrimitives'
          : isUiFoundationRoute
            ? 'TechnicalCanvas'
            : isDataTablesRoute
              ? 'FiltersActions'
              : isSuitePatternsRoute
                ? 'SearchInput'
                : isLoopdevComponentsRoute
                  ? 'LoopdevComponents'
                  : CERTIFICATION_COMPONENTS.some(
                        (component) => component.id === requestedComponent,
                      )
                    ? (requestedComponent as CertificationComponent)
                    : 'TechnicalCanvas',
      );
    });
  }, []);

  useEffect(() => {
    const mark = `composition-showcase:${recipe}`;
    performance.mark(`${mark}:start`);
    emitShowcaseEvent('view', { recipe, state, dataset });
    return () => {
      performance.mark(`${mark}:end`);
      performance.measure(mark, `${mark}:start`, `${mark}:end`);
    };
  }, [recipe, state, dataset]);

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
                    ? 'border-x-0 px-3 py-2'
                    : region.id === 'timeline'
                      ? 'border-x-0 border-t px-4 py-3'
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
    <div className={`${activeOrganization?.theme ?? ''} h-full`}>
      <SuiteRuntime
        config={{ ...SHOWCASE_SUITE_CONFIG, navMode }}
        scrollResetKey={pathname}
        activeModuleId={dataset === 'crm-contacts' ? 'crm-contacts' : recipe}
        moduleContextRenderers={{
          CertificationLab: () => (
            <CertificationSidebar
              selected={selectedCertificationComponent}
              onSelect={(component) => {
                setIsSplitContextSidebarOpen(false);
                setIsModuleContextPanelOpen(false);
                setSelectedCertificationComponent(component);
                if (component === 'CRMPrimitives') {
                  router.push('/composition-showcase/certification-lab/CRMPrimitives');
                } else if (component === 'FiltersActions') {
                  router.push('/composition-showcase/certification-lab/data-tables');
                } else if (component === 'SearchInput') {
                  router.push('/composition-showcase/certification-lab/suite-patterns');
                } else if (component === 'LoopdevComponents') {
                  router.push('/composition-showcase/certification-lab/loopdev-components');
                } else {
                  router.push('/composition-showcase/certification-lab/UI-foundation');
                }
              }}
            />
          ),
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
          CertificationLab: () =>
            isModuleContextPanelOpen ? (
              selectedActivity ? (
                <div className="space-y-4 p-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-text-muted">
                      Activity detail
                    </p>
                    <Heading as="h2" size="lg" weight="bold" className="mt-2 text-text-main">
                      {selectedActivity.event}
                    </Heading>
                  </div>
                  <dl className="divide-y divide-border-subtle border-y border-border-subtle text-sm">
                    <div className="flex items-center justify-between gap-4 py-3">
                      <dt className="text-text-muted">Actor</dt>
                      <dd className="flex items-center gap-2 font-medium text-text-main">
                        <UserAvatar name={selectedActivity.actor} size="sm" />
                        {selectedActivity.actor}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-4 py-3">
                      <dt className="text-text-muted">Date</dt>
                      <dd className="font-mono text-xs text-text-main">{selectedActivity.date}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-4 py-3">
                      <dt className="text-text-muted">Status</dt>
                      <dd>
                        <Badge
                          status={
                            selectedActivity.status === 'Done'
                              ? 'success'
                              : selectedActivity.status === 'Review'
                                ? 'energy'
                                : 'primary'
                          }
                        >
                          {selectedActivity.status}
                        </Badge>
                      </dd>
                    </div>
                  </dl>
                  <Button variant="outline" size="sm" onClick={() => setSelectedActivity(null)}>
                    Back to certification
                  </Button>
                </div>
              ) : (
                <CertificationPanel selected={selectedCertificationComponent} />
              )
            ) : null,
          DataWorkspace: () =>
            isModuleContextPanelOpen && selectedWorkspace ? (
              <div className="space-y-4 p-4">
                <div>
                  <p className="text-text-muted text-xs uppercase tracking-[0.16em]">
                    Workspace detail
                  </p>
                  <Heading as="h2" size="lg" weight="bold" className="mt-2 text-text-main">
                    {selectedWorkspace}
                  </Heading>
                </div>
                {(() => {
                  const selectedRow = DATA_WORKSPACE_ROWS.find(
                    ({ workspace }) => workspace === selectedWorkspace,
                  );
                  if (!selectedRow) return null;
                  return (
                    <dl className="divide-y divide-border-subtle border-y border-border-subtle text-sm">
                      {[
                        ['Plan', selectedRow.plan],
                        ['Status', selectedRow.status],
                        ['Members', selectedRow.members],
                        ['Updated', selectedRow.updated],
                      ].map(([label, value]) => (
                        <div key={label} className="flex items-center justify-between gap-4 py-3">
                          <dt className="text-text-muted">{label}</dt>
                          <dd className="font-medium text-text-main">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  );
                })()}
                <p className="text-sm text-text-muted">Selected from the workspace table.</p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="primary" size="sm">
                    Open workspace
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setSelectedWorkspace(null)}>
                    Clear selection
                  </Button>
                </div>
              </div>
            ) : null,
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
        moduleContextPanelOnClose={() => {
          setIsModuleContextPanelOpen(false);
          setSelectedWorkspace(null);
          setSelectedActivity(null);
        }}
        moduleContextSidebarCollapsed={
          recipe === 'CertificationLab'
            ? !isSplitContextSidebarOpen
            : recipe === 'CreativeEditor'
              ? !isMediaLibraryOpen
              : recipe === 'SplitWorkspace'
                ? !isSplitContextSidebarOpen
                : undefined
        }
        moduleContextSidebarShowCollapsedTrigger={
          recipe !== 'CreativeEditor' &&
          recipe !== 'SplitWorkspace' &&
          recipe !== 'CertificationLab'
        }
        moduleContextSidebarMobileVisibility="visible"
        moduleContextSidebarOnCollapsedChange={(collapsed) => {
          if (recipe === 'CertificationLab') setIsSplitContextSidebarOpen(!collapsed);
          if (recipe === 'CreativeEditor') setIsMediaLibraryOpen(!collapsed);
          if (recipe === 'SplitWorkspace') setIsSplitContextSidebarOpen(!collapsed);
        }}
        contextualSidebarAction={
          recipe === 'CertificationLab' && !isSplitContextSidebarOpen
            ? {
                type: 'contextual-action',
                icon: 'Menu',
                label: 'Open components',
                actionId: 'open-components',
                onAction: () => setIsSplitContextSidebarOpen(true),
              }
            : (isRail) =>
                (recipe === 'CreativeEditor' && !isMediaLibraryOpen) ||
                (recipe === 'SplitWorkspace' && !isSplitContextSidebarOpen) ? (
                  <NavSidebarItem
                    icon="Menu"
                    label={
                      recipe === 'CreativeEditor' ? 'Open Media Library' : 'Open selection context'
                    }
                    isRail={isRail}
                    revealOnHover={false}
                    variant="contextual-action"
                    role="button"
                    onAction={() => {
                      if (recipe === 'CreativeEditor') setIsMediaLibraryOpen(true);
                      if (recipe === 'SplitWorkspace') setIsSplitContextSidebarOpen(true);
                    }}
                    actionId={
                      recipe === 'CreativeEditor' ? 'open-media-library' : 'open-selection-context'
                    }
                  />
                ) : null
        }
        canvasProps={{
          mode: RECIPE_CANVAS_MODES[recipe],
          className:
            recipe === 'CertificationLab'
              ? 'max-lg:h-auto max-lg:min-h-[calc(100vh-8rem)]'
              : undefined,
          contentClassName:
            recipe === 'CertificationLab'
              ? selectedCertificationComponent === 'CRMPrimitives'
                ? 'p-4 sm:p-5 max-lg:overflow-x-hidden max-lg:overflow-y-auto'
                : 'p-4 sm:p-5 max-lg:overflow-x-hidden max-lg:overflow-y-auto'
              : undefined,
          header:
            recipe === 'SplitWorkspace' ? (
              <SplitRecipeHeader />
            ) : recipe === 'CertificationLab' ? (
              <CertificationLabHeader />
            ) : undefined,
          toolbar:
            recipe === 'SplitWorkspace' ? (
              <SplitRecipeToolbar />
            ) : recipe === 'CertificationLab' ? (
              <CertificationLabToolbar
                onOpenComponents={() => setIsSplitContextSidebarOpen(true)}
              />
            ) : undefined,
        }}
        onNavModeChange={setNavMode}
        onNavigate={(route) => {
          const destination = new URL(route.routeId, window.location.origin);
          const selectedRecipe = destination.searchParams.get('recipe');
          const selectedDataset = destination.searchParams.get('dataset');
          if (selectedRecipe && selectedRecipe in FIXTURES) {
            const nextDataset = isShowcaseDataset(selectedDataset) ? selectedDataset : 'default';
            emitShowcaseEvent('navigation', {
              recipe: selectedRecipe,
              dataset: nextDataset,
              fallback: false,
            });
            setRecipe(selectedRecipe);
            setDataset(nextDataset);
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
        centerSlot={
          <CommandBarTrigger
            className="w-full"
            placeholder="Search or type a command..."
            onOpen={() => undefined}
          />
        }
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
          isVisualCertification ? undefined : (
            <div className="flex items-center gap-2">
              <PlatformHeaderControls
                notifications={NOTIFICATION_CENTER_FIXTURES.recent}
                unreadCount={NOTIFICATION_CENTER_FIXTURES.recent.filter(({ read }) => !read).length}
                activeContext={contextMode}
                onOpenNotifications={() => setContextMode('notifications')}
                onOpenHelp={() => setContextMode('help')}
                onOpenAI={() => setContextMode('assistant')}
              />
            </div>
          )
        }
        mobileSidebarActions={
          <div className="grid min-w-0 flex-1 grid-cols-2 gap-2">
            <div className="flex min-h-10 items-center">
              <ThemeToggle
                variant="technical"
                size="md"
                className="!h-10 !w-full !rounded-md !border-border-technical !text-text-main"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="md"
              aria-label="Open help center"
              className="min-h-10"
              onClick={() => setContextMode('help')}
            >
              <CircleHelp size={20} aria-hidden="true" />
              <span>Help</span>
            </Button>
          </div>
        }
        profileSlot={
          isVisualCertification ? undefined : (
            <UserMenu
              userName="Alex Morgan"
              userEmail="showcase@loopdev.local"
              userRole="Tenant_Admin"
              tenantName="Showcase Workspace"
              userSrc="https://i.pravatar.cc/64?img=12"
              timezoneOptions={[{ label: 'Auto detect', isActive: true }]}
              onOpenChange={(open) => {
                if (open) setContextMode(null);
              }}
              onAvatarClick={() => setContextMode('profile')}
              onProfileClick={() => setContextMode('profile')}
              onLogout={() => undefined}
            />
          )
        }
        appShellProps={{
          onToggleLeftSidebar: () =>
            setNavMode((current) => (current === 'expanded' ? 'rail' : 'expanded')),
          config: { activeOverlay: contextMode ? 'context' : null },
          contextSlot: contextMode ? (
            <ContextPanelHost
              mode={contextMode}
              notifications={NOTIFICATION_CENTER_FIXTURES.recent}
              unreadCount={NOTIFICATION_CENTER_FIXTURES.recent.filter(({ read }) => !read).length}
              onClose={() => setContextMode(null)}
              user={{
                name: 'Alex Morgan',
                email: 'showcase@loopdev.local',
                role: 'TENANT_ADMIN',
                tenantName: 'Showcase Workspace',
              }}
            />
          ) : undefined,
        }}
      >
        <main
          data-showcase-state={state}
          className={`${recipe === 'CreativeEditor' ? 'h-full min-h-0 overflow-hidden' : 'min-h-full'} bg-shell-canvas text-text-main`}
        >
          <section
            className={`min-w-0 max-w-full ${SUITE_CANVAS_GEOMETRY_CLASSES[canvasGeometry]} ${recipe === 'DataWorkspace' ? 'min-h-full' : ''}`}
          >
            {
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  {dataset === 'default' ? (
                    <>
                      <Heading
                        as="h1"
                        size="xs"
                        weight="bold"
                        className="font-mono uppercase tracking-[0.16em]"
                      >
                        {composition.recipe}
                      </Heading>
                      <span className="text-xs text-text-muted">
                        {composition.grid.columns} columns / {composition.grid.gap} gap
                      </span>
                    </>
                  ) : null}
                </div>
                <label className="flex items-center gap-2 text-xs text-text-muted">
                  <span>Review state</span>
                  <select
                    aria-label="Review state"
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
                <span
                  aria-live="polite"
                  data-testid="showcase-state-status"
                  className="text-xs text-text-muted"
                >
                  State: {state}
                </span>
              </div>
            }
            {recipe === 'CertificationLab' ? (
              <CertificationLabCanvas
                selected={selectedCertificationComponent}
                selectedActivityId={selectedActivity?.id}
                onActivitySelect={(row) => {
                  setSelectedActivity(row);
                  setIsModuleContextPanelOpen(true);
                }}
              />
            ) : recipe === 'CreativeEditor' ? (
              <CreativeEditorCanvas regions={regions} state={state} />
            ) : recipe === 'SuiteOverview' ? (
              <SuiteOverviewCanvas state={state} composition={composition} dataset={dataset} />
            ) : recipe === 'DataWorkspace' ? (
              <DataWorkspaceCanvas
                state={state}
                selectedWorkspace={selectedWorkspace}
                onSelectWorkspace={(workspace) => {
                  setSelectedWorkspace(workspace);
                  setIsModuleContextPanelOpen(true);
                }}
              />
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
    </div>
  );
}
