'use client';

import { useEffect, useState } from 'react';
import { Button, EmptyState, LoadingState, Skeleton, TechnicalSurface } from '@loopdev/ui';

const tabs = ['Recipes', 'Typography', 'Surfaces', 'States', 'Responsive'] as const;
type Tab = (typeof tabs)[number];
type ThemeMode = 'light' | 'dark';

const recipes = [
  ['SuiteOverview', 'overview', 'Summary, visual canvas, metrics and activity'],
  ['DataWorkspace', 'data', 'Filters, table and pagination'],
  ['RecordWorkspace', 'workspace', 'Record, tabs, activity and inspector'],
  ['SplitWorkspace', 'split', 'List, detail and contextual zones'],
  ['BoardWorkspace', 'board', 'Board density, cards and metrics'],
  ['CreativeEditor', 'full-bleed', 'Media library, stage, transport and timeline'],
] as const;

const stateItems = ['ready', 'loading', 'empty', 'error', 'forbidden', 'read-only', 'offline', 'stale', 'conflict'];

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 grid gap-2 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item} title={`Check: ${item}`} className="border-border-technical bg-background flex items-center gap-2 rounded-md border px-3 py-2 text-xs text-text-muted">
          <span className="text-accent" aria-hidden="true">□</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

function RecipesView() {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {recipes.map(([name, mode, purpose]) => (
        <article key={name} className="border-border-technical bg-background rounded-lg border p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-text-main font-semibold">{name}</h2>
            <span className="text-accent font-mono text-[10px] uppercase">{mode}</span>
          </div>
          <p className="mt-2 text-sm text-text-muted">{purpose}</p>
          <div className="mt-4 grid min-h-24 grid-cols-12 gap-1 rounded-md bg-shell-canvas p-2">
            <span className="col-span-12 rounded bg-primary/30" />
            <span className="col-span-7 rounded bg-accent/30" />
            <span className="col-span-5 rounded bg-primary/20" />
            <span className="col-span-12 rounded bg-surface-elevated" />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[11px] text-text-muted">Review: zones, spans, density, scroll and responsive transformation.</p>
            <a
              href={`/composition-showcase?recipe=${name}`}
              title={`Open real ${name} fixture`}
              aria-label={`Open real ${name} fixture`}
              className="text-accent hover:bg-primary hover:text-white rounded-md border border-accent/40 px-3 py-2 text-xs font-semibold transition-colors"
            >
              Open real fixture
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}

function TypographyView() {
  return (
    <section className="border-border-technical bg-background rounded-lg border p-5">
      <p className="text-text-muted text-xs uppercase tracking-[0.18em]">Token type scale</p>
      <div className="mt-6 space-y-5">
        <div><span className="text-text-muted text-xs">Display / page title</span><p className="text-text-main text-3xl font-semibold">Operational overview</p></div>
        <div><span className="text-text-muted text-xs">Heading / section</span><p className="text-text-main text-xl font-semibold">Recent activity</p></div>
        <div><span className="text-text-muted text-xs">Body / supporting</span><p className="text-text-muted text-sm">Use semantic type tokens and verify expansion with translated content.</p></div>
        <div><span className="text-text-muted text-xs">Caption / metadata</span><p className="text-text-muted font-mono text-[10px] uppercase tracking-[0.16em]">Updated today · ready</p></div>
        <div><span className="text-text-muted text-xs">JetBrains Mono / technical</span><p className="text-text-main font-mono text-sm">module.crm.contacts · 2026-08-14T16:20Z</p><p className="text-text-muted mt-1 font-mono text-[10px]">tenant_id=acme_042 · trace=7f31c8</p></div>
      </div>
      <Checklist items={['Font family is token-backed', 'Weight communicates hierarchy', 'Line-height remains readable', 'Long labels do not clip', 'Labels work in mobile widths']} />
    </section>
  );
}

function SurfacesView() {
  const surfaces = [
    { name: 'canvas', variant: 'canvas' as const, depth: 'flat' as const, radius: 'sm' as const, border: 'technical' as const, grid: true },
    { name: 'surface', variant: 'surface' as const, depth: 'flat' as const, radius: 'md' as const, border: 'subtle' as const, grid: false },
    { name: 'elevated', variant: 'surface' as const, depth: 'raised' as const, radius: 'lg' as const, border: 'technical' as const, grid: false },
    { name: 'overlay', variant: 'surface' as const, depth: 'overlay' as const, radius: 'lg' as const, border: 'strong' as const, grid: false },
    { name: 'glass', variant: 'glass' as const, depth: 'raised' as const, radius: 'lg' as const, border: 'strong' as const, grid: false },
  ];

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {surfaces.map((surface) => (
        <TechnicalSurface key={surface.name} variant={surface.variant} depth={surface.depth} radius={surface.radius} border={surface.border} withGrid={surface.grid} className="min-h-32 p-4">
          <span className="text-text-main text-sm font-semibold">{surface.name}</span>
          <p className="text-text-muted mt-2 text-xs">Review color, radius, border, depth and grid policy.</p>
        </TechnicalSurface>
      ))}
      <div className="border-border-technical bg-surface-dark col-span-full rounded-md border p-4 text-xs text-text-muted">Background rule: data-heavy views stay plain or subtle; grids and immersive treatments require evidence.</div>
      </div>
      <section className="border-border-technical bg-shell-canvas rounded-lg border p-5">
        <h2 className="text-text-main font-semibold">Nesting and contrast combinations</h2>
        <p className="text-text-muted mt-1 text-sm">Review hierarchy, readable text and borders through the real surface stack.</p>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <TechnicalSurface variant="canvas" radius="sm" border="technical" borderWidth="medium" withGrid className="p-5"><span className="text-text-muted text-xs">canvas → surface → elevated</span><TechnicalSurface variant="surface" radius="md" border="subtle" className="mt-4 p-4"><TechnicalSurface variant="surface" depth="raised" radius="lg" border="technical" className="p-4"><strong className="text-text-main">Readable elevated content</strong><p className="text-text-muted mt-1 text-xs">Text and border remain distinct.</p></TechnicalSurface></TechnicalSurface></TechnicalSurface>
          <TechnicalSurface variant="canvas" radius="sm" border="technical" borderWidth="medium" withGrid><span className="text-text-muted text-xs">canvas → surface → overlay</span><TechnicalSurface variant="surface" radius="md" border="subtle" className="mt-4 p-4"><TechnicalSurface variant="surface" depth="overlay" radius="lg" border="strong" className="p-4"><strong className="text-text-main">Overlay surface</strong><p className="text-text-muted mt-1 text-xs">Does not obscure context.</p></TechnicalSurface></TechnicalSurface></TechnicalSurface>
          <TechnicalSurface variant="canvas" radius="sm" border="technical" borderWidth="medium" withGrid><span className="text-text-muted text-xs">canvas → glass → surface</span><TechnicalSurface variant="glass" depth="raised" radius="lg" border="strong" className="mt-4 p-4"><TechnicalSurface variant="surface" radius="md" border="subtle" className="p-4"><strong className="text-text-main">Glass treatment</strong><p className="text-text-muted mt-1 text-xs">Requires contrast and performance evidence.</p></TechnicalSurface></TechnicalSurface></TechnicalSurface>
        </div>
      </section>
    </div>
  );
}

function StatesView({ state, onStateChange }: { state: string; onStateChange: (nextState: string) => void }) {
  const stateCopy: Record<string, { title: string; message: string; action: string; tone: string }> = {
    ready: { title: 'Content available', message: 'Summary, metrics and activity are ready to review.', action: 'View details', tone: 'border-brand-cyan/50 bg-brand-cyan/10' },
    loading: { title: 'Loading workspace', message: 'Keep the final geometry stable while content is loading.', action: 'Cancel', tone: 'border-primary/50 bg-primary/10' },
    empty: { title: 'Nothing here yet', message: 'Explain what the user can create and offer one clear next step.', action: 'Create first item', tone: 'border-accent/50 bg-accent/10' },
    error: { title: 'Unable to load', message: 'Explain the failure and provide a recovery action.', action: 'Retry', tone: 'border-danger/50 bg-danger/10' },
    forbidden: { title: 'Access restricted', message: 'Differentiate permission failure from an empty result.', action: 'Request access', tone: 'border-danger/50 bg-danger/10' },
    'read-only': { title: 'Read-only view', message: 'Keep content visible while mutation actions are unavailable.', action: 'View policy', tone: 'border-border-technical bg-surface-elevated' },
    offline: { title: 'Offline mode', message: 'Connection is unavailable. Keep cached data visible and make synchronization status explicit.', action: 'Retry connection', tone: 'border-danger/50 bg-danger/10' },
    stale: { title: 'Data may be stale', message: 'Connection is available, but this content needs a freshness check before it is trusted.', action: 'Refresh data', tone: 'border-accent/50 bg-accent/10' },
    conflict: { title: 'Conflict detected', message: 'Show the conflict and provide a resolution path.', action: 'Resolve conflict', tone: 'border-danger/50 bg-danger/10' },
  };
  const activeState = stateCopy[state] ?? stateCopy.ready;
  const isLoading = state === 'loading';
  const isEmptyState = state === 'empty' || state === 'error' || state === 'forbidden';

  const composition = (
    <div className="grid min-h-56 grid-cols-12 gap-3 rounded-md bg-shell-canvas/60 p-4">
      {isLoading ? (
        <>
          <div className="col-span-7 rounded-md bg-surface-elevated/80 p-4"><Skeleton className="h-3 w-20" /><Skeleton className="mt-4 h-8 w-16" /><LoadingState label="Loading summary" lines={2} className="mt-4" /></div>
          <div className="col-span-5 rounded-md bg-surface-elevated/50 p-4"><Skeleton className="h-full min-h-24 w-full" /></div>
          <div className="col-span-12 rounded-md bg-surface-elevated/50 p-4"><LoadingState label="Loading activity" lines={3} /></div>
        </>
      ) : (
        <>
          <div className="col-span-7 rounded-md bg-surface-elevated/80 p-4"><span className="text-text-muted text-xs">Summary</span><strong className="text-text-main mt-3 block text-2xl">24</strong></div>
          <div className="col-span-5 rounded-md bg-surface-elevated/50 p-4"><span className="text-text-muted text-xs">Visual canvas</span></div>
          <div className="col-span-12 rounded-md bg-surface-elevated/50 p-4"><span className="text-text-muted text-xs">Activity feed</span></div>
        </>
      )}
      {state === 'offline' && <div className="col-span-12 rounded-md border border-danger/40 bg-danger/10 px-3 py-2 text-xs text-danger">Connection unavailable · showing cached data</div>}
      {state === 'stale' && <div className="col-span-12 rounded-md border border-accent/40 bg-accent/10 px-3 py-2 text-xs text-accent">Last synchronized recently · refresh before acting</div>}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="border-border-technical bg-background rounded-lg border p-4 text-sm text-text-muted">Each state is applied to the same SuiteOverview geometry. Compare message, action, contrast and zone visibility without layout jumps.</div>
      <section className={`border-2 rounded-lg p-6 ${activeState.tone}`}>
        {isEmptyState ? (
          <EmptyState
            icon={state === 'error' ? 'error' : state === 'forbidden' ? 'lock' : 'inbox'}
            title={activeState.title}
            description={activeState.message}
            variant="ghost"
            action={<Button variant={state === 'empty' ? 'primary' : state === 'error' ? 'danger' : 'outline'} size="sm" onClick={() => onStateChange('ready')}>{activeState.action}</Button>}
          />
        ) : (
          <>
            {composition}
            <div className="mt-5"><span className="text-accent font-mono text-xs uppercase">{state}</span><h2 className="text-text-main mt-2 text-xl font-semibold">{activeState.title}</h2><p className="text-text-muted mt-1 text-sm">{activeState.message}</p><Button variant={state === 'conflict' ? 'danger' : 'outline'} size="sm" className="mt-4" onClick={() => onStateChange(state === 'conflict' || state === 'loading' ? 'ready' : state)}>{activeState.action}</Button></div>
          </>
        )}
      </section>
      <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {stateItems.map((item) => <button key={item} type="button" title={`Show ${item} state`} aria-pressed={state === item} onClick={() => onStateChange(item)} className={`rounded-md border px-3 py-2 text-left text-xs font-semibold ${state === item ? 'border-primary bg-primary text-white' : 'border-border-technical bg-background text-text-muted hover:border-primary'}`}>{item}</button>)}
      </div>
    </div>
  );
}

function ResponsiveView() {
  const viewportPreviews = [
    { label: 'Desktop 1440', width: 'max-w-5xl', layout: 'grid-cols-[auto_1fr_auto]', sidebar: 'w-20', panel: 'w-28', note: 'Full shell with persistent navigation and context panel' },
    { label: 'Tablet 1024', width: 'max-w-2xl', layout: 'grid-cols-[auto_1fr]', sidebar: 'w-14', panel: 'hidden', note: 'Compact navigation; context panel becomes an explicit action' },
    { label: 'Mobile 390', width: 'max-w-xs', layout: 'grid-cols-1', sidebar: 'hidden', panel: 'hidden', note: 'Single canvas column; navigation and panels become touch surfaces' },
  ] as const;

  return (
    <div className="space-y-4">
      <div className="border-border-technical bg-background rounded-lg border p-4 text-sm text-text-muted">
        These are real viewport targets. Resize the browser or use Playwright at each width; the cards below are review instructions, not substitutes for the real fixtures.
      </div>
      {viewportPreviews.map(({ label: viewport, width, layout, sidebar, panel, note }) => (
        <article key={viewport} className="border-border-technical bg-background rounded-lg border p-4">
          <div className="flex items-center justify-between gap-3"><h2 className="text-text-main font-semibold">{viewport}</h2><span className="text-accent text-xs">Review target</span></div>
          <p className="text-text-muted mt-1 text-xs">{note}</p>
          <div className={`border-border-technical bg-shell-canvas mx-auto mt-4 overflow-hidden rounded-lg border-2 p-2 shadow-xl ${width}`}>
            <div className="border-border-technical bg-surface-dark flex h-8 items-center gap-1 rounded-t-md border px-3"><span className="size-2 rounded-full bg-danger" /><span className="size-2 rounded-full bg-accent" /><span className="size-2 rounded-full bg-brand-cyan" /><span className="text-text-muted ml-2 text-[9px]">loopdev.local / suite-overview</span></div>
            <div className={`mt-2 grid min-h-48 gap-2 ${layout}`}>
              <div className={`border-border-technical bg-surface-dark min-w-0 rounded-md border p-2 ${sidebar}`}><span className="text-text-muted block max-w-full break-words text-[9px] leading-tight">SuiteSidebar</span><div className="mt-3 space-y-2"><span className="bg-primary/70 block h-2 rounded" /><span className="bg-surface-elevated block h-2 rounded" /><span className="bg-surface-elevated block h-2 rounded" /></div></div>
              <div className="border-border-technical bg-surface-light dark:bg-surface-dark rounded-md border p-2"><span className="text-text-muted text-[9px]">SuiteCanvas</span><div className="mt-2 grid grid-cols-2 gap-2"><span className="bg-primary/30 block h-14 rounded" /><span className="bg-surface-elevated block h-14 rounded" /><span className="bg-accent/30 col-span-2 block h-8 rounded" /></div><div className="bg-surface-elevated mt-2 h-5 rounded" /></div>
              <div className={`border-border-technical bg-surface-elevated rounded-md border p-2 ${panel}`}><span className="text-text-muted text-[9px]">ContextPanel</span><div className="bg-background mt-3 h-16 rounded" /></div>
            </div>
            <div className="border-border-technical bg-surface-elevated mt-2 h-5 rounded-md border px-2"><span className="text-text-muted text-[9px]">Footer / status</span></div>
          </div>
          <a href="/composition-showcase?recipe=SuiteOverview" title={`Open SuiteOverview for ${viewport}`} className="text-accent hover:text-primary mt-3 inline-block text-xs font-semibold">Open real SuiteOverview at this viewport</a>
          <Checklist items={['No horizontal page overflow', 'Sidebar transformation is explicit', 'Panel becomes drawer/overlay', 'Touch targets remain usable', 'Timeline/table scroll is internal']} />
        </article>
      ))}
    </div>
  );
}

export default function VisualSystemShowcasePage() {
  const [tab, setTab] = useState<Tab>('Recipes');
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [state, setState] = useState('ready');
  const content = { Recipes: <RecipesView />, Typography: <TypographyView />, Surfaces: <SurfacesView />, States: <StatesView state={state} onStateChange={setState} />, Responsive: <ResponsiveView /> }[tab];

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.classList.toggle('light', theme === 'light');
    return () => {
      root.classList.add('dark');
      root.classList.remove('light');
    };
  }, [theme]);

  return (
    <main className={`${theme === 'dark' ? 'dark' : 'light'} min-h-screen bg-shell-canvas p-4 text-text-main sm:p-6 lg:p-8`}>
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-4"><div><p className="text-text-muted font-mono text-xs uppercase tracking-[0.18em]">LoopDev visual certification</p><h1 className="mt-2 text-3xl font-semibold">SaaS visual system showcase</h1><p className="text-text-muted mt-2 max-w-3xl text-sm">Review each fixture before composing CRM screens. This page shows what to inspect and where the contract applies.</p></div><div className="border-border-technical bg-background flex shrink-0 gap-1 rounded-md border p-1" aria-label="Color mode"><Button variant={theme === 'light' ? 'primary' : 'ghost'} size="sm" onClick={() => setTheme('light')}>Light</Button><Button variant={theme === 'dark' ? 'primary' : 'ghost'} size="sm" onClick={() => setTheme('dark')}>Dark</Button></div></header>
        <nav className="mb-6 flex flex-wrap gap-2" aria-label="Visual certification views">
          {tabs.map((item) => <Button key={item} variant={tab === item ? 'primary' : 'outline'} size="sm" onClick={() => setTab(item)}>{item}</Button>)}
        </nav>
        {content}
      </div>
    </main>
  );
}
