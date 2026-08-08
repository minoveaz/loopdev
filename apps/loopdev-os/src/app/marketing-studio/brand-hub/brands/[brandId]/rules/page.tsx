'use client';

import React, { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Heading, LpdText, TechnicalText, Skeleton, EmptyState, Button, Icon } from '@loopdev/ui';
import { useBrandHub } from '@/suites/marketing-studio/brand-hub/context';
import { useActiveBrand } from '@/hooks/brand-hub/useActiveBrand';
import {
  RuleDomain,
  RulesEngineSchema,
  type RulesEngine,
  type RuleDefinition,
} from '@loopdev/contracts';

// Industrial Components
import { RuleDomainRail } from '@/suites/marketing-studio/brand-hub/components/rules/RuleDomainRail';
import { RuleRow } from '@/suites/marketing-studio/brand-hub/components/rules/RuleRow';
import { RuleEditor } from '@/suites/marketing-studio/brand-hub/components/rules/RuleEditor';

// Data Source Fallback
import { LOOPDEV_RULES_ENGINE } from '@/suites/marketing-studio/brand-hub/fixtures/rules-data';

/**
 * @page BrandRulesPage
 * @description The control center for brand governance laws.
 * Manages declarative rules for Identity, Visual, and Typography.
 */
export default function BrandRulesPage() {
  const params = useParams();
  const brandId = params.brandId as string;
  const { setSelectedEntity } = useBrandHub();

  // Data Acquisition
  const { data: brand, isLoading } = useActiveBrand(brandId);

  // Support both snake_case (DB) and camelCase (Contract) + Fallback to Fixture for LoopDev brand
  const parsedRules = RulesEngineSchema.safeParse(brand?.rules_engine);
  const dbRules = parsedRules.success ? parsedRules.data : undefined;
  const rulesEngine: RulesEngine | undefined =
    dbRules?.rules && dbRules.rules.length > 0
      ? dbRules
      : brand?.name === 'LoopDev'
        ? LOOPDEV_RULES_ENGINE
        : dbRules;

  // Local State
  const [activeDomain, setActiveDomain] = useState<RuleDomain | 'all'>('all');
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // FILTERING LOGIC
  const filteredRules = useMemo(() => {
    if (!rulesEngine?.rules) return [];
    return rulesEngine.rules.filter((rule) => {
      const matchesDomain = activeDomain === 'all' || rule.domain === activeDomain;
      const matchesSearch = rule.name.toLowerCase().includes(search.toLowerCase());
      return matchesDomain && matchesSearch;
    });
  }, [rulesEngine, activeDomain, search]);

  // TELEMETRY LOGIC (For the Rail)
  const stats = useMemo(() => {
    const base = { count: 0, blockers: 0, warnings: 0 };
    const domains: Record<string, typeof base> = {
      all: { ...base },
      identity: { ...base },
      visual: { ...base },
      typography: { ...base },
      content: { ...base },
    };

    rulesEngine?.rules?.forEach((r) => {
      const update = (key: string) => {
        domains[key].count++;
        if (r.enforcement.severity === 'BLOCK') domains[key].blockers++;
        if (r.enforcement.severity === 'WARN') domains[key].warnings++;
      };
      update('all');
      update(r.domain);
    });

    return domains;
  }, [rulesEngine]);

  const selectedRule = useMemo(
    () => rulesEngine?.rules.find((r) => r.id === selectedRuleId),
    [rulesEngine, selectedRuleId],
  );

  const handleSelectRule = (rule: RuleDefinition) => {
    setSelectedRuleId(rule.id);
    setSelectedEntity({
      type: 'brand.rule',
      id: rule.id,
      name: rule.name,
    });
    // In a real scenario, we might want to auto-open inspector on 'Explain' tab
  };

  if (isLoading) {
    return (
      <div className="flex gap-8 p-8 h-full">
        <Skeleton className="w-64 h-[600px] rounded-3xl" />
        <div className="flex-1 flex flex-col gap-6">
          <Skeleton className="h-12 w-1/3 rounded-xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!rulesEngine) {
    return (
      <EmptyState
        title="Rules engine unavailable"
        description="Governance rules will appear after this brand has been configured."
        icon="rule"
        variant="ghost"
      />
    );
  }

  return (
    <div className="flex flex-col gap-8 p-8 max-w-[1600px] mx-auto animate-in fade-in duration-700 pb-32">
      {/* HEADER SECTION */}
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Heading
            as="h1"
            size="2xl"
            weight="bold"
            className="text-text-main tracking-tight uppercase"
          >
            Governance _RULES_ENGINE
          </Heading>
          <div className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase">
            v1.0 Declarative
          </div>
        </div>
        <LpdText size="sm" className="text-text-muted max-w-2xl leading-relaxed">
          Define the laws that govern your brand. These rules are automatically executed by the
          Inspector, AI Content Agents, and the Publishing Preflight system.
        </LpdText>
      </header>

      {/* MAIN CANVAS */}
      <main className="flex gap-8 items-start min-h-[700px]">
        {/* BLOCK A: Rule Domain Rail */}
        <RuleDomainRail
          activeDomain={activeDomain}
          onDomainChange={setActiveDomain}
          stats={stats}
        />

        {/* BLOCK B: Rule List */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex items-center gap-4 bg-background-surface p-2 rounded-2xl border border-border-technical/50">
            <div className="relative flex-1">
              <Icon
                name="search"
                size="sm"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                type="text"
                placeholder="Search rules by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-transparent text-sm text-text-main placeholder:text-text-muted/50 outline-none"
              />
            </div>
            <Button variant="ghost" size="sm" startIcon="filter_list">
              Filter
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            {filteredRules.length > 0 ? (
              filteredRules.map((rule) => (
                <RuleRow
                  key={rule.id}
                  rule={rule}
                  isSelected={selectedRuleId === rule.id}
                  onClick={() => handleSelectRule(rule)}
                />
              ))
            ) : (
              <div className="p-20 text-center border border-dashed border-border-technical rounded-3xl opacity-30 italic">
                No rules found in this domain.
              </div>
            )}
          </div>

          {/* BLOCK C: Rule Editor (Shown when selected) */}
          {selectedRule && (
            <div className="mt-4 pt-8 border-t border-border-technical/30">
              <RuleEditor
                rule={selectedRule}
                isEditable={brand?.status === 'draft'}
                onSave={(updated) => console.log('Save rule:', updated)}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
