import React from 'react';
import { ModuleSidebarProps } from './types';
import { InspectorPanelProps } from '../../InspectorPanel/types';

export const MODULE_SIDEBAR_FIXTURES: Record<string, ModuleSidebarProps> = {
  default: {
    title: 'Navegación',
    search: {
      value: '',
      onChange: (v) => console.log('Search:', v),
    },
    children: (
      <div className="space-y-4 p-1">
        <div className="h-8 bg-primary/10 rounded border border-primary/20" />
        <div className="h-8 bg-background-subtle rounded" />
        <div className="h-8 bg-background-subtle rounded" />
      </div>
    )
  }
};

export const INSPECTOR_PANEL_FIXTURES: Record<string, InspectorPanelProps> = {
  default: {
    title: 'Atributos',
    subtitle: 'ID-90210',
    onClose: () => console.log('Close inspector'),
    children: (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-4 w-24 bg-background-subtle rounded" />
          <div className="h-20 bg-background-subtle rounded border border-border-technical" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-32 bg-background-subtle rounded" />
          <div className="h-20 bg-background-subtle rounded border border-border-technical" />
        </div>
      </div>
    )
  }
};
