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
} from '@loopdev/ui';
import { useBrands } from '@/hooks/brand-hub/useBrands';
import { useActiveBrand } from '@/hooks/brand-hub/useActiveBrand';
import { MOCK_NAV_GROUPS } from '@/data/mock-brands';
import { BRAND_HUB_FLYOUT_DATA } from '@/suites/marketing-studio/brand-hub/fixtures/flyout-data';
import { BrandHubProvider, useBrandHub } from '@/suites/marketing-studio/brand-hub/context';

/**
 * @layout BrandHubLayoutInner
 * @description Implementación interna del layout con estados de carga.
 */
function BrandHubLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const { selectedEntity, isInspectorOpen, setInspectorOpen, setActiveBrand, activeBrand } = useBrandHub();
  
  // 1. Datos Reales (Supabase)
  const { data: brands = [], isLoading: isBrandsLoading } = useBrands();
  const brandId = params?.brandId as string;
  const { data: currentBrand, isLoading: isBrandLoading } = useActiveBrand(brandId);

  // Sincronizar marca activa con el contexto
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

  // 5. Determinar contenido del Flyout (Mapping inteligente)
  const flyoutProps = useMemo(() => {
    // Si hay data específica para el item, úsala. Si no, busca la sección padre.
    const sectionKey = activeSectionId.split('.')[0]; // visual.colors -> visual
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
          statusLabel={isBrandMode ? activeBrand?.status?.toUpperCase() || 'LOADING...' : (isBrandsLoading ? 'SYNCING...' : 'SYSTEM_ACTIVE')}
          statusSeverity={isBrandMode ? (activeBrand?.status === 'published' ? 'success' : 'warning') : 'success'}
          sidebarToggle={{
            isOpen: sidebarOpen,
            onToggle: () => setSidebarOpen(!sidebarOpen)
          }}
          rightSlot={
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
          }
        />
      }
      
      toolbarSlot={
        <div className="flex items-center px-4 h-full border-b border-border-technical">
          {isReadOnly && (
            <div className="flex items-center gap-2 px-3 py-1 rounded bg-slate-500/5 border border-slate-500/10">
              <LpdText size="nano" weight="bold" className="text-text-muted uppercase tracking-widest">
                {`{ Mode: Read Only }`}
              </LpdText>
            </div>
          )}
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