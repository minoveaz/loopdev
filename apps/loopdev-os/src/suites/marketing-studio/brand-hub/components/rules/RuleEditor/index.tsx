'use client';

import React, { useState } from 'react';
import { RuleEditorProps } from './types';
import { LpdText, Button, Input, TechnicalStatusBadge } from '@loopdev/ui';
import { DomainBadge } from '../DomainBadge';
import { SeverityBadge } from '../SeverityBadge';
import { clsx } from 'clsx';

/**
 * @composite RuleEditor
 * @description Declarative configuration panel for governance rules.
 * Handles both "Published" (Read-only) and "Draft" (Editable) states.
 */
export const RuleEditor: React.FC<RuleEditorProps> = ({
  rule,
  isEditable = false,
  onSave
}) => {
  const [localRule, setLocalRule] = useState(rule);

  // Helper for input labels
  const FieldLabel = ({ children }: { children: React.ReactNode }) => (
    <LpdText size="xs" weight="bold" className="text-text-muted uppercase tracking-widest mb-2 block">
      {children}
    </LpdText>
  );

  return (
    <div className="flex flex-col gap-10 p-8 bg-background-surface rounded-3xl border border-border-technical shadow-sm animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* 1. HEADER: Metadata & Main Switch */}
      <header className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-text-main tracking-tight">{localRule.name}</h2>
            <DomainBadge domain={localRule.domain} size="sm" />
          </div>
          <LpdText size="xs" className="text-text-muted font-mono uppercase opacity-60">
            ID: {localRule.id} // Updated by {localRule.updatedBy || 'System'}
          </LpdText>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end gap-1">
             <LpdText size="nano" weight="bold" className="text-text-muted uppercase">Status</LpdText>
             <div className="flex items-center gap-2">
                <span className={clsx(
                  "w-2 h-2 rounded-full",
                  localRule.status === 'active' ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-slate-400"
                )} />
                <LpdText size="sm" weight="bold" className="text-text-main capitalize">{localRule.status}</LpdText>
             </div>
          </div>
        </div>
      </header>

      {/* 2. LOGIC CONSTRUCTION (The "Brain") */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-border-technical/30">
        <div className="flex flex-col gap-6">
          <LpdText size="sm" weight="bold" className="text-primary uppercase tracking-tighter italic">01. Logic Definition</LpdText>
          
          <div>
            <FieldLabel>Applies To (Target)</FieldLabel>
            <div className="p-3 rounded-xl bg-background-subtle border border-border-technical font-mono text-xs text-text-main">
              {localRule.scope.target} {localRule.scope.filter && `where ${localRule.scope.filter}`}
            </div>
          </div>

          <div>
            <FieldLabel>Condition (Metric & Operator)</FieldLabel>
            <div className="flex items-center gap-2">
              <div className="flex-1 p-3 rounded-xl bg-background-subtle border border-border-technical font-mono text-xs text-primary font-bold">
                {localRule.logic.metric}
              </div>
              <div className="px-3 py-2 rounded-lg bg-background-surface border border-border-technical font-bold text-text-main">
                {localRule.logic.operator}
              </div>
              <div className="w-24">
                <Input 
                  value={String(localRule.logic.threshold)} 
                  disabled={!isEditable}
                  className="font-mono text-center h-10"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <LpdText size="sm" weight="bold" className="text-primary uppercase tracking-tighter italic">02. Enforcement & Severity</LpdText>
          
          <div>
            <FieldLabel>Outcome Severity</FieldLabel>
            <div className="flex gap-3">
              {['WARN', 'BLOCK'].map((s) => (
                <button
                  key={s}
                  disabled={!isEditable}
                  className={clsx(
                    "flex-1 py-2 rounded-xl border font-bold text-xs transition-all",
                    localRule.enforcement.severity === s 
                      ? (s === 'BLOCK' ? "bg-red-500 border-red-600 text-white" : "bg-yellow-500 border-yellow-600 text-black")
                      : "bg-background-subtle border-border-technical text-text-muted opacity-40"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-background-subtle/50 border border-border-technical">
              <LpdText size="nano" weight="bold" className="text-text-muted uppercase mb-2">Block Publish</LpdText>
              <div className="text-sm font-bold text-text-main">{localRule.enforcement.blockPublish ? 'YES' : 'NO'}</div>
            </div>
            <div className="p-4 rounded-2xl bg-background-subtle/50 border border-border-technical">
              <LpdText size="nano" weight="bold" className="text-text-muted uppercase mb-2">Requires Sign-off</LpdText>
              <div className="text-sm font-bold text-text-main">{localRule.approval.required ? 'YES' : 'NO'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EXPLAINABILITY (The "Meaning") */}
      <section className="flex flex-col gap-6 pt-8 border-t border-border-technical/30">
        <LpdText size="sm" weight="bold" className="text-primary uppercase tracking-tighter italic">03. Explainability Templates</LpdText>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 flex flex-col gap-4">
            <div>
              <FieldLabel>The "Why" (Reasoning)</FieldLabel>
              <textarea 
                readOnly={!isEditable}
                value={localRule.explain.why}
                className="w-full h-32 p-4 rounded-2xl bg-background-subtle border border-border-technical text-xs text-text-muted leading-relaxed resize-none focus:border-primary outline-none transition-colors"
              />
            </div>
          </div>
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FieldLabel>The Risk (Impact)</FieldLabel>
              <textarea 
                readOnly={!isEditable}
                value={localRule.explain.risk}
                className="w-full h-32 p-4 rounded-2xl bg-background-subtle border border-border-technical text-xs text-text-muted leading-relaxed resize-none outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <FieldLabel>How to Fix (Remediation)</FieldLabel>
              <textarea 
                readOnly={!isEditable}
                value={localRule.explain.howToFix}
                className="w-full h-32 p-4 rounded-2xl bg-background-subtle border border-border-technical text-xs text-text-muted leading-relaxed resize-none outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. DRAFT ACTIONS */}
      {isEditable && (
        <footer className="flex justify-end gap-4 pt-8 border-t border-border-technical/30">
          <Button variant="ghost" size="sm">Discard Changes</Button>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => onSave?.(localRule)}
          >
            Update Rule Logic
          </Button>
        </footer>
      )}

      {!isEditable && (
        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-between">
          <div className="flex items-center gap-3 text-primary">
            <span className="material-symbols-outlined">lock</span>
            <LpdText size="xs" weight="bold">Rule is currently PUBLISHED and read-only.</LpdText>
          </div>
          <Button variant="ghost" size="xs" className="text-primary font-bold">CREATE DRAFT TO EDIT</Button>
        </div>
      )}

    </div>
  );
};
