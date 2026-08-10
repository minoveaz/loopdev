'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import type { MarketingAsset } from '@loopdev/contracts';

export const assetTypes = ['all', 'image', 'video', 'audio', 'document', 'logo', 'other'] as const;
export const assetStatuses = ['all', 'draft', 'in_review', 'approved', 'rejected', 'archived'] as const;

export type AssetType = (typeof assetTypes)[number];
export type AssetStatus = (typeof assetStatuses)[number];

type AssetManagerContextValue = {
  search: string;
  setSearch: (value: string) => void;
  type: AssetType;
  setType: (value: AssetType) => void;
  status: AssetStatus;
  setStatus: (value: AssetStatus) => void;
  selectedAsset: MarketingAsset | null;
  setSelectedAsset: (asset: MarketingAsset | null) => void;
};

const AssetManagerContext = createContext<AssetManagerContextValue | null>(null);

export function AssetManagerProvider({ children }: { children: React.ReactNode }) {
  const [search, setSearch] = useState('');
  const [type, setType] = useState<AssetType>('all');
  const [status, setStatus] = useState<AssetStatus>('all');
  const [selectedAsset, setSelectedAsset] = useState<MarketingAsset | null>(null);

  const value = useMemo(
    () => ({ search, setSearch, type, setType, status, setStatus, selectedAsset, setSelectedAsset }),
    [search, type, status, selectedAsset],
  );

  return <AssetManagerContext.Provider value={value}>{children}</AssetManagerContext.Provider>;
}

export function useAssetManager() {
  const context = useContext(AssetManagerContext);
  if (!context) throw new Error('useAssetManager must be used within AssetManagerProvider');
  return context;
}