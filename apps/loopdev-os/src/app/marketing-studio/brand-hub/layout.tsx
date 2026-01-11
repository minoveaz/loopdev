'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { usePathname, useRouter, useParams } from 'next/navigation';
import { 
  ModuleWorkspace, 
  InspectorPanel, 
  ModuleHeader, 
  ModuleSidebar,
  SidebarFlyout,
  Button,
  LpdText,
  Skeleton,
  TechnicalStatusBadge,
  UnifiedInspector,
  InspectorContext
} from '@loopdev/ui';
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
  const { selectedEntity, isInspectorOpen, setInspectorOpen, setActiveBrand, activeBrand } = useBrandHub();
  
  // 1. Datos Reales
  const { data: brands = [], isLoading: isBrandsLoading } = useBrands();
  const brandId = params?.brandId as string;
  const { data: currentBrand, isLoading: isBrandLoading } = useActiveBrand(brandId);

  useEffect(() => {
    if (currentBrand) setActiveBrand(currentBrand);
  }, [currentBrand, setActiveBrand]);

  // 2. Estado de la Máquina de Paneles
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState('overview');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Cleanup al salir del módulo o cambiar de marca
  useEffect(() => {
    if (!brandId) {
      setFlyoutOpen(false);
      setActiveSectionId('overview');
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
      'gov.rules': 'rules'
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
    { id: 'module', label: 'Brand Hub', href: '/marketing-studio/brand-hub' }
  ];

  if (pathname.endsWith('/brand-hub/overview')) {
    segments.push({ id: 'view', label: 'Overview', isActive: true });
  } else if (brandId) {
    segments.push({ id: 'view', label: 'Brands', href: '/marketing-studio/brand-hub/brands' });
    if (activeBrand) {
      segments.push({ id: 'brand', label: activeBrand.name, isActive: pathname.includes(brandId) });
    }
  }

  // 4. Determinar contenido del Flyout
  const flyoutProps = useMemo(() => {
    const sectionKey = activeSectionId.split('.')[0];
    return BRAND_HUB_FLYOUT_DATA[activeSectionId] || BRAND_HUB_FLYOUT_DATA[sectionKey] || BRAND_HUB_FLYOUT_DATA['overview'];
  }, [activeSectionId]);

  // 5. Construir Contexto del Inspector
  const inspectorContext: InspectorContext = useMemo(() => ({
    scope: isBrandMode ? 'entity' : 'module',
    mode: isReadOnly ? 'read' : activeBrand?.status === 'draft' ? 'draft' : 'read',
    intent: 'inspect', // Default intent, could be dynamic based on toolbar actions
    entity: selectedEntity ? {
        moduleId: 'brand-hub',
        type: selectedEntity.type,
        id: selectedEntity.id,
        name: selectedEntity.name || activeBrand?.name || 'Unknown Entity'
    } : activeBrand ? {
        moduleId: 'brand-hub',
        type: 'brand.identity',
        id: activeBrand.id,
        name: activeBrand.name
    } : undefined,
    permissions: {
        canEdit: !isReadOnly,
        canApprove: false,
        canPublish: false,
        canOverride: false
    }
  }), [isBrandMode, isReadOnly, activeBrand, selectedEntity]);

  const [activeInspectorTab, setActiveInspectorTab] = useState<any>('context');

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
        inspectorWidth: '420px' // Updated to match UnifiedInspector default
      }}
      
      sidebarSlot={
        <ModuleSidebar 
          mode={isBrandMode ? 'brand' : 'module'}
          brands={brands}
          navGroups={MOCK_NAV_GROUPS as any}
          isLoading={isBrandsLoading || (isBrandMode && isBrandLoading)}
          onSelectBrand={(id) => router.push(`/marketing-studio/brand-hub/brands/${id}/overview`)}
          onBackToDirectory={() => router.push('/marketing-studio/brand-hub/brands')}
          onNavigate={handleBrandNavigation}
          activeRouteId={activeSectionId}
        />
      }      
      
      flyoutSlot={
        <SidebarFlyout 
          {...flyoutProps} 
          onClose={() => setFlyoutOpen(false)} 
        />
      }

      headerSlot={
        <ModuleHeader 
          segments={segments}
          sidebarToggle={{
            isOpen: sidebarOpen,
            onToggle: () => setSidebarOpen(!sidebarOpen)
          }}
          // BRAND STATUS CLUSTER
          rightSlot={
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-2">
                {isBrandMode && (
                  <>
                    <TechnicalStatusBadge 
                      label={activeBrand?.status?.toUpperCase() || 'LOADING'} 
                      severity={activeBrand?.status === 'published' ? 'success' : 'warning'} 
                      variant="glass"
                    />
                    {isReadOnly && (
                      <TechnicalStatusBadge 
                        label="READ ONLY" 
                        severity="neutral" 
                        variant="ghost"
                      />
                    )}
                  </>
                )}
                {!isBrandMode && (
                  <TechnicalStatusBadge 
                    label={isBrandsLoading ? 'SYNCING' : 'SYSTEM ACTIVE'} 
                    severity="success" 
                    variant="glass" 
                    withPulse
                  />
                )}
              </div>
              
              <div className="h-4 w-px bg-border-technical opacity-20" />

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" startIcon="share">Share</Button>
                <div className="h-4 w-px bg-border-technical opacity-20" />
                <Button 
                  variant={isInspectorOpen ? 'secondary' : 'ghost'} 
                  size="sm" 
                  startIcon="info" 
                  onClick={() => setInspectorOpen(!isInspectorOpen)}
                  aria-label="Toggle Inspector"
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
