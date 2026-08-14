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

export default function CompositionShowcasePage() {
  const [recipe, setRecipe] = useState('SuiteOverview');
  const composition = FIXTURES[recipe];
  const regions = useMemo(
    () =>
      Object.fromEntries(
        composition.regions.map((region) => [
          region.id,
          <TechnicalSurface key={region.id} variant="surface" depth="flat" className={regionClass(region.component)}>
            <div className="flex h-full min-h-[inherit] flex-col justify-between p-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
                {region.slot}
              </span>
              <strong className="text-sm text-text-main">{region.component}</strong>
            </div>
          </TechnicalSurface>,
        ]),
      ),
    [composition],
  );

  return (
    <main className="min-h-screen bg-shell-canvas p-6 text-text-main">
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
      </header>
      <section className="mx-auto max-w-7xl rounded-xl border border-border-technical bg-surface-dark/20 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-mono text-xs uppercase tracking-[0.16em]">{composition.recipe}</h2>
          <span className="text-xs text-text-muted">
            {composition.grid.columns} columns / {composition.grid.gap} gap
          </span>
        </div>
        <CompositionGrid composition={composition} regions={regions} />
      </section>
    </main>
  );
}
