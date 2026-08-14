'use client';

import { useEffect, useState } from 'react';
import { Button, TechnicalSurface } from '@loopdev/ui';

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
      </div>
      <Checklist items={['Font family is token-backed', 'Weight communicates hierarchy', 'Line-height remains readable', 'Long labels do not clip', 'Labels work in mobile widths']} />
    </section>
  );
}

function SurfacesView() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {(['canvas', 'surface', 'elevated', 'overlay', 'glass'] as const).map((surface) => (
        <TechnicalSurface key={surface} variant={surface === 'canvas' ? 'canvas' : 'surface'} depth={surface === 'elevated' ? 'raised' : surface === 'overlay' ? 'overlay' : 'flat'} className="min-h-32 p-4">
          <span className="text-text-main text-sm font-semibold">{surface}</span>
          <p className="text-text-muted mt-2 text-xs">Review contrast, border, depth, scroll and nesting.</p>
        </TechnicalSurface>
      ))}
      <div className="border-border-technical bg-surface-dark col-span-full rounded-md border p-4 text-xs text-text-muted">Background rule: data-heavy views stay plain or subtle; grids and immersive treatments require evidence.</div>
    </div>
  );
}

function StatesView() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {stateItems.map((state) => (
        <article key={state} className="border-border-technical bg-background rounded-lg border p-4">
          <span className="text-accent font-mono text-xs uppercase">{state}</span>
          <p className="text-text-main mt-3 font-semibold">{state === 'ready' ? 'Content available' : 'State treatment'}</p>
          <p className="text-text-muted mt-1 text-xs">Confirm message, action, contrast, keyboard path and zone visibility.</p>
        </article>
      ))}
    </div>
  );
}

function ResponsiveView() {
  return (
    <div className="space-y-4">
      <div className="border-border-technical bg-background rounded-lg border p-4 text-sm text-text-muted">
        These are real viewport targets. Resize the browser or use Playwright at each width; the cards below are review instructions, not substitutes for the real fixtures.
      </div>
      {['Desktop 1440', 'Tablet 1024', 'Mobile 390'].map((viewport) => (
        <article key={viewport} className="border-border-technical bg-background rounded-lg border p-4">
          <div className="flex items-center justify-between gap-3"><h2 className="text-text-main font-semibold">{viewport}</h2><span className="text-accent text-xs">Review target</span></div>
          <a href="/composition-showcase?recipe=CreativeEditor" title={`Open CreativeEditor for ${viewport}`} className="border-border-technical bg-shell-canvas hover:border-primary mt-4 flex h-20 items-center justify-center rounded-md border text-xs text-text-muted">Open CreativeEditor at this viewport</a>
          <Checklist items={['No horizontal page overflow', 'Sidebar transformation is explicit', 'Panel becomes drawer/overlay', 'Touch targets remain usable', 'Timeline/table scroll is internal']} />
        </article>
      ))}
    </div>
  );
}

export default function VisualSystemShowcasePage() {
  const [tab, setTab] = useState<Tab>('Recipes');
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const content = { Recipes: <RecipesView />, Typography: <TypographyView />, Surfaces: <SurfacesView />, States: <StatesView />, Responsive: <ResponsiveView /> }[tab];

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
