import React from 'react';
import { ModuleCardProps } from './types';
import { LpdText } from '../../../atoms';

export const MODULE_CARD_FIXTURES: Record<string, ModuleCardProps> = {
  brandHub: {
    statusBadge: 'Active',
    statusTone: 'success',
    title: <>Brand<br/>Hub</>,
    footerContent: <LpdText size="xs" className="text-text-muted">Manage Identity</LpdText>,
    footerIcon: 'palette',
    onClick: () => console.log('Opening Brand Hub...')
  },
  contentEngine: {
    statusBadge: 'Deploying',
    statusTone: 'warning',
    title: <>Content<br/>Engine</>,
    footerContent: <LpdText size="xs" className="text-text-muted">Generative AI</LpdText>,
    footerIcon: 'auto_awesome',
    onClick: () => console.log('Opening Content Engine...')
  },
  assetManager: {
    statusBadge: 'Locked',
    statusTone: 'neutral',
    title: <>Asset<br/>Manager</>,
    footerContent: <LpdText size="xs" className="text-text-muted">DAM Centralized</LpdText>,
    footerIcon: 'folder',
    onClick: () => console.log('Opening Asset Manager...')
  }
};
