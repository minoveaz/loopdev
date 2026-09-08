import type { ReactNode } from 'react';
import { Button, Heading } from '@loopdev/ui';

const SplitContextSidebar = () => (
  <div className="flex h-full min-h-0 flex-col gap-3 p-4">
    <span className="text-text-muted font-mono text-[10px] uppercase tracking-[0.18em]">
      context sidebar
    </span>
    <strong className="text-text-main text-sm">Selection context</strong>
    <p className="text-text-muted text-xs leading-5">
      The shell-owned context region stays outside the recipe grid.
    </p>
  </div>
);

const SplitContextPanel = () => (
  <div className="flex h-full min-h-0 flex-col gap-3 p-4">
    <span className="text-text-muted font-mono text-[10px] uppercase tracking-[0.18em]">
      context panel
    </span>
    <strong className="text-text-main text-sm">Record details</strong>
    <div className="border-border-technical bg-background text-text-muted rounded-md border p-3 text-xs leading-5">
      The shell-owned detail panel complements the recipe&apos;s list and detail slots.
    </div>
  </div>
);

const CreativeEditorAssetSidebar = () => (
  <div className="flex h-full min-h-0 flex-col gap-4 p-4">
    <div className="border-border-technical flex items-start justify-between gap-3 border-b pb-3">
      <div>
        <Heading as="h2" size="sm" weight="bold" className="text-text-main">
          Media Library
        </Heading>
        <p className="text-text-muted mt-1 text-xs">Assets for the editor canvas</p>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-2">
      {[
        ['Video', 'Clips'],
        ['Image', 'Stills'],
        ['Audio', 'Tracks'],
        ['Template', 'Layouts'],
      ].map(([type, label]) => (
        <Button
          key={type}
          type="button"
          variant="outline"
          className="h-auto justify-start p-3 text-left"
        >
          <span className="text-primary block font-mono text-[10px] uppercase tracking-[0.14em]">
            {type}
          </span>
          <strong className="text-text-main mt-2 block text-xs">{label}</strong>
        </Button>
      ))}
    </div>
    <div className="border-border-technical bg-background flex-1 rounded-md border p-3">
      <span className="text-text-muted text-xs">Recent assets</span>
      <div className="mt-3 space-y-2">
        {['Product launch.mp4', 'Northstar still.png', 'Intro music.wav'].map((asset) => (
          <div
            key={asset}
            className="border-border-technical text-text-main rounded border px-2 py-2 text-xs"
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
      <Heading as="h2" size="sm" weight="bold" className="text-text-main">
        Media Details
      </Heading>
      <p className="text-text-muted mt-1 text-xs leading-5">
        Properties for the selected canvas asset.
      </p>
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
          <dd className="text-text-main mt-1">{value}</dd>
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
