import React, { useState } from 'react';
import { useArchitectRegistry } from '../hooks/useArchitectRegistry';
import { useArchitectAudit } from '../hooks/useArchitectAudit';
import { ArchitectShell } from '../components/layout/ArchitectShell';
import { ArchitectHeader } from '../components/dashboard/ArchitectHeader';
import { BlueprintExplorer } from '../components/dashboard/BlueprintExplorer';
import { SplitPane } from '../components/layout/SplitPane';
import { AuditReportView } from '../components/audit/AuditReportView';
import { BlueprintCanvas } from '../components/canvas/BlueprintCanvas';

/**
 * @view ArchitectDashboard
 * @description The main workbench for the Architect module.
 * Now featuring a dynamic Discovery Explorer for 75+ blueprints.
 */
export const ArchitectDashboard = () => {
  const [selectedComponent, setSelectedComponent] = useState('ActivitySidebar');
  const [sandboxTheme, setSandboxTheme] = useState<'dark' | 'light'>('dark');
  const { stats, isLoading: isRegistryLoading } = useArchitectRegistry();
  const { report, isLoading: isAuditLoading } = useArchitectAudit();

  const isLoading = isRegistryLoading || isAuditLoading;

  return (
    <ArchitectShell isLoading={isLoading}>
      {/* 1. Module Header with Identity & KPIs */}
      <ArchitectHeader stats={stats} />
      
      {/* 2. Main Workbench Area */}
      <div className="flex-1 min-h-0 px-8 pb-12">
        <div className="h-[850px] flex rounded-2xl border border-slate-200/60 bg-white/40 backdrop-blur-sm overflow-hidden shadow-sm">
          
          {/* A. Discovery Explorer (300px) */}
          <div className="w-[300px] shrink-0">
            <BlueprintExplorer 
              selectedId={selectedComponent}
              onSelect={setSelectedComponent}
            />
          </div>

          {/* B. Analysis Pane (Flexible) */}
          <div className="flex-1 min-w-0">
            <SplitPane 
              left={
                <BlueprintCanvas componentName={selectedComponent} theme={sandboxTheme} />
              }
              right={
                report ? <AuditReportView report={report} /> : <div className="p-10 text-slate-400 font-medium italic">Analyzing structure...</div>
              }
              componentName={selectedComponent}
              sandboxTheme={sandboxTheme}
              onThemeToggle={() => setSandboxTheme(t => t === 'dark' ? 'light' : 'dark')}
              leftTitle={`Sandbox: ${selectedComponent}`}
              rightTitle="Architect Intelligence Report"
            />
          </div>

        </div>
      </div>
    </ArchitectShell>
  );
};

