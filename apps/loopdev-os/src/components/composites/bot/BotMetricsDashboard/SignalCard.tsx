import { formatPercentage } from '@/lib/metrics/metricsFormatter';

interface SignalCardProps {
  label: string;
  signal: { required_level: number; current_value: number; gap_pct: number; ready: boolean };
  readyColor: string;
  gradient: string;
}

export function SignalCard({ label, signal, readyColor, gradient }: SignalCardProps) {
  const progress = Math.min(100, Math.max(0, 100 - signal.gap_pct));
  return (
    <div className="space-y-2">
      <p className="text-micro text-primary-light">{label} Entry</p>
      <div className="bg-surface-elevated space-y-1 rounded p-2">
        <div className="text-nano flex justify-between">
          <span className="text-primary-light">Trigger RSI:</span>
          <span className="text-primary font-mono">{signal.required_level}</span>
        </div>
        <div className="text-nano flex justify-between">
          <span className="text-primary-light">Current RSI:</span>
          <span className="text-primary font-mono">{signal.current_value.toFixed(1)}</span>
        </div>
        <div className="text-nano flex justify-between">
          <span className="text-primary-light">Gap:</span>
          <span className={`font-mono ${signal.ready ? readyColor : 'text-yellow-500'}`}>
            {formatPercentage(signal.gap_pct)}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className="bg-surface-dark h-1.5 flex-1 overflow-hidden rounded">
            <div
              className={`h-full bg-gradient-to-r ${signal.ready ? gradient : 'from-yellow-500 to-orange-500'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-nano text-primary-light font-mono">{progress.toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
}
