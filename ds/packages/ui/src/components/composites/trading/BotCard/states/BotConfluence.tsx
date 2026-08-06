import { cn } from '../../../../../helpers/cn';

export function BotConfluence({ confluence }: { confluence?: Record<string, boolean> }) {
  if (!confluence) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {Object.entries(confluence).map(([key, value]) => (
        <div
          key={key}
          className={cn(
            'flex items-center gap-1.5 px-2 py-1 rounded-md border text-[9px] font-black uppercase tracking-widest transition-all duration-500',
            value
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
              : 'bg-white/5 border-white/10 text-text-muted opacity-40',
          )}
        >
          <div
            className={cn(
              'w-1 h-1 rounded-full',
              value ? 'bg-emerald-500 animate-pulse' : 'bg-text-muted',
            )}
          />
          {key.replace(/_/g, ' ')}
        </div>
      ))}
    </div>
  );
}
