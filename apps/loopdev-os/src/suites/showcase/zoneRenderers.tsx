import type { ReactNode } from 'react';
import { Button } from '@loopdev/ui';

const SplitContextSidebar = () => (
  <div className="flex h-full min-h-0 flex-col gap-3 p-4">
    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
      context sidebar
    </span>
    <strong className="text-sm text-text-main">Selection context</strong>
    <p className="text-xs leading-5 text-text-muted">
      The shell-owned context region stays outside the recipe grid.
    </p>
  </div>
);

const SplitContextPanel = () => (
  <div className="flex h-full min-h-0 flex-col gap-3 p-4">
    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
      context panel
    </span>
    <strong className="text-sm text-text-main">Record details</strong>
    <div className="border-border-technical bg-background rounded-md border p-3 text-xs leading-5 text-text-muted">
      The shell-owned detail panel complements the recipe&apos;s list and detail slots.
    </div>
  </div>
);

const CreativeEditorAssetSidebar = () => (
  <div className="flex h-full min-h-0 flex-col gap-4 p-4">
    <div className="border-border-technical flex items-start justify-between gap-3 border-b pb-3">
      <div>
        <h2 className="text-sm font-semibold text-text-main">Media Library</h2>
        <p className="mt-1 text-xs text-text-muted">Assets for the editor canvas</p>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-2">
      {[
        ['Video', 'Clips'],
        ['Image', 'Stills'],
        ['Audio', 'Tracks'],
        ['Template', 'Layouts'],
      ].map(([type, label]) => (
        <button
          key={type}
          type="button"
          className="border-border-technical bg-background hover:border-primary rounded-md border p-3 text-left transition-colors"
        >
          <span className="text-primary block font-mono text-[10px] uppercase tracking-[0.14em]">
            {type}
          </span>
          <strong className="mt-2 block text-xs text-text-main">{label}</strong>
        </button>
      ))}
    </div>
    <div className="border-border-technical bg-background flex-1 rounded-md border p-3">
      <span className="text-xs text-text-muted">Recent assets</span>
      <div className="mt-3 space-y-2">
        {['Product launch.mp4', 'Northstar still.png', 'Intro music.wav'].map((asset) => (
          <div
            key={asset}
            className="border-border-technical rounded border px-2 py-2 text-xs text-text-main"
          >
            {asset}
          </div>
        ))}
      </div>
    </div>
  </div>
);

const CreativeEditorMediaDetails = () => (
  <div className="flex h-full min-h-0 flex-col gap-4 p-4">
    <div>
      <h2 className="text-sm font-semibold text-text-main">Media Details</h2>
      <p className="mt-1 text-xs leading-5 text-text-muted">Properties for the selected canvas asset.</p>
    </div>
    <dl className="border-border-technical divide-border-technical divide-y rounded-md border text-xs">
      {[
        ['Asset', 'Product launch.mp4'],
        ['Duration', '00:12.40'],
        ['Format', 'MP4 / 1080p'],
        ['Status', 'Ready to edit'],
      ].map(([label, value]) => (
        <div key={label} className="px-3 py-2">
          <dt className="text-text-muted">{label}</dt>
          <dd className="mt-1 text-text-main">{value}</dd>
        </div>
      ))}
    </dl>
  </div>
);

export const SHOWCASE_ZONE_RENDERERS: Record<string, () => ReactNode> = {
  'split.context-sidebar': () => <SplitContextSidebar />,
  'creative-editor.media-library': () => <CreativeEditorAssetSidebar />,
};

export const SHOWCASE_ZONE_PANEL_RENDERERS: Record<string, () => ReactNode> = {
  'split.context-panel': () => <SplitContextPanel />,
  'creative-editor.media-details': () => <CreativeEditorMediaDetails />,
};

export const SHOWCASE_ZONE_FOOTER_RENDERERS: Record<string, () => ReactNode> = {
  'creative-editor.media-library-footer': () => (
    <Button variant="primary" size="sm" className="w-full justify-start">
      Upload media
    </Button>
  ),
  'split.context-sidebar-footer': () => (
    <div className="flex flex-col gap-2">
      <Button variant="outline" size="sm" className="w-full justify-start">
        View details
      </Button>
      <Button variant="outline" size="sm" className="w-full justify-start">
        Manage access
      </Button>
    </div>
  ),
  'split.context-panel-footer': () => (
    <Button variant="primary" size="sm" className="w-full justify-start">
      Apply changes
    </Button>
  ),
  'creative-editor.media-details-footer': () => (
    <div className="flex flex-col gap-2">
      <Button variant="primary" size="sm" className="w-full justify-start">
        Apply changes
      </Button>
      <Button variant="outline" size="sm" className="w-full justify-start">
        Reset properties
      </Button>
    </div>
  ),
};

export const resolveShowcaseZoneRenderer = (contentKey?: string) =>
  contentKey ? SHOWCASE_ZONE_RENDERERS[contentKey] : undefined;

export const resolveShowcaseZonePanelRenderer = (contentKey?: string) =>
  contentKey ? SHOWCASE_ZONE_PANEL_RENDERERS[contentKey] : undefined;

export const resolveShowcaseZoneFooterRenderer = (contentKey?: string) =>
  contentKey ? SHOWCASE_ZONE_FOOTER_RENDERERS[contentKey] : undefined;
