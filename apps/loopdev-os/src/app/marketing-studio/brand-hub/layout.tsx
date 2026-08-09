'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { usePathname, useRouter, useParams } from 'next/navigation';
import { BrandStatusSchema, type NavGroup } from '@loopdev/contracts';
import {
  ModuleWorkspace,
  ModuleHeader,
  ModuleSidebar,
  SidebarFlyout,
  IconButton,
  UnifiedInspector,
  InspectorContext,
} from '@loopdev/ui';
import type { InspectorTabId } from '@loopdev/ui';
import { useBrands } from '@/hooks/brand-hub/useBrands';
import { useActiveBrand } from '@/hooks/brand-hub/useActiveBrand';
import { MOCK_NAV_GROUPS } from '@/data/mock-brands';
import { BRAND_HUB_FLYOUT_DATA } from '@/suites/marketing-studio/brand-hub/fixtures/flyout-data';
import { BrandHubProvider, useBrandHub } from '@/suites/marketing-studio/brand-hub/context';
import { BrandToolbar } from '@/suites/marketing-studio/brand-hub/components/BrandToolbar';
import { BrandInspector } from '@/suites/marketing-studio/brand-hub/components/BrandInspector';

/**
 * @layout BrandHubLayoutInner
 * @description Implementación interna del layout con estados de carga y gobernanza unificada.
 */
function BrandHubLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const { selectedEntity, isInspectorOpen, setInspectorOpen, setActiveBrand, activeBrand } =
    useBrandHub();

  // 1. Datos Reales
  const { data: brands = [], isLoading: isBrandsLoading } = useBrands();
  const brandId = params?.brandId as string;
  const { data: currentBrand, isLoading: isBrandLoading } = useActiveBrand(brandId);

  useEffect(() => {
    if (currentBrand) {
      const parsedStatus = BrandStatusSchema.safeParse(currentBrand.status);
      if (parsedStatus.success) {
        const paletteRecord =
          currentBrand.palette &&
          typeof currentBrand.palette === 'object' &&
          !Array.isArray(currentBrand.palette)
            ? (currentBrand.palette as { tokens?: unknown })
            : undefined;
        const palette = Array.isArray(paletteRecord?.tokens)
          ? {
              tokens: paletteRecord.tokens.filter(
                (token) => typeof token === 'object' && token !== null && 'id' in token,
              ) as Array<{ id: string; [key: string]: unknown }>,
            }
          : undefined;

        queueMicrotask(() =>
          setActiveBrand({ ...currentBrand, status: parsedStatus.data, palette }),
        );
      }
    }
  }, [currentBrand, setActiveBrand]);

  // 2. Estado de la Máquina de Paneles
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState('overview');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Cleanup al salir del módulo o cambiar de marca
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1023px)');
    setSidebarOpen(!mediaQuery.matches);
  }, []);

  useEffect(() => {
    if (!brandId) {
      queueMicrotask(() => {
        setFlyoutOpen(false);
        setActiveSectionId('overview');
      });
    }
  }, [brandId]);

  useEffect(() => {
    return () => {
      setFlyoutOpen(false);
    };
  }, []);

  const isBrandMode = !!brandId && pathname.includes('/brands/');
  const isReadOnly = activeBrand?.status === 'published' || activeBrand?.status === 'archived';

  // Lógica de navegación
  const handleBrandNavigation = (itemId: string) => {
    if (!brandId) return;

    const routeMap: Record<string, string> = {
      'identity.overview': 'overview',
      'identity.narrative': 'identity',
      'visual.colors': 'visual/colors',
      'visual.typography': 'visual/typography',
      'visual.logos': 'visual/logos',
      'gov.rules': 'rules',
    };

    setActiveSectionId(itemId);
    setFlyoutOpen(true);

    const subPath = routeMap[itemId];
    if (subPath) {
      router.push(`/marketing-studio/brand-hub/brands/${brandId}/${subPath}`);
    }
  };

  // 3. Lógica de Breadcrumbs dinámicos
  const segments = [
    { id: 'suite', label: 'Marketing', href: '/marketing-studio' },
    { id: 'module', label: 'Brand Hub', href: '/marketing-studio/brand-hub' },
  ];

  if (pathname === '/marketing-studio/brand-hub') {
    segments.push({ id: 'view', label: 'Overview', href: '/marketing-studio/brand-hub' });
  } else if (brandId) {
    segments.push({ id: 'view', label: 'Brands', href: '/marketing-studio/brand-hub/brands' });
    if (activeBrand) {
      const brandName = typeof activeBrand.name === 'string' ? activeBrand.name : 'Brand';
      segments.push({
        id: 'brand',
        label: brandName,
        href: `/marketing-studio/brand-hub/brands/${brandId}`,
      });
    }
  }

  // 4. Determinar contenido del Flyout
  const flyoutProps = useMemo(() => {
    const sectionKey = activeSectionId.split('.')[0];
    return (
      BRAND_HUB_FLYOUT_DATA[activeSectionId] ||
      BRAND_HUB_FLYOUT_DATA[sectionKey] ||
      BRAND_HUB_FLYOUT_DATA['overview']
    );
  }, [activeSectionId]);

  // 5. Construir Contexto del Inspector
  const inspectorContext: InspectorContext = useMemo(
    () => ({
      scope: isBrandMode ? 'entity' : 'module',
      mode: isReadOnly ? 'read' : activeBrand?.status === 'draft' ? 'draft' : 'read',
      intent: 'inspect', // Default intent, could be dynamic based on toolbar actions
      entity: selectedEntity
        ? {
            moduleId: 'brand-hub',
            type: selectedEntity.type,
            id: selectedEntity.id,
            name:
              selectedEntity.name ||
              (typeof activeBrand?.name === 'string' ? activeBrand.name : 'Unknown Entity'),
          }
        : activeBrand
          ? {
              moduleId: 'brand-hub',
              type: 'brand.identity',
              id: activeBrand.id,
              name: typeof activeBrand.name === 'string' ? activeBrand.name : 'Brand',
            }
          : undefined,
      permissions: {
        canEdit: !isReadOnly,
        canApprove: false,
        canPublish: false,
        canOverride: false,
      },
    }),
    [isBrandMode, isReadOnly, activeBrand, selectedEntity],
  );

  const [activeInspectorTab, setActiveInspectorTab] = useState<InspectorTabId>('context');

  return (
    <ModuleWorkspace
      moduleId="brand-hub"
      sidebarOpen={sidebarOpen}
      flyoutOpen={flyoutOpen}
      inspectorOpen={isInspectorOpen}
      onSidebarChange={setSidebarOpen}
      onFlyoutChange={setFlyoutOpen}
      onInspectorChange={setInspectorOpen}
      config={{
        sidebarWidth: '280px',
        flyoutWidth: '320px',
        inspectorWidth: '420px', // Updated to match UnifiedInspector default
      }}

      sidebarSlot={
        <ModuleSidebar
          mode={isBrandMode ? 'brand' : 'module'}
          brands={brands}
          navGroups={MOCK_NAV_GROUPS as NavGroup[]}
          isLoading={isBrandsLoading || (isBrandMode && isBrandLoading)}
          onSelectBrand={(id) => router.push(`/marketing-studio/brand-hub/brands/${id}/overview`)}
          onBackToDirectory={() => router.push('/marketing-studio/brand-hub/brands')}
          onNavigate={handleBrandNavigation}
          activeRouteId={activeSectionId}
        />
      }

      flyoutSlot={<SidebarFlyout {...flyoutProps} onClose={() => setFlyoutOpen(false)} />}

      headerSlot={
        <ModuleHeader
          segments={segments}
          sidebarToggle={{
            isOpen: sidebarOpen,
            onToggle: () => setSidebarOpen(!sidebarOpen),
          }}
          // BRAND STATUS CLUSTER
          rightSlot={
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <IconButton
                  variant={isInspectorOpen ? 'primary' : 'ghost'}
                  size="sm"
                  icon="info"
                  tooltip={isInspectorOpen ? 'Close inspector' : 'Open inspector'}
                  onClick={() => setInspectorOpen(!isInspectorOpen)}
                />
              </div>
            </div>
          }
        />
      }

      toolbarSlot={
        <BrandToolbar
          mode={isBrandMode ? 'brand' : 'module'}
          brandStatus={activeBrand?.status}
          isReadOnly={isReadOnly}
          viewMode={viewMode} // Pass viewMode state
          onViewModeChange={setViewMode} // Pass state setter
          onAction={(action) => {
            if (action === 'dependencies') {
              setInspectorOpen(true);
              setActiveInspectorTab('impact');
            }
            console.log('Toolbar Action:', action);
          }}
        />
      }

      inspectorSlot={
        <UnifiedInspector
          isOpen={isInspectorOpen}
          onClose={() => setInspectorOpen(false)}
          context={inspectorContext}
          activeTab={activeInspectorTab}
          onTabChange={setActiveInspectorTab}
        >
          <BrandInspector
            tab={activeInspectorTab}
            context={inspectorContext}
            isLoading={isBrandLoading}
          />
        </UnifiedInspector>
      }
    >
      {children}
    </ModuleWorkspace>
  );
}

export default function BrandHubLayout({ children }: { children: React.ReactNode }) {
  return (
    <BrandHubProvider>
      <BrandHubLayoutInner>{children}</BrandHubLayoutInner>
    </BrandHubProvider>
  );
}
