'use client';

import { useMemo } from 'react';
import { Badge, Heading, LpdText, TechnicalCard } from '@loopdev/ui';
import type { MarketingAsset } from '@loopdev/contracts';
import { marketingFixtureAssets } from '@/services/marketing/fixtures/marketing-data';
import { useAssetManager } from './context';

function AssetPreview({ asset, large = false }: { asset: MarketingAsset; large?: boolean }) {
  const isImage = asset.mimeType.startsWith('image/');
  return (
    <div className={`flex ${large ? 'aspect-video' : 'aspect-[4/3]'} bg-surface-light dark:bg-surface-dark items-center justify-center overflow-hidden`}>
      {isImage ? (
        <div className="from-primary/10 via-surface-elevated to-accent/10 flex h-full w-full items-center justify-center bg-gradient-to-br">
          <span className="material-symbols-outlined text-primary/60 text-5xl">image</span>
        </div>
      ) : (
        <span className="material-symbols-outlined text-text-muted text-4xl">insert_drive_file</span>
      )}
    </div>
  );
}

function AssetCard({ asset, selected, onSelect }: { asset: MarketingAsset; selected: boolean; onSelect: () => void }) {
  return (
    <button type="button" onClick={onSelect} className="min-w-0 text-left" aria-pressed={selected}>
      <TechnicalCard variant={selected ? 'interactive' : 'flat'} className={selected ? 'border-primary ring-primary/30 ring-1' : ''}>
        <AssetPreview asset={asset} />
        <div className="space-y-2 p-4">
          <div className="flex items-start justify-between gap-3">
            <Heading as="h3" size="sm" className="truncate">{asset.name}</Heading>
            <Badge status={asset.approvalStatus === 'approved' ? 'success' : 'neutral'}>{asset.approvalStatus}</Badge>
          </div>
          <LpdText size="xs" className="text-text-muted">{asset.type} · {asset.mimeType}</LpdText>
          <LpdText size="nano" className="text-text-muted">{asset.sizeBytes.toLocaleString()} bytes</LpdText>
        </div>
      </TechnicalCard>
    </button>
  );
}

export function AssetManagerView() {
  const { search, type, status, selectedAsset, setSelectedAsset } = useAssetManager();

  const assets = useMemo(() => marketingFixtureAssets.filter((asset) => {
    const matchesSearch = asset.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = type === 'all' || asset.type === type;
    const matchesStatus = status === 'all' || asset.approvalStatus === status;
    return matchesSearch && matchesType && matchesStatus;
  }), [search, status, type]);
  return (
    <div className="flex h-full min-h-0 flex-col gap-6 p-6">
      <div className="flex items-center justify-between"><div><LpdText size="sm" weight="bold">{assets.length} assets</LpdText><LpdText size="xs" className="text-text-muted">Offline development fixtures</LpdText></div></div>
      {assets.length === 0 ? <div className="border-border-subtle rounded-xl border p-10 text-center"><Heading size="sm">No assets found</Heading><LpdText className="text-text-muted mt-2">Adjust the search or filters.</LpdText></div> : <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">{assets.map((asset) => <AssetCard key={asset.id} asset={asset} selected={asset.id === selectedAsset?.id} onSelect={() => setSelectedAsset(asset)} />)}</div>}
    </div>
  );
}
