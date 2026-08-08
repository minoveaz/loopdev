'use client';

import React from 'react';
import { RuleDomain } from '@loopdev/contracts';
import { Heading, LpdText, Button } from '@loopdev/ui';
import { clsx } from 'clsx';

interface DomainStats {
  id: RuleDomain | 'all';
  label: string;
  count: number;
  blockers: number;
  warnings: number;
  icon: string;
}

interface RuleDomainRailProps {
  activeDomain: RuleDomain | 'all';
  onDomainChange: (domain: RuleDomain | 'all') => void;
  stats: Record<RuleDomain | 'all', { count: number; blockers: number; warnings: number }>;
}

const DOMAINS: Array<{ id: RuleDomain | 'all'; label: string; icon: string }> = [
  { id: 'all', label: 'All Rules', icon: 'list' },
  { id: 'identity', label: 'Identity', icon: 'book' },
  { id: 'visual', label: 'Visual System', icon: 'palette' },
  { id: 'typography', label: 'Typography', icon: 'text_fields' },
  { id: 'content', label: 'Content', icon: 'edit_note' },
];

/**
 * @composite RuleDomainRail
 * @description Sidebar navigation for rules, grouping them by domain with telemetry indicators.
 */
export const RuleDomainRail: React.FC<RuleDomainRailProps> = ({
  activeDomain,
  onDomainChange,
  stats
}) => {
  return (
    <div className="w-64 flex flex-col gap-2 border-r border-border-technical/50 pr-6">
      <Heading as="h2" size="sm" weight="bold" className="text-text-muted uppercase tracking-widest mb-4 px-4">
        Rule Domains
      </Heading>

      {DOMAINS.map((domain) => {
        const isActive = activeDomain === domain.id;
        const domainStats = stats[domain.id];

        return (
          <Button
            key={domain.id}
            variant="ghost"
            onClick={() => onDomainChange(domain.id)}
            className={clsx(
              "group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-left",
              isActive 
                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                : "bg-transparent text-text-muted hover:bg-background-subtle hover:text-text-main"
            )}
          >
            <div className="flex items-center gap-3">
              <span className={clsx(
                "material-symbols-outlined text-xl",
                isActive ? "text-white" : "text-text-muted group-hover:text-primary"
              )}>
                {domain.icon}
              </span>
              <LpdText size="sm" weight={isActive ? "bold" : "medium"} className="inherit">
                {domain.label}
              </LpdText>
            </div>

            <div className="flex items-center gap-1.5">
              {domainStats.blockers > 0 && (
                <span className={clsx(
                  "w-1.5 h-1.5 rounded-full bg-red-500",
                  isActive && "bg-white ring-2 ring-red-500"
                )}></span>
              )}
              <span className={clsx(
                "text-[10px] font-mono font-bold px-1.5 py-0.5 rounded",
                isActive ? "bg-white/20 text-white" : "bg-background-subtle text-text-muted"
              )}>
                {domainStats.count}
              </span>
            </div>
          </Button>
        );
      })}

      <div className="mt-8 pt-8 border-t border-border-technical/30 px-4">
        <div className="flex flex-col gap-4 p-4 rounded-2xl bg-background-subtle/50 border border-border-technical border-dashed">
          <Heading as="h3" size="sm" weight="bold" className="text-text-muted uppercase">Health Summary</Heading>
          <div className="flex items-center justify-between">
            <LpdText size="xs" className="text-text-muted">Blocking</LpdText>
            <span className="text-xs font-bold text-red-500">{stats.all.blockers}</span>
          </div>
          <div className="flex items-center justify-between">
            <LpdText size="xs" className="text-text-muted">Warnings</LpdText>
            <span className="text-xs font-bold text-yellow-600">{stats.all.warnings}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
