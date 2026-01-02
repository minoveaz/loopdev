import type { MigrationStats } from '../../core/types';

interface ArchitectStatsProps {
  stats: MigrationStats;
}

export const ArchitectStats = ({ stats }: ArchitectStatsProps) => {
  return (
    <div className="flex gap-12">
      <div className="flex flex-col">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
          Total Blueprints
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-slate-900 tracking-tighter">
            {stats.totalBlueprints}
          </span>
          <span className="text-[10px] font-mono text-slate-400">UNIT</span>
        </div>
      </div>

      <div className="w-px h-10 bg-slate-200/50" />

      <div className="flex flex-col">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
          Migrated
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-emerald-600 tracking-tighter">
            {stats.migratedCount}
          </span>
          <span className="text-[10px] font-mono text-emerald-600/50">DONE</span>
        </div>
      </div>

      <div className="w-px h-10 bg-slate-200/50" />

      <div className="flex flex-col">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
          Compliance
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-indigo-600 tracking-tighter">
            {stats.complianceScore}%
          </span>
          <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-600" 
              style={{ width: `${stats.complianceScore}%` }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};
