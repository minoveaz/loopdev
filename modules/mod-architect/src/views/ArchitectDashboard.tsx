import { useArchitectRegistry } from '../hooks/useArchitectRegistry';
import { ArchitectStats } from '../components/ArchitectStats';
import { BlueprintList } from '../components/BlueprintList';
import { SplitPane } from '../components/layout/SplitPane';

/**
 * @file ArchitectDashboard.tsx
 * @description Main entry point for the Architect Module.
 * Displays the migration status of the tenant's blueprints.
 */
export const ArchitectDashboard = () => {
  const { blueprints, stats, isLoading } = useArchitectRegistry();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-slate-400 animate-pulse">Scanning blueprints...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header Area */}
      <div className="p-8 pb-4 shrink-0">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Architect Dashboard</h1>
          <p className="mt-2 text-slate-600">
            Managing migration of legacy blueprints to LoopDev Design System.
          </p>
        </div>

        <ArchitectStats stats={stats} />
      </div>
      
      {/* Main Workbench Area - Demonstrating SplitPane */}
      <div className="flex-1 min-h-0 border-t border-slate-200">
        <SplitPane 
          left={
            <div className="text-center p-8 text-slate-400">
              <p>Select a blueprint to view source</p>
              <div className="mt-4 p-4 bg-yellow-50 text-yellow-800 text-xs font-mono rounded text-left">
                &lt;div style="color: blue"&gt;<br/>
                &nbsp;&nbsp;Legacy Component<br/>
                &lt;/div&gt;
              </div>
            </div>
          }
          right={
            <div className="p-8">
              <BlueprintList blueprints={blueprints} />
            </div>
          }
          leftTitle="Blueprint Source"
          rightTitle="Migration Queue"
        />
      </div>
    </div>
  );
};
