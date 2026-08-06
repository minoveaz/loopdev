import { LpdText } from '../../../../atoms/foundations/Typography';
import { cn } from '../../../../../helpers/cn';

export function BotPnlBadge({ value }: { value?: number }) {
  const pnl = value || 0;
  return (
    <div className="flex flex-col items-end gap-1">
      <LpdText size="nano" className="text-text-muted opacity-40 uppercase font-bold">
        Avg_PnL
      </LpdText>
      <div
        className={cn(
          'px-2 py-0.5 rounded-md border text-[10px] font-black font-mono',
          pnl >= 0
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-500',
        )}
      >
        {pnl >= 0 ? '+' : ''}
        {pnl.toFixed(2)}%
      </div>
    </div>
  );
}
