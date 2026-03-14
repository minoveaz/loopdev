import React from 'react';
import { LpdText } from '../../../atoms/foundations/Typography';
import { Button } from '../../../atoms/inputs/Button';
import { TechnicalStatusBadge } from '../../../atoms/indicators/TechnicalStatusBadge';
import { cn } from '../../../../helpers/cn';

// --- CONTEXT BLOCK ---
interface ContextBlockProps {
  title: string;
  items: Array<{ label: string; value: string | React.ReactNode }>;
  className?: string;
}

export const ContextBlock: React.FC<ContextBlockProps> = ({ title, items, className }) => (
  <div className={cn("flex flex-col gap-3 py-4 border-b border-border-technical/50 last:border-0", className)}>
    <LpdText size="nano" weight="bold" className="text-text-muted uppercase tracking-widest opacity-80">
      {title}
    </LpdText>
    <div className="flex flex-col gap-2">
      {items.map((item, idx) => (
        <div key={idx} className="flex justify-between items-start">
          <span className="text-xs text-text-muted">{item.label}</span>
          <span className="text-xs font-mono text-text-main text-right">{item.value}</span>
        </div>
      ))}
    </div>
  </div>
);

// --- IMPACT BLOCK ---
interface ImpactBlockProps {
  severity: 'low' | 'medium' | 'high' | 'critical';
  title?: string;
  description: string;
  affectedModules?: string[];
}

export const ImpactBlock: React.FC<ImpactBlockProps> = ({ severity, title = 'Impact Analysis', description, affectedModules = [] }) => {
  const styles = {
    low: 'bg-blue-500/5 border-blue-500/20 text-blue-500',
    medium: 'bg-yellow-500/5 border-yellow-500/20 text-yellow-500',
    high: 'bg-orange-500/5 border-orange-500/20 text-orange-500',
    critical: 'bg-red-500/5 border-red-500/20 text-red-500',
  };

  return (
    <div className={cn("p-4 rounded border flex flex-col gap-2", styles[severity])}>
      <div className="flex items-center justify-between">
        <LpdText size="xs" weight="bold" className="uppercase tracking-widest inherit-color">
            {title}
        </LpdText>
        <TechnicalStatusBadge label={severity.toUpperCase()} severity={severity === 'critical' ? 'critical' : severity === 'high' ? 'warning' : 'neutral'} variant="glass" />
      </div>
      <LpdText size="sm" className="text-text-main leading-relaxed">
        {description}
      </LpdText>
      {affectedModules.length > 0 && (
         <div className="mt-2 pt-2 border-t border-current/10">
            <LpdText size="nano" className="opacity-70 mb-1">AFFECTED SYSTEMS:</LpdText>
            <div className="flex flex-wrap gap-1">
                {affectedModules.map(mod => (
                    <span key={mod} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-background-surface border border-current/20 opacity-80">
                        {mod}
                    </span>
                ))}
            </div>
         </div>
      )}
    </div>
  );
};

// --- DIFF BLOCK ---
interface DiffBlockProps {
  changes: Array<{ type: 'added' | 'removed' | 'modified'; label: string }>;
  onViewDetails?: () => void;
}

export const DiffBlock: React.FC<DiffBlockProps> = ({ changes, onViewDetails }) => (
  <div className="flex flex-col gap-3">
    <div className="flex flex-col gap-2">
      {changes.map((change, idx) => {
         const color = change.type === 'added' ? 'text-green-500 bg-green-500/10 border-green-500/20' : 
                       change.type === 'removed' ? 'text-red-500 bg-red-500/10 border-red-500/20' : 
                       'text-blue-500 bg-blue-500/10 border-blue-500/20';
         const symbol = change.type === 'added' ? '+' : change.type === 'removed' ? '-' : '~';
         
         return (
            <div key={idx} className={cn("flex items-center gap-3 p-2 rounded border font-mono text-xs", color)}>
                <span className="font-bold w-4 text-center opacity-80">{symbol}</span>
                <span>{change.label}</span>
            </div>
         );
      })}
    </div>
    {onViewDetails && (
        <Button size="sm" variant="ghost" fullWidth onClick={onViewDetails}>
            View Full Comparison
        </Button>
    )}
  </div>
);

// --- GOVERNANCE BLOCK ---
interface ApprovalStep {
    role: string;
    status: 'pending' | 'approved' | 'rejected' | 'skipped';
    actor?: string;
    date?: string;
}

export const GovernanceBlock: React.FC<{ steps: ApprovalStep[] }> = ({ steps }) => (
    <div className="flex flex-col relative pl-2 py-2">
        <div className="absolute left-[11px] top-4 bottom-4 w-px bg-border-technical" />
        {steps.map((step, idx) => {
            const isLast = idx === steps.length - 1;
            const statusColor = step.status === 'approved' ? 'bg-green-500' : step.status === 'pending' ? 'bg-blue-500 animate-pulse' : 'bg-border-technical';
            
            return (
                <div key={idx} className="flex gap-4 items-start relative pb-6 last:pb-0">
                    <div className={cn("w-2.5 h-2.5 rounded-full z-10 mt-1 border border-background-surface", statusColor)} />
                    <div className="flex flex-col gap-0.5">
                        <LpdText size="xs" weight="bold" className="text-text-main uppercase tracking-tight">
                            {step.role}
                        </LpdText>
                        <LpdText size="nano" className="text-text-muted font-mono">
                            {step.status.toUpperCase()} {step.actor ? `by ${step.actor}` : ''}
                        </LpdText>
                    </div>
                </div>
            )
        })}
    </div>
);
