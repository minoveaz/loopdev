'use client';

import { useState } from 'react';
import {
  IconButton,
  ModuleHeader,
  ModuleSidebar,
  ModuleWorkspace,
  SidebarFlyout,
  UnifiedInspector,
} from '@loopdev/ui';
import type { InspectorContext, InspectorTabId } from '@loopdev/ui';
import type { NavModuleItem } from '@loopdev/contracts';
import { MARKETING_STUDIO_SCHEMA } from '@loopdev/ui';
import { AssetManagerProvider, useAssetManager } from '@/suites/marketing-studio/asset-manager/context';
import { ASSET_MANAGER_FLYOUT, ASSET_MANAGER_NAV_GROUPS } from '@/suites/marketing-studio/asset-manager/navigation';
import { AssetManagerToolbar } from '@/suites/marketing-studio/asset-manager/AssetManagerToolbar';

function AssetManagerWorkspace({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState('library.all');
  const [activeInspectorTab, setActiveInspectorTab] = useState<InspectorTabId>('context');
  const { selectedAsset, setSelectedAsset } = useAssetManager();
  const assetRoute = MARKETING_STUDIO_SCHEMA.groups.flatMap((group) => group.items).find((item): item is NavModuleItem => item.kind === 'module' && item.moduleId === 'asset-manager')?.route.routeId ?? '/marketing-studio/dam';
  const suiteRoute = MARKETING_STUDIO_SCHEMA.suite.route?.routeId ?? '/marketing-studio';
  const inspectorContext: InspectorContext = {
    scope: selectedAsset ? 'entity' : 'module',
    mode: selectedAsset?.approvalStatus === 'draft' ? 'draft' : 'read',
    intent: 'inspect',
    entity: selectedAsset ? { moduleId: 'asset-manager', type: `asset.${selectedAsset.type}`, id: selectedAsset.id, name: selectedAsset.name } : undefined,
    permissions: { canEdit: false, canApprove: false, canPublish: false, canOverride: false },
  };

  return (
    <ModuleWorkspace
      moduleId="asset-manager"
      sidebarOpen={sidebarOpen}
      flyoutOpen={flyoutOpen}
      inspectorOpen={Boolean(selectedAsset)}
      onSidebarChange={setSidebarOpen}
      onFlyoutChange={setFlyoutOpen}
      onInspectorChange={(open) => { if (!open) setSelectedAsset(null); }}
      config={{ sidebarWidth: '280px', flyoutWidth: '320px', inspectorWidth: '420px' }}
      a11y={{ moduleLabel: 'Asset Manager', inspectorLabel: 'Asset details' }}
      sidebarSlot={<ModuleSidebar mode="brand" navGroups={ASSET_MANAGER_NAV_GROUPS} activeRouteId={activeSectionId} onNavigate={(sectionId) => { setActiveSectionId(sectionId); setFlyoutOpen(true); }} footerAction={{ label: 'Upload asset', icon: 'cloud_upload', disabled: true }} />}
      flyoutSlot={<SidebarFlyout {...ASSET_MANAGER_FLYOUT} onClose={() => setFlyoutOpen(false)} />}
      headerSlot={
        <ModuleHeader
          segments={[
            { id: 'suite', label: MARKETING_STUDIO_SCHEMA.suite.suiteName, href: suiteRoute },
            { id: 'module', label: 'Asset Manager', href: assetRoute },
          ]}
          sidebarToggle={{ isOpen: sidebarOpen, onToggle: () => setSidebarOpen((open) => !open) }}
          rightSlot={<IconButton icon="info" variant={selectedAsset ? 'primary' : 'ghost'} size="sm" aria-label="Open asset inspector" onClick={() => selectedAsset && setSelectedAsset(selectedAsset)} />}
        />
      }
      toolbarSlot={<AssetManagerToolbar />}
      inspectorSlot={
        <UnifiedInspector context={inspectorContext} isOpen={Boolean(selectedAsset)} onClose={() => setSelectedAsset(null)} activeTab={activeInspectorTab} onTabChange={setActiveInspectorTab}>
          {selectedAsset && <div className="space-y-4"><div><p className="text-xs font-semibold uppercase text-text-muted">Name</p><p className="text-sm font-semibold text-text-main">{selectedAsset.name}</p></div><div><p className="text-xs font-semibold uppercase text-text-muted">Storage path</p><p className="break-all font-mono text-xs text-text-muted">{selectedAsset.storagePath}</p></div><div><p className="text-xs font-semibold uppercase text-text-muted">Status</p><p className="text-sm text-text-main">{selectedAsset.approvalStatus}</p></div></div>}
        </UnifiedInspector>
      }
    >
      {children}
    </ModuleWorkspace>
  );
}

export default function AssetManagerLayout({ children }: { children: React.ReactNode }) {
  return <AssetManagerProvider><AssetManagerWorkspace>{children}</AssetManagerWorkspace></AssetManagerProvider>;
}
