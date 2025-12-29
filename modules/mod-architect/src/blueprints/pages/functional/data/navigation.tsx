
import React from 'react';
import { ComponentEntry } from '../types';
import { Breadcrumbs } from '../components/functional/Breadcrumbs/index';
import { MultiLevelSidebar } from '../components/functional/MultiLevelSidebar/index';
import { Accordion } from '../components/functional/Accordion/index';
import { NestedTabs } from '../components/functional/NestedTabs/index';
import { Stepper } from '../components/functional/Stepper/index';
import { VerticalStepper } from '../components/functional/VerticalStepper/index';

export const navigationData: ComponentEntry[] = [
  {
    id: 'multi-level-sidebar',
    title: 'Recursive Nav',
    category: 'Navigation',
    description: 'Infinite depth nesting capability.',
    size: 'tall', 
    component: (
      <div className="w-full h-full min-h-[400px] bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex items-center justify-center">
        <MultiLevelSidebar 
          items={[
            { id: '1', label: 'Dashboard', icon: 'dashboard' },
            { 
              id: '2', 
              label: 'Projects',
              children: [
                { id: '2-1', label: 'Active' },
                { id: '2-2', label: 'Archived' },
                { id: '2-3', label: 'Settings', children: [{ id: '2-3-1', label: 'General' }] }
              ]
            },
            { id: '3', label: 'Team' }
          ]}
        />
      </div>
    )
  },
  {
    id: 'stepper',
    title: 'Workflow Stepper',
    category: 'Navigation',
    description: 'Multi-step process guidance.',
    size: 'wide',
    component: (
      <div className="w-full max-w-2xl px-8 py-4">
        <Stepper />
      </div>
    )
  },
  {
    id: 'vertical-stepper',
    title: 'Project Setup',
    category: 'Navigation',
    description: 'Vertical progress timeline.',
    size: 'medium',
    component: (
      <div className="w-full max-w-sm px-4">
        <VerticalStepper />
      </div>
    )
  },
  {
    id: 'nested-tabs',
    title: 'Nested Tabs',
    category: 'Navigation',
    description: 'Contextual view switching.',
    size: 'medium',
    component: (
      <div className="w-full max-w-sm transform scale-90 md:scale-100 transition-transform">
        <NestedTabs 
          defaultActiveId="structure"
          items={[
            { 
              id: 'overview', 
              label: 'Overview', 
              content: <div className="text-slate-400 text-xs text-center py-4">Overview Data</div> 
            },
            { 
              id: 'structure', 
              label: 'Structure', 
              content: (
                <div className="flex flex-col gap-2">
                   <div className="w-2/3 h-2 bg-slate-100 dark:bg-slate-700 rounded animate-pulse"></div>
                   <div className="w-1/2 h-2 bg-slate-100 dark:bg-slate-700 rounded animate-pulse"></div>
                </div>
              ) 
            },
            { 
              id: 'settings', 
              label: 'Settings', 
              content: <div className="text-slate-400 text-xs text-center py-4">Configuration</div> 
            }
          ]}
        />
      </div>
    )
  },
  {
    id: 'breadcrumbs',
    title: 'Breadcrumbs',
    category: 'Navigation',
    description: 'Hierarchical path tracking.',
    size: 'small',
    component: (
      <div className="w-full p-6 bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
         <Breadcrumbs
            items={[
              { label: 'System', href: '#' },
              { label: 'Library', href: '#' },
              { label: 'Navigation', active: true }
            ]}
         />
      </div>
    )
  },
  {
    id: 'accordion',
    title: 'Accordion',
    category: 'Navigation',
    description: 'Progressive disclosure sections.',
    size: 'medium',
    component: (
      <div className="w-full max-w-sm">
        <Accordion 
          items={[
            { id: '1', title: 'System Core', content: 'Central processing unit details.' },
            { id: '2', title: 'Modules', content: 'Active module configuration.' },
            { id: '3', title: 'Diagnostics', content: 'System health check results.' }
          ]}
        />
      </div>
    )
  }
];
