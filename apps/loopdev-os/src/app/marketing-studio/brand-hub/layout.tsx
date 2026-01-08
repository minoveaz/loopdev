'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ModuleWorkspace, InspectorPanel, ModuleHeader, Button, Icon } from '@loopdev/ui';

/**
 * @layout BrandHubLayout
 * @description Layout raíz del módulo Brand Hub.
 * Orquesta el ModuleWorkspace y gestiona el estado de los paneles laterales.
 */
export default function BrandHubLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  // 1. Estado de la Máquina de Paneles (v1.6 Spec)
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [flyoutOpen, setFlyoutOpen] = useState(false);

  // 2. Determinar el modo y los segmentos del path
  const isBrandMode = pathname.includes('/brands/') && pathname.split('/').length > 4;
  
  // Lógica de Breadcrumbs dinámicos { SUITE / MODULE / VIEW }
  const segments = [
    { id: 'suite', label: 'Marketing', href: '/marketing-studio' },
    { id: 'module', label: 'Brand Hub', href: '/marketing-studio/brand-hub' }
  ];

  // Identificar la vista activa (Nivel 3)
  if (pathname.endsWith('/brand-hub/overview')) {
    segments.push({ id: 'view', label: 'Overview', isActive: true });
  } else if (pathname.includes('/brand-hub/brands')) {
    segments.push({ id: 'view', label: 'Brands', href: '/marketing-studio/brand-hub/brands', isActive: pathname.endsWith('/brands') });
  }

  return (
    <ModuleWorkspace
      config={{
        isSidebarOpen: sidebarOpen,
        isInspectorOpen: inspectorOpen,
        isFlyoutOpen: flyoutOpen,
        sidebarMode: isBrandMode ? 'brand' : 'module'
      }}
      onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      onToggleInspector={() => setInspectorOpen(!inspectorOpen)}
      onToggleFlyout={() => setFlyoutOpen(!flyoutOpen)}
      
      // Sidebar real se inyectará en el siguiente paso
      sidebarSlot={<div className="p-4 opacity-20 font-mono text-xs">ModuleSidebar_Shell</div>}
      
      headerSlot={
        <ModuleHeader 
          segments={segments}
          statusLabel={isBrandMode ? 'DRAFT_VERSION' : 'SYSTEM_ACTIVE'}
          statusSeverity={isBrandMode ? 'warning' : 'success'}
          sidebarToggle={{
            isOpen: sidebarOpen,
            onToggle: () => setSidebarOpen(!sidebarOpen)
          }}
          rightSlot={
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" startIcon="share">Share</Button>
              <Button variant="primary" size="sm" startIcon="publish">Publish</Button>
            </div>
          }
        />
      }
      
      toolbarSlot={<div className="p-4 opacity-20 font-mono text-xs border-b border-border-technical">ModuleToolbar_Shell</div>}
      
      inspectorSlot={
        <InspectorPanel 
          title="Module_Auditor"
          onClose={() => setInspectorOpen(false)}
          tabs={[
            { id: 'context', label: 'Context', content: <div className="p-4 font-mono text-[10px] opacity-40">// context_auditor_pending</div> },
            { id: 'impact', label: 'Impact', content: <div className="p-4 font-mono text-[10px] opacity-40">// impact_analysis_pending</div> },
            { id: 'diff', label: 'Diff', content: <div className="p-4 font-mono text-[10px] opacity-40">// version_diff_pending</div> },
            { id: 'governance', label: 'Governance', content: <div className="p-4 font-mono text-[10px] opacity-40">// approvals_pending</div> }
          ]}
        />
      }
      flyoutSlot={<div className="p-4 opacity-20 font-mono text-xs">SidebarFlyout_Shell</div>}
    >
      {children}
    </ModuleWorkspace>
  );
}
