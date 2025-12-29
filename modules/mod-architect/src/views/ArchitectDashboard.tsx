import { useArchitectRegistry } from '../hooks/useArchitectRegistry';
import { useArchitectAudit } from '../hooks/useArchitectAudit';
import { ArchitectShell } from '../components/layout/ArchitectShell';
import { ArchitectHeader } from '../components/dashboard/ArchitectHeader';
import { SplitPane } from '../components/layout/SplitPane';
import { AuditReportView } from '../components/audit/AuditReportView';
import { BlueprintCanvas } from '../components/canvas/BlueprintCanvas';

/**
 * @view ArchitectDashboard
 * @description The main workbench for the Architect module.
 * Coordinates data fetching and layout composition.
 */
export const ArchitectDashboard = () => {
  const { stats, isLoading: isRegistryLoading } = useArchitectRegistry();
  const { report, isLoading: isAuditLoading } = useArchitectAudit();

  const isLoading = isRegistryLoading || isAuditLoading;

  return (
    <ArchitectShell isLoading={isLoading}>
      {/* 1. Module Header with Identity & KPIs */}
      <ArchitectHeader stats={stats} />
      
      {/* 2. Main Workbench (The Split Pane area) */}
      <div className="px-8 pb-12">
        <div className="h-[800px] rounded-2xl border border-slate-200/60 bg-white/40 backdrop-blur-sm overflow-hidden shadow-sm">
          <SplitPane 
            left={
              <BlueprintCanvas componentName="ActivitySidebar" />
            }
            right={
              report ? <AuditReportView report={report} /> : <div className="p-10 text-slate-400 font-medium italic">Analyzing structure...</div>
            }
            leftTitle="Blueprint Visual Sandbox"
            rightTitle="Architect Intelligence Report"
          />
        </div>
      </div>
    </ArchitectShell>
  );
};
