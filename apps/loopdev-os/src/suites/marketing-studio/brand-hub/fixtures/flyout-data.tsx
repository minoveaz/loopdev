import React from 'react';
import { SidebarFlyoutProps } from '@loopdev/ui';

export const BRAND_HUB_FLYOUT_DATA: Record<string, SidebarFlyoutProps> = {
  'overview': {
    title: 'Brand Oracle Overview',
    description: 'Monitor the synchronization status and global health of your brand identities.',
    mode: 'learn',
    children: (
      <div className="flex flex-col gap-4">
        <p className="text-xs text-text-muted">
          The overview provides a consolidated view of all brands. You can track pending approvals, AI credit usage, and last activity logs.
        </p>
      </div>
    )
  },
  'visual': {
    title: 'Visual System Architecture',
    description: 'The atomic foundation of your brand identity. Changes here propagate to all consuming modules.',
    mode: 'navigate',
    links: [
      { id: 'l1', label: 'Chromatic DNA (Colors)', href: 'visual/colors', icon: 'palette' },
      { id: 'l2', label: 'Typography Roles', href: 'visual/typography', icon: 'text_fields' },
      { id: 'l3', label: 'Logo References', href: 'visual/logos', icon: 'category' }
    ],
    children: (
      <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
        <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-2">SYSTEM IMPACT</p>
        <p className="text-xs text-text-muted leading-relaxed">
          Tokens defined here are <strong>immutable by default</strong>. Sub-brands can only override tokens if explicitly allowed in the Rules Engine.
        </p>
      </div>
    )
  },
  'governance': {
    title: 'Governance & Compliance',
    description: 'Audit logs, approval workflows, and permission boundaries.',
    mode: 'learn',
    children: (
      <div className="flex flex-col gap-4">
        <div className="p-3 rounded-lg bg-energy-yellow/10 border border-energy-yellow/20">
          <p className="text-[10px] text-yellow-600 dark:text-yellow-500 font-bold uppercase tracking-wider mb-1">AUDIT READY</p>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            All changes to published versions require a signed approval from a Brand Admin.
          </p>
        </div>
      </div>
    )
  },
  'gov.rules': {
    title: 'Rules Engine',
    description: 'Machine-readable constraints for AI generation and compliance.',
    mode: 'learn',
    children: (
      <div className="flex flex-col gap-4">
        <div className="p-3 rounded-lg bg-energy-yellow/10 border border-energy-yellow/20">
          <p className="text-[10px] text-yellow-600 dark:text-yellow-500 font-bold uppercase tracking-wider mb-1">Governance Tip</p>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Define "Explainable Rules" to help our AI Content Engine understand the tone and visual limits of your brand.
          </p>
        </div>
      </div>
    )
  }
};
