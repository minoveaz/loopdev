import React from 'react';
import { TacticalMetricCell } from './TacticalMetricCell';

interface BotTacticalIndicatorsProps {
  bot: any;
  alert?: boolean;
}

export const BotTacticalIndicators = ({ bot, alert = false }: BotTacticalIndicatorsProps) => (
  <div className="grid grid-cols-4 gap-2">
    <TacticalMetricCell
      alert={alert}
      label={bot.logicSnapshot?.rsi !== undefined ? 'RSI_14' : 'ATR_VOL'}
      value={
        bot.logicSnapshot?.rsi !== undefined
          ? bot.logicSnapshot.rsi.toFixed(1)
          : bot.logicSnapshot?.atr_vol || bot.logicSnapshot?.atr || '--'
      }
    />
    <TacticalMetricCell
      alert={alert}
      label={bot.logicSnapshot?.bb_dist_up !== undefined ? 'BB_UP' : 'SMA_DIST'}
      value={
        bot.logicSnapshot?.bb_dist_up !== undefined
          ? `${bot.logicSnapshot.bb_dist_up}%`
          : bot.logicSnapshot?.sma_dist !== undefined
            ? `${bot.logicSnapshot.sma_dist}%`
            : '--'
      }
    />
    <TacticalMetricCell
      alert={alert}
      label={bot.logicSnapshot?.bb_dist_low !== undefined ? 'BB_LOW' : 'VOL_STAT'}
      value={
        bot.logicSnapshot?.bb_dist_low !== undefined
          ? `${bot.logicSnapshot.bb_dist_low}%`
          : bot.logicSnapshot?.vol_status || 'LOW'
      }
      valueClassName={
        bot.logicSnapshot?.vol_status === 'HIGH' ? 'text-emerald-500' : 'text-text-muted'
      }
    />
    <TacticalMetricCell
      alert={alert}
      label="BIAS"
      value={bot.logicSnapshot?.bias || 'STABLE'}
      valueClassName={
        bot.logicSnapshot?.bias === 'BULLISH'
          ? 'text-emerald-500'
          : bot.logicSnapshot?.bias === 'BEARISH'
            ? 'text-rose-500'
            : 'text-amber-500'
      }
    />
  </div>
);
