'use client';

import React from 'react';
import { LpdText, Icon, TechnicalCard } from '../../../atoms';
import { SuiteHomeAction } from './types';

interface SuiteHomeQuickStartProps {
  actions: SuiteHomeAction[];
}

/**
 * @component SuiteHomeQuickStart
 * @description Bloque de acciones rápidas. El título lo gestiona el layout padre.
 */
export const SuiteHomeQuickStart: React.FC<SuiteHomeQuickStartProps> = ({ actions }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action) => (
        <TechnicalCard
          key={action.id}
          variant="interactive"
          onClick={action.onClick}
          className="flex flex-col items-start gap-3 p-4"
        >
          <div className="flex items-center justify-between w-full">
            <div className="p-2 rounded-lg bg-background-subtle group-hover:bg-primary/10 transition-colors duration-300">
              <Icon name={action.icon} size="sm" className="text-text-muted group-hover:text-primary" />
            </div>
            <Icon name="arrow_forward" size="sm" className="text-text-muted opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </div>
          
          <div className="flex flex-col items-start">
            <LpdText size="sm" weight="bold" className="text-text-main group-hover:text-primary transition-colors">
              {action.label}
            </LpdText>
            <LpdText size="nano" className="text-text-muted">
              {action.description}
            </LpdText>
          </div>
        </TechnicalCard>
      ))}
    </div>
  );
};
