'use client';

import React from 'react';
import { LpdText } from '../../../atoms';
import { ModuleCard } from '../ModuleCard';
import { SuiteHomeModule } from './types';

interface SuiteHomeModulesProps {
  modules: SuiteHomeModule[];
}

export const SuiteHomeModules: React.FC<SuiteHomeModulesProps> = ({ modules }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {modules.map((module) => (
        <ModuleCard
          key={module.id}
          statusBadge={module.status}
          statusTone={
            module.status === 'active' ? 'success' :
            module.status === 'deploying' ? 'warning' : 'neutral'
          }
                      title={module.name} 
                      footerContent={
                        <LpdText size="sm" className="text-text-muted leading-relaxed line-clamp-2">
                          {module.description}
                        </LpdText>
                      }          onClick={module.onOpen}
        />
      ))}
    </div>
  );
};