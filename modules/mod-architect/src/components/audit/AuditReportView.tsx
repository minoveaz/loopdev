import { Box, Stack, Inline, Badge } from '@loopdev/ui';
import { ShieldCheck, AlertCircle, BoxIcon, MoveRight } from 'lucide-react';
import type { AuditReport } from '../../hooks/useArchitectAudit';

export const AuditReportView = ({ report }: { report: AuditReport }) => {
  return (
    <Stack gap={6} className="p-8">
      <div>
        <h3 className="text-xl font-black text-slate-900 mb-1">Audit Results: {report.componentName}</h3>
        <p className="text-sm text-slate-500">Structural DNA Analysis complete.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <Box background="subtle" padding={4} radius="lg" border>
          <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Legacy Icons</p>
          <p className="text-2xl font-black text-amber-600">{report.antipatterns.legacyIcons}</p>
        </Box>
        <Box background="subtle" padding={4} radius="lg" border>
          <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Inline Styles</p>
          <p className="text-2xl font-black text-slate-900">{report.antipatterns.inlineStyles}</p>
        </Box>
        <Box background="subtle" padding={4} radius="lg" border>
          <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Color Issues</p>
          <p className="text-2xl font-black text-red-600">{report.antipatterns.hardcodedColors.length}</p>
        </Box>
      </div>

      {/* Zone Detection */}
      <Stack gap={3}>
        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
          <ShieldCheck size={14} className="text-emerald-500" /> Detected Zones
        </h4>
        <div className="space-y-2">
          {report.zones.map((zone, i) => (
            <Box key={i} background="base" padding={4} radius="xl" border className="group hover:border-indigo-500 transition-all">
              <Inline justify="between" align="center">
                <Stack gap={1}>
                  <p className="text-sm font-bold text-slate-900">{zone.zone}</p>
                  <p className="text-[10px] font-mono text-slate-400">Target: {zone.target}</p>
                </Stack>
                <div className="flex items-center gap-2 text-indigo-600 group-hover:translate-x-1 transition-transform">
                  <span className="text-[10px] font-black uppercase">Migrate</span>
                  <MoveRight size={14} />
                </div>
              </Inline>
            </Box>
          ))}
        </div>
      </Stack>
    </Stack>
  );
};
