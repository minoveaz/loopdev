'use client';

import { useEffect, useMemo, useState } from 'react';
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
  TechnicalSurface,
  UserMenu,
  type GlobalContextPanelMode,
} from '@loopdev/ui';
import { Menu } from 'lucide-react';
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

const regionClass = (component: string) =>
  component === 'VideoStage' || component === 'TechnicalCanvas'
    ? 'min-h-[18rem]'
    : 'min-h-[5rem]';

const STATES = ['ready', 'loading', 'empty', 'error', 'read-only', 'forbidden'] as const;
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
  { id: 'northstar-labs', name: 'Northstar Labs', planLabel: 'FREE', theme: themes.estarProtegidos },
];

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

const RECIPE_CANVAS_MODES: Record<RecipeName, 'overview' | 'data' | 'workspace' | 'split' | 'board' | 'full-bleed'> = {
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
    rightSlot={<Button variant="outline" size="sm">Recipe action</Button>}
  />
);

const SplitRecipeToolbar = () => (
  <ModuleToolbar
    left={
      <div className="border-border-technical bg-background text-text-muted flex items-center gap-2 rounded-md border px-3 py-1.5">
        <span aria-hidden="true">⌕</span>
        <span>Search records</span>
      </div>
    }
    center={
      <div className="text-text-muted flex items-center gap-2 text-xs">
        <Button variant="ghost" size="sm">All fields</Button>
        <Button variant="ghost" size="sm">Sorted by relevance</Button>
      </div>
    }
    right={<Button variant="primary" size="sm">Create record</Button>}
  />
);

