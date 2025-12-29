import type { MigrationStats } from '@/core/types';

interface ArchitectStatsProps {
  stats: MigrationStats;
}

export const ArchitectStats = ({ stats }: ArchitectStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h3 className="text-sm font-medium text-slate-500">Total Blueprints</h3>
        <p className="text-2xl font-bold text-slate-900 mt-2">{stats.totalBlueprints}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h3 className="text-sm font-medium text-slate-500">Migrated</h3>
        <p className="text-2xl font-bold text-emerald-600 mt-2">{stats.migratedCount}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h3 className="text-sm font-medium text-slate-500">Compliance Score</h3>
        <p className="text-2xl font-bold text-blue-600 mt-2">{stats.complianceScore}%</p>
      </div>
    </div>
  );
};
