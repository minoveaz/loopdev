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
} from '@loopdev/ui';
import { useBrands } from '@/hooks/brand-hub/useBrands';
import { useActiveBrand } from '@/hooks/brand-hub/useActiveBrand';
import { MOCK_NAV_GROUPS } from '@/data/mock-brands';
import { BRAND_HUB_FLYOUT_DATA } from '@/suites/marketing-studio/brand-hub/fixtures/flyout-data';
import { BrandHubProvider, useBrandHub } from '@/suites/marketing-studio/brand-hub/context';

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
        inspectorWidth: '320px'
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
                <Button 
                  variant={isReadOnly ? "secondary" : "primary"} 
                  size="sm" 
                  startIcon={isReadOnly ? "history" : "publish"}
                >
                  {isReadOnly ? 'Create Draft' : 'Publish'}
                </Button>
              </div>
            </div>
          }
        />
      }
      
      toolbarSlot={
        <div className="flex items-center px-4 h-full border-b border-border-technical">
          {/* Toolbar simplificada - Controles de vista irían aquí */}
          <div className="flex-1" />
        </div>
      }
      
      inspectorSlot={
        <InspectorPanel 
          title={selectedEntity ? `Inspecting_${selectedEntity.type.toUpperCase()}` : "Module_Auditor"}
          onClose={() => setInspectorOpen(false)}
          tabs={[
            { 
              id: 'context', 
              label: 'Context', 
              content: (
                <div className="p-6 flex flex-col gap-4">
                  {isBrandLoading ? <div className="space-y-4"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4" /></div> : selectedEntity ? (
                    <>
                      <div className="flex flex-col gap-1">
                        <LpdText size="nano" className="text-primary font-mono font-bold uppercase tracking-widest">Selected ID</LpdText>
                        <LpdText size="xs" weight="bold" className="text-text-main font-mono">{selectedEntity.id}</LpdText>
                      </div>
                      <div className="flex flex-col gap-1">
                        <LpdText size="nano" className="text-primary font-mono font-bold uppercase tracking-widest">Type</LpdText>
                        <LpdText size="xs" weight="bold" className="text-text-main">{selectedEntity.type}</LpdText>
                      </div>
                    </>
                  ) : (
                    <div className="py-12 text-center opacity-20 font-mono text-[10px] uppercase tracking-widest">
                      // no_entity_selected
                    </div>
                  )}
                </div>
              )
            },
            { id: 'impact', label: 'Impact', content: <div className="p-6 font-mono text-[10px] opacity-40">// impact_analysis_pending</div> },
            { id: 'diff', label: 'Diff', content: <div className="p-6 font-mono text-[10px] opacity-40">// version_diff_pending</div> },
            { id: 'governance', label: 'Governance', content: <div className="p-6 font-mono text-[10px] opacity-40">// approvals_pending</div> }
          ]}
        />
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
