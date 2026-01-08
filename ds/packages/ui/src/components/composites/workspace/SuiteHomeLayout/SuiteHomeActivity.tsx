'use client';

import React from 'react';
import { LpdText, TechnicalSurface, Icon } from '../../../atoms';
import { SuiteHomeActivityItem } from './types';

interface SuiteHomeActivityProps {
  activity: SuiteHomeActivityItem[];
}

export const SuiteHomeActivity: React.FC<SuiteHomeActivityProps> = ({ activity }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <LpdText size="sm" weight="bold" className="text-text-muted uppercase tracking-widest">
          {`// Recent Activity`}
        </LpdText>
      </div>

      <div className="flex flex-col gap-2">
        {activity.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className="flex items-center gap-4 p-3 bg-surface-elevated/50 border border-border-technical rounded-lg hover:border-primary/20 transition-all duration-200 group"
          >
            <div className="flex flex-col flex-1 min-w-0">
              <LpdText size="sm" weight="bold" className="text-text-main truncate group-hover:text-primary transition-colors">
                {item.action}
              </LpdText>
              <div className="flex items-center gap-2">
                <LpdText size="nano" className="text-text-muted uppercase font-mono tracking-tighter opacity-60">
                  {item.module}
                </LpdText>
                <span className="text-[10px] text-text-muted opacity-20">|</span>
                <LpdText size="nano" className="text-text-muted font-mono italic">
                  {item.timestamp}
                </LpdText>
              </div>
            </div>
            <Icon name="chevron_right" size="sm" className="text-text-muted opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </a>
        ))}
      </div>
    </div>
  );
};
