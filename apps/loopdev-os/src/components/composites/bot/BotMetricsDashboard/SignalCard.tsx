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
      <div className="bg-surface-elevated rounded p-2 space-y-1">
        <div className="flex justify-between text-nano">
          <span className="text-primary-light">Trigger RSI:</span>
          <span className="font-mono text-primary">{signal.required_level}</span>
        </div>
        <div className="flex justify-between text-nano">
          <span className="text-primary-light">Current RSI:</span>
          <span className="font-mono text-primary">{signal.current_value.toFixed(1)}</span>
        </div>
        <div className="flex justify-between text-nano">
          <span className="text-primary-light">Gap:</span>
          <span className={`font-mono ${signal.ready ? readyColor : 'text-yellow-500'}`}>
            {formatPercentage(signal.gap_pct)}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 bg-surface-dark rounded h-1.5 overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${signal.ready ? gradient : 'from-yellow-500 to-orange-500'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-nano font-mono text-primary-light">{progress.toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
}
