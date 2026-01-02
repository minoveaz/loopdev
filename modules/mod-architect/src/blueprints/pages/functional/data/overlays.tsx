
import React from 'react';
import { ComponentEntry } from '@blueprints/pages/functional/types';
import { Drawer, useDrawer } from '@blueprints/components/functional/Drawer/index';

// --- Local Interactive Wrappers for Overlays ---
const DrawerShowcase = () => {
  const { isOpen, open, close } = useDrawer();
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <button 
        onClick={open}
        className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-[#0d121b] text-white rounded-2xl overflow-hidden transition-all hover:scale-105 shadow-xl shadow-blue-900/20"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-blue-500 to-primary opacity-20 group-hover:opacity-30 animate-shimmer-slow" />
        <span className="material-symbols-outlined">side_navigation</span>
        <span className="font-bold">Trigger Drawer</span>
      </button>
      <Drawer isOpen={isOpen} onClose={close} title="Settings Panel">
        <div className="space-y-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
            <h4 className="text-primary font-bold mb-1">Interactive Demo</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">This drawer maintains context while overlaying information.</p>
          </div>
          <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
        </div>
        <Drawer.Footer>
          <button onClick={close} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-800">Close</button>
          <button onClick={close} className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg shadow-lg shadow-primary/30">Confirm</button>
        </Drawer.Footer>
      </Drawer>
    </div>
  );
};

export const overlaysData: ComponentEntry[] = [
  {
    id: 'drawer',
    title: 'Off-Canvas',
    category: 'Overlays',
    description: 'Contextual overlays for complex actions.',
    size: 'medium',
    component: <DrawerShowcase />
  }
];