export default function CompositionShowcasePage() {
  const [recipe, setRecipe] = useState<RecipeName>(() => {
    if (typeof window === 'undefined') return 'SuiteOverview';
    const requestedRecipe = new URLSearchParams(window.location.search).get('recipe');
    return requestedRecipe && requestedRecipe in FIXTURES ? (requestedRecipe as RecipeName) : 'SuiteOverview';
  });
  const [state, setState] = useState<ShowcaseState>('ready');
  const [contextMode, setContextMode] = useState<GlobalContextPanelMode | null>(null);
  const [navMode, setNavMode] = useState<'expanded' | 'rail' | 'hover'>('expanded');
  const [isModuleContextPanelOpen, setIsModuleContextPanelOpen] = useState(true);
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
  const [activeOrganizationId, setActiveOrganizationId] = useState(SHOWCASE_ORGANIZATIONS[0].id);
  const router = useRouter();
  const composition = FIXTURES[recipe];
  const activeOrganization = SHOWCASE_ORGANIZATIONS.find(({ id }) => id === activeOrganizationId);

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
              !(recipe === 'CreativeEditor' && ['asset-sidebar', 'inspector'].includes(region.slot)),
          )
          .map((region) => [
          region.id,
          <TechnicalSurface
            key={region.id}
            variant="surface"
            depth="flat"
            className={`${regionClass(region.component)} ${state === 'forbidden' ? 'opacity-60' : ''}`}
          >
            <div className="flex h-full min-h-[inherit] flex-col justify-between p-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
                {region.slot}
              </span>
              <strong className="text-sm text-text-main">
                {state === 'loading'
                  ? 'Loading...'
                  : state === 'empty'
                    ? 'No content'
                    : state === 'error'
                      ? 'Unable to load'
                      : state === 'forbidden'
                        ? 'Access restricted'
                        : region.component}
              </strong>
              {state === 'read-only' && <span className="text-xs text-text-muted">Read-only view</span>}
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
        activeModuleId={recipe}
        moduleContextRenderers={{
          SplitWorkspace: () => resolveShowcaseZoneRenderer(RECIPE_SHELL_USAGE.SplitWorkspace?.moduleContextSidebar?.contentKey)?.(),
          CreativeEditor: () => resolveShowcaseZoneRenderer(RECIPE_SHELL_USAGE.CreativeEditor?.moduleContextSidebar?.contentKey)?.(),
        }}
        moduleContextFooterRenderers={{
          SplitWorkspace: () => resolveShowcaseZoneFooterRenderer(RECIPE_SHELL_USAGE.SplitWorkspace?.moduleContextSidebar?.footer?.contentKey)?.(),
          CreativeEditor: () => resolveShowcaseZoneFooterRenderer(RECIPE_SHELL_USAGE.CreativeEditor?.moduleContextSidebar?.footer?.contentKey)?.(),
        }}
        moduleContextPanelRenderers={{
          SplitWorkspace: () =>
            isModuleContextPanelOpen
              ? resolveShowcaseZonePanelRenderer(RECIPE_SHELL_USAGE.SplitWorkspace?.moduleContextPanel?.contentKey)?.()
              : null,
          CreativeEditor: () =>
            isModuleContextPanelOpen
              ? resolveShowcaseZonePanelRenderer(RECIPE_SHELL_USAGE.CreativeEditor?.moduleContextPanel?.contentKey)?.()
              : null,
        }}
        moduleContextPanelFooterRenderers={{
          SplitWorkspace: () => resolveShowcaseZoneFooterRenderer(RECIPE_SHELL_USAGE.SplitWorkspace?.moduleContextPanel?.footer?.contentKey)?.(),
          CreativeEditor: () => resolveShowcaseZoneFooterRenderer(RECIPE_SHELL_USAGE.CreativeEditor?.moduleContextPanel?.footer?.contentKey)?.(),
        }}
        moduleContextPanelOnClose={() => setIsModuleContextPanelOpen(false)}
        moduleContextSidebarCollapsed={recipe === 'CreativeEditor' ? !isMediaLibraryOpen : undefined}
        moduleContextSidebarShowCollapsedTrigger={recipe !== 'CreativeEditor'}
        moduleContextSidebarOnCollapsedChange={(collapsed) => setIsMediaLibraryOpen(!collapsed)}
        contextualSidebarAction={(isRail) =>
          recipe === 'CreativeEditor' && !isMediaLibraryOpen ? (
            <button
              type="button"
              aria-label="Open Media Library"
              onClick={() => setIsMediaLibraryOpen(true)}
              className="text-accent border-accent/30 bg-accent/10 hover:bg-primary hover:text-white flex min-w-0 items-center gap-3 rounded-md border p-2 text-left text-xs font-semibold transition-colors"
            >
              <Menu aria-hidden="true" size={18} className="shrink-0" />
              {!isRail ? <span className="truncate">{RECIPE_SHELL_USAGE.CreativeEditor?.contextualAction?.label}</span> : null}
            </button>
          ) : null
        }
        canvasProps={{
          mode: RECIPE_CANVAS_MODES[recipe],
          header: recipe === 'SplitWorkspace' ? <SplitRecipeHeader /> : undefined,
          toolbar: recipe === 'SplitWorkspace' ? <SplitRecipeToolbar /> : undefined,
        }}
        onNavModeChange={setNavMode}
        onNavigate={(route) => {
          const selectedRecipe = new URL(route.routeId, window.location.origin).searchParams.get('recipe');
          if (selectedRecipe && selectedRecipe in FIXTURES) {
            setRecipe(selectedRecipe);
            router.push(route.routeId);
            return;
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
            timezoneOptions={[{ label: 'Auto detect', isActive: true }]}
            onOpenChange={() => undefined}
            onLogout={() => undefined}
          />
        }
        appShellProps={{ config: { activeOverlay: contextMode ? 'context' : null } }}
      >
        <main className={`min-h-full bg-shell-canvas text-text-main ${recipe === 'CreativeEditor' ? '' : 'p-3 sm:p-5'}`}>
          <section className={recipe === 'CreativeEditor' ? 'h-full' : 'mx-auto max-w-7xl'}>
            {recipe !== 'CreativeEditor' ? (
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="font-mono text-xs uppercase tracking-[0.16em]">{composition.recipe}</h1>
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
        <div className="overflow-x-auto">
          <div className="min-w-[20rem] sm:min-w-0">
            <CompositionGrid composition={composition} regions={regions} />
          </div>
        </div>
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
