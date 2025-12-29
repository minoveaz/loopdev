import type { Blueprint } from '../core/types';

interface BlueprintListProps {
  blueprints: Blueprint[];
}

export const BlueprintList = ({ blueprints }: BlueprintListProps) => {
  const getStatusColor = (status: Blueprint['status']) => {
    switch (status) {
      case 'approved': return 'bg-emerald-100 text-emerald-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'in-review': return 'bg-amber-100 text-amber-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Path</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Issues</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {blueprints.map((bp) => (
            <tr key={bp.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-slate-900">{bp.name}</div>
                <div className="text-xs text-slate-500">{bp.category}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">
                {bp.sourcePath}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex gap-1 flex-wrap">
                  {bp.detectedPatterns.map(p => (
                    <span key={p} className="px-2 py-0.5 text-xs rounded bg-red-50 text-red-600 border border-red-100">
                      {p}
                    </span>
                  ))}
                  {bp.detectedPatterns.length === 0 && (
                    <span className="text-xs text-slate-400 italic">Clean</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(bp.status)}`}>
                  {bp.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
