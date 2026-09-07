'use client';

import React from 'react';
import { RuleDomain } from '@loopdev/contracts';
import { Heading, LpdText, Button } from '@loopdev/ui';
import { clsx } from 'clsx';

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
    <div className="border-border-technical/50 flex w-64 flex-col gap-2 border-r pr-6">
      <Heading as="h2" size="sm" weight="bold" className="text-text-muted mb-4 px-4 uppercase tracking-widest">
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
              "group flex items-center justify-between rounded-xl px-4 py-3 text-left transition-all duration-200",
              isActive
                ? "bg-primary shadow-primary/20 text-white shadow-lg"
                : "text-text-muted hover:bg-background-subtle hover:text-text-main bg-transparent"
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
                  "h-1.5 w-1.5 rounded-full bg-red-500",
                  isActive && "bg-white ring-2 ring-red-500"
                )}></span>
              )}
              <span className={clsx(
                "rounded px-1.5 py-0.5 font-mono text-[10px] font-bold",
                isActive ? "bg-white/20 text-white" : "bg-background-subtle text-text-muted"
              )}>
                {domainStats.count}
              </span>
            </div>
          </Button>
        );
      })}

      <div className="border-border-technical/30 mt-8 border-t px-4 pt-8">
        <div className="bg-background-subtle/50 border-border-technical flex flex-col gap-4 rounded-2xl border border-dashed p-4">
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
