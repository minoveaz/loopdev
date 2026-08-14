'use client';

import { useMemo, useState } from 'react';
import {
  BOARD_WORKSPACE_COMPOSITION,
  CompositionGrid,
  CREATIVE_EDITOR_COMPOSITION,
  DATA_WORKSPACE_COMPOSITION,
  IMMERSIVE_WORKFLOW_COMPOSITION,
  RECORD_WORKSPACE_COMPOSITION,
  SPLIT_WORKSPACE_COMPOSITION,
  SUITE_OVERVIEW_COMPOSITION,
  TechnicalSurface,
} from '@loopdev/ui';
import type { ViewComposition } from '@loopdev/contracts';

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

export default function CompositionShowcasePage() {
  const [recipe, setRecipe] = useState('SuiteOverview');
  const [state, setState] = useState<ShowcaseState>('ready');
  const composition = FIXTURES[recipe];
  const regions = useMemo(
    () =>
      Object.fromEntries(
        composition.regions.map((region) => [
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
    [composition, state],
  );

  return (
    <main className="min-h-screen bg-shell-canvas p-4 text-text-main sm:p-6">
      <header className="mx-auto mb-6 max-w-7xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted">LoopDev composition showcase</p>
        <h1 className="mt-2 text-3xl font-semibold">Recipe reference fixtures</h1>
        <p className="mt-2 max-w-3xl text-sm text-text-muted">
          Neutral compositions for platform and design review. These fixtures demonstrate structure, slots and
          bounded spans; they are not product screens.
        </p>
        <nav className="mt-5 flex flex-wrap gap-2" aria-label="Composition recipes">
          {Object.keys(FIXTURES).map((fixtureName) => (
            <button
              key={fixtureName}
              type="button"
              onClick={() => setRecipe(fixtureName)}
              className={`rounded-md border px-3 py-2 text-xs ${
                recipe === fixtureName ? 'border-primary bg-primary text-white' : 'border-border-technical'
              }`}
            >
              {fixtureName}
            </button>
          ))}
        </nav>
        <nav className="mt-3 flex flex-wrap gap-2" aria-label="Showcase states">
          {STATES.map((nextState) => (
            <button
              key={nextState}
              type="button"
              onClick={() => setState(nextState)}
              className={`rounded-md border px-3 py-2 text-xs capitalize ${
                state === nextState ? 'border-primary bg-primary text-white' : 'border-border-technical'
              }`}
            >
              {nextState}
            </button>
          ))}
        </nav>
      </header>
      <section className="mx-auto max-w-7xl rounded-xl border border-border-technical bg-surface-dark/20 p-3 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-mono text-xs uppercase tracking-[0.16em]">{composition.recipe}</h2>
          <span className="text-xs text-text-muted">
            {composition.grid.columns} columns / {composition.grid.gap} gap / {state}
          </span>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[20rem] sm:min-w-0">
            <CompositionGrid composition={composition} regions={regions} />
          </div>
        </div>
      </section>
    </main>
  );
}
