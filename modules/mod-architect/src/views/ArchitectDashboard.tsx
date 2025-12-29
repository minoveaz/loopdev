import { useArchitectRegistry } from '../hooks/useArchitectRegistry';
import { useArchitectAudit } from '../hooks/useArchitectAudit';
import { ArchitectStats } from '../components/ArchitectStats';
import { SplitPane } from '../components/layout/SplitPane';
import { AuditReportView } from '../components/audit/AuditReportView';
import { BlueprintCanvas } from '../components/canvas/BlueprintCanvas';
import { TechnicalDotGrid } from '@loopdev/ui';

export const ArchitectDashboard = () => {
  const { stats, isLoading: isRegistryLoading } = useArchitectRegistry();
  const { report, isLoading: isAuditLoading } = useArchitectAudit();

  const isLoading = isRegistryLoading || isAuditLoading;

  return (
    <div className="flex flex-col h-full bg-white relative overflow-hidden">
      <TechnicalDotGrid />

      {isLoading && (
        <div className="absolute top-0 left-0 right-0 z-50 h-1 bg-indigo-600 animate-pulse w-full" />
      )}

      {/* Compact Status Bar */}
      <div className="px-8 py-4 shrink-0 border-b border-slate-100 flex justify-between items-center bg-white/50 backdrop-blur-sm relative z-10">
        <ArchitectStats stats={stats} />
      </div>
      
      {/* Main Workbench Area */}
      <div className="flex-1 min-h-0 relative z-10">
        <SplitPane 
          left={
            <BlueprintCanvas componentName="ActivitySidebar" />
          }
          right={
            report ? <AuditReportView report={report} /> : <div className="p-10 text-slate-400">Analyzing structure...</div>
          }
          leftTitle="Blueprint Canvas (Isolated Styles)"
          rightTitle="Architect Intelligence Report"
        />
      </div>
    </div>
  );
};