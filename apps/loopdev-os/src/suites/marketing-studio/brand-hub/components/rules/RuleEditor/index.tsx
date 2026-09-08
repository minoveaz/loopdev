'use client';

import React, { useState } from 'react';
import { RuleEditorProps } from './types';
import { Heading, LpdText, Button, Input } from '@loopdev/ui';
import { DomainBadge } from '../DomainBadge';
import { clsx } from 'clsx';

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <LpdText size="xs" weight="bold" className="text-text-muted mb-2 block uppercase tracking-widest">
    {children}
  </LpdText>
);

/**
 * @composite RuleEditor
 * @description Declarative configuration panel for governance rules.
 * Handles both "Published" (Read-only) and "Draft" (Editable) states.
 */
export const RuleEditor: React.FC<RuleEditorProps> = ({ rule, isEditable = false, onSave }) => {
  const [localRule] = useState(rule);

  return (
    <div className="bg-background-surface border-border-technical animate-in fade-in slide-in-from-right-4 flex flex-col gap-10 rounded-3xl border p-8 shadow-sm duration-500">
      {/* 1. HEADER: Metadata & Main Switch */}
      <header className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Heading as="h2" size="2xl" weight="bold" className="text-text-main tracking-tight">
              {localRule.name}
            </Heading>
            <DomainBadge domain={localRule.domain} size="sm" />
          </div>
          <LpdText size="xs" className="text-text-muted font-mono uppercase opacity-60">
            ID: {localRule.id}
            {' // Updated by '}
            {localRule.updatedBy || 'System'}
          </LpdText>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end gap-1">
            <LpdText size="nano" weight="bold" className="text-text-muted uppercase">
              Status
            </LpdText>
            <div className="flex items-center gap-2">
              <span
                className={clsx(
                  'h-2 w-2 rounded-full',
                  localRule.status === 'active'
                    ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]'
                    : 'bg-slate-400',
                )}
              />
              <LpdText size="sm" weight="bold" className="text-text-main capitalize">
                {localRule.status}
              </LpdText>
            </div>
          </div>
        </div>
      </header>

      {/* 2. LOGIC CONSTRUCTION (The "Brain") */}
      <section className="border-border-technical/30 grid grid-cols-1 gap-8 border-t pt-8 md:grid-cols-2">
        <div className="flex flex-col gap-6">
          <Heading
            as="h2"
            size="sm"
            weight="bold"
            className="text-primary uppercase italic tracking-tighter"
          >
            01. Logic Definition
          </Heading>

          <div>
            <FieldLabel>Applies To (Target)</FieldLabel>
            <div className="bg-background-subtle border-border-technical text-text-main rounded-xl border p-3 font-mono text-xs">
              {localRule.scope.target} {localRule.scope.filter && `where ${localRule.scope.filter}`}
            </div>
          </div>

          <div>
            <FieldLabel>Condition (Metric & Operator)</FieldLabel>
            <div className="flex items-center gap-2">
              <div className="bg-background-subtle border-border-technical text-primary flex-1 rounded-xl border p-3 font-mono text-xs font-bold">
                {localRule.logic.metric}
              </div>
              <div className="bg-background-surface border-border-technical text-text-main rounded-lg border px-3 py-2 font-bold">
                {localRule.logic.operator}
              </div>
              <div className="w-24">
                <Input
                  value={String(localRule.logic.threshold)}
                  disabled={!isEditable}
                  className="h-10 text-center font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <Heading
            as="h2"
            size="sm"
            weight="bold"
            className="text-primary uppercase italic tracking-tighter"
          >
            02. Enforcement & Severity
          </Heading>

          <div>
            <FieldLabel>Outcome Severity</FieldLabel>
            <div className="flex gap-3">
              {['WARN', 'BLOCK'].map((s) => (
                <Button
                  key={s}
                  variant="ghost"
                  disabled={!isEditable}
                  className={clsx(
                    'flex-1 rounded-xl border py-2 text-xs font-bold transition-all',
                    localRule.enforcement.severity === s
                      ? s === 'BLOCK'
                        ? 'border-red-600 bg-red-500 text-white'
                        : 'border-yellow-600 bg-yellow-500 text-black'
                      : 'bg-background-subtle border-border-technical text-text-muted opacity-40',
                  )}
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-background-subtle/50 border-border-technical rounded-2xl border p-4">
              <LpdText size="nano" weight="bold" className="text-text-muted mb-2 uppercase">
                Block Publish
              </LpdText>
              <div className="text-text-main text-sm font-bold">
                {localRule.enforcement.blockPublish ? 'YES' : 'NO'}
              </div>
            </div>
            <div className="bg-background-subtle/50 border-border-technical rounded-2xl border p-4">
              <LpdText size="nano" weight="bold" className="text-text-muted mb-2 uppercase">
                Requires Sign-off
              </LpdText>
              <div className="text-text-main text-sm font-bold">
                {localRule.approval.required ? 'YES' : 'NO'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EXPLAINABILITY (The "Meaning") */}
      <section className="border-border-technical/30 flex flex-col gap-6 border-t pt-8">
        <Heading
          as="h2"
          size="sm"
          weight="bold"
          className="text-primary uppercase italic tracking-tighter"
        >
          03. Explainability Templates
        </Heading>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex flex-col gap-4 md:col-span-1">
            <div>
              <FieldLabel>The &quot;Why&quot; (Reasoning)</FieldLabel>
              <textarea
                readOnly={!isEditable}
                value={localRule.explain.why}
                className="bg-background-subtle border-border-technical text-text-muted focus:border-primary h-32 w-full resize-none rounded-2xl border p-4 text-xs leading-relaxed outline-none transition-colors"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:col-span-2 md:grid-cols-2">
            <div>
              <FieldLabel>The Risk (Impact)</FieldLabel>
              <textarea
                readOnly={!isEditable}
                value={localRule.explain.risk}
                className="bg-background-subtle border-border-technical text-text-muted focus:border-primary h-32 w-full resize-none rounded-2xl border p-4 text-xs leading-relaxed outline-none transition-colors"
              />
            </div>
            <div>
              <FieldLabel>How to Fix (Remediation)</FieldLabel>
              <textarea
                readOnly={!isEditable}
                value={localRule.explain.howToFix}
                className="bg-background-subtle border-border-technical text-text-muted focus:border-primary h-32 w-full resize-none rounded-2xl border p-4 text-xs leading-relaxed outline-none transition-colors"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. DRAFT ACTIONS */}
      {isEditable && (
        <footer className="border-border-technical/30 flex justify-end gap-4 border-t pt-8">
          <Button variant="ghost" size="sm">
            Discard Changes
          </Button>
          <Button variant="primary" size="sm" onClick={() => onSave?.(localRule)}>
            Update Rule Logic
          </Button>
        </footer>
      )}

      {!isEditable && (
        <div className="bg-primary/5 border-primary/10 flex items-center justify-between rounded-2xl border p-4">
          <div className="text-primary flex items-center gap-3">
            <span className="material-symbols-outlined">lock</span>
            <LpdText size="xs" weight="bold">
              Rule is currently PUBLISHED and read-only.
            </LpdText>
          </div>
          <Button variant="ghost" size="sm" className="text-primary font-bold">
            CREATE DRAFT TO EDIT
          </Button>
        </div>
      )}
    </div>
  );
};
