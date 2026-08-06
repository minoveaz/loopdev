import { LpdText } from '../../../../atoms/foundations/Typography';

export function BotTriggerDistance({ bot, alert = false }: { bot: any; alert?: boolean }) {
  const distance = Math.abs(bot.currentPrice - bot.logicSnapshot.trigger_price);
  const percentage = Math.abs((bot.currentPrice / bot.logicSnapshot.trigger_price - 1) * 100);
  return (
    <div
      className={
        alert
          ? 'flex flex-col gap-2 p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10'
          : 'flex flex-col gap-2 p-4 bg-white/5 rounded-2xl border border-white/5'
      }
    >
      <div className="flex items-center justify-between">
        <LpdText
          size="nano"
          weight="black"
          className={
            alert
              ? 'text-amber-500 opacity-40 uppercase tracking-widest'
              : 'text-text-muted opacity-40 uppercase tracking-widest'
          }
        >
          {alert ? 'Target_Nexus' : 'Distance_To_Trigger'}
        </LpdText>
        <LpdText
          size="nano"
          className={
            alert ? 'text-amber-500 animate-pulse font-mono font-bold' : 'text-primary font-mono'
          }
        >
          {alert ? 'CRITICAL_GAP' : 'ESTIMATED'}
        </LpdText>
      </div>
      <div className="flex items-baseline justify-between">
        <div className="flex items-baseline gap-2">
          <LpdText size="lg" weight="black" className="font-mono text-text-main">
            ${distance.toFixed(2)}
          </LpdText>
          <LpdText size="xs" weight="bold" className="text-amber-500 font-mono">
            ({percentage.toFixed(2)}%)
          </LpdText>
        </div>
        <div className="flex flex-col items-end">
          <LpdText
            size="nano"
            className={
              alert
                ? 'text-amber-500 opacity-40 uppercase font-bold'
                : 'text-text-muted opacity-40 uppercase font-bold'
            }
          >
            Target_Price
          </LpdText>
          <LpdText
            size="xs"
            weight="black"
            className={alert ? 'font-mono text-text-main opacity-80' : 'font-mono text-text-muted'}
          >
            $
            {Number(bot.logicSnapshot.trigger_price).toLocaleString('en-US', {
              minimumFractionDigits: 2,
            })}
          </LpdText>
        </div>
      </div>
    </div>
  );
}
