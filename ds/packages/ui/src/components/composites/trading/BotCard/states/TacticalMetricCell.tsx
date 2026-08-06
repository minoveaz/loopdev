import type { ReactNode } from 'react';
import { LpdText } from '../../../../atoms/foundations/Typography';
import { cn } from '../../../../../helpers/cn';

interface TacticalMetricCellProps {
  label: string;
  value: ReactNode;
  alert?: boolean;
  valueClassName?: string;
}

export function TacticalMetricCell({
  label,
  value,
  alert = false,
  valueClassName,
}: TacticalMetricCellProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-1 p-2 rounded-xl bg-white/[0.03] border',
        alert ? 'border-amber-500/10' : 'border-white/5',
      )}
    >
      <LpdText
        size="nano"
        weight="black"
        className={cn(
          alert ? 'text-amber-500' : 'text-text-muted',
          'opacity-40 uppercase tracking-tighter',
        )}
      >
        {label}
      </LpdText>
      <LpdText
        size="xs"
        weight="black"
        className={cn('font-mono', valueClassName || 'text-text-main')}
      >
        {value}
      </LpdText>
    </div>
  );
}
