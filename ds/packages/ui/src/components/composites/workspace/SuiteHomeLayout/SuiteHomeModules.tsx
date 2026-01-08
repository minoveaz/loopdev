'use client';

import React from 'react';
import { LpdText, StatusPulse, Button, Badge } from '../../../atoms';
import { SuiteHomeModule } from './types';

interface SuiteHomeModulesProps {
  modules: SuiteHomeModule[];
}

export const SuiteHomeModules: React.FC<SuiteHomeModulesProps> = ({ modules }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <LpdText size="sm" weight="bold" className="text-text-muted uppercase tracking-widest">
          {`// Operational Stations`}
        </LpdText>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <div 
            key={module.id}
            className="flex flex-col gap-6 p-6 bg-surface-elevated border border-border-technical rounded-2xl transition-all duration-300 hover:border-primary/20"
          >
            {/* Header: Name + Status */}
            <div className="flex items-center justify-between">
              <LpdText size="lg" weight="bold" className="text-text-main">
                {module.name}
              </LpdText>
              
              <div className="flex items-center gap-2 px-2 py-1 rounded bg-background-subtle border border-border-technical">
                <StatusPulse 
                  tone={
                    module.status === 'active' ? 'success' : 
                    module.status === 'deploying' ? 'warning' : 'neutral'
                  } 
                  size="sm" 
                />
                <LpdText size="nano" weight="bold" className="uppercase tracking-tighter opacity-60">
                  {module.status}
                </LpdText>
              </div>
            </div>

            {/* Body: Description */}
            <LpdText size="sm" className="text-text-muted leading-relaxed min-h-[40px]">
              {module.description}
            </LpdText>

            {/* Footer: Telemetry + CTA */}
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-border-technical border-dashed">
              <div className="flex flex-col">
                <LpdText size="nano" className="text-text-muted opacity-40 uppercase">Last Activity</LpdText>
                <LpdText size="nano" weight="bold" className="text-text-main font-mono">
                  {module.lastActivity || '--'}
                </LpdText>
              </div>

              <Button 
                variant={module.status === 'active' ? 'primary' : 'ghost'} 
                size="sm"
                onClick={module.onOpen}
                disabled={module.status === 'locked' || module.status === 'coming_soon'}
              >
                {module.ctaLabel}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
