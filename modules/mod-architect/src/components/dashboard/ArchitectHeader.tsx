import { ArchitectStats } from './ArchitectStats';
import type { MigrationStats } from '../../core/types';

interface ArchitectHeaderProps {
  stats: MigrationStats;
  title?: string;
  subtitle?: string;
}

/**
 * @component ArchitectHeader
 * @description Technical header for the module with KPIs and system identity.
 */
export const ArchitectHeader = ({ 
  stats, 
  title = "Blueprint Architect", 
  subtitle = "Design System Migration Studio" 
}: ArchitectHeaderProps) => {
  return (
    <header className="px-8 py-10 shrink-0 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 w-fit">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
          <span className="text-[9px] font-black text-indigo-700 uppercase tracking-wider">System Audit Active</span>
        </div>
        <h1 className="text-3xl font-black tracking-tighter text-slate-900 leading-none">
          {title}
        </h1>
        <p className="text-sm text-slate-500 font-medium">
          {subtitle}
        </p>
      </div>

      <ArchitectStats stats={stats} />
    </header>
  );
};
