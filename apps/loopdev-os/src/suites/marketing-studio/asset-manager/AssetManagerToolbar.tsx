'use client';

import {
  Button,
  IconButton,
  Input,
  ModuleToolbar,
  Select,
} from '@loopdev/ui';
import { assetStatuses, assetTypes, useAssetManager } from './context';

export function AssetManagerToolbar() {
  const { search, setSearch, type, setType, status, setStatus } = useAssetManager();

  return (
    <ModuleToolbar
      left={
        <div className="flex min-w-max flex-1 flex-nowrap items-center gap-2">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search assets"
            aria-label="Search assets"
            size="sm"
            fullWidth={false}
            className="w-56 min-w-56 flex-none"
          />
          <Select value={type} onChange={(event) => setType(event.target.value as typeof type)} aria-label="Filter by type" size="sm" fullWidth={false} className="min-w-32">
            <option value="all" className="bg-surface-light text-text-main dark:bg-surface-dark dark:text-white">All types</option>
            {assetTypes.slice(1).map((value) => <option key={value} value={value} className="bg-surface-light text-text-main dark:bg-surface-dark dark:text-white">{value}</option>)}
          </Select>
          <Select value={status} onChange={(event) => setStatus(event.target.value as typeof status)} aria-label="Filter by approval status" size="sm" fullWidth={false} className="min-w-36">
            <option value="all" className="bg-surface-light text-text-main dark:bg-surface-dark dark:text-white">All statuses</option>
            {assetStatuses.slice(1).map((value) => <option key={value} value={value} className="bg-surface-light text-text-main dark:bg-surface-dark dark:text-white">{value}</option>)}
          </Select>
        </div>
      }
      center={
        <IconButton icon="grid_view" size="sm" variant="primary" aria-label="Grid view" />
      }
      right={
        <div className="flex items-center gap-2">
          <Button type="button" variant="primary" size="sm" startIcon="cloud_upload" disabled>
            Upload asset
          </Button>
        </div>
      }
    />
  );
}
