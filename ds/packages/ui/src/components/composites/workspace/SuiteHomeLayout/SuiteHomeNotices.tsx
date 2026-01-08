'use client';

import React from 'react';
import { LpdText, Icon } from '../../../atoms';
import { SuiteNotice } from './types';

export interface SuiteHomeNoticesProps {
  notices: SuiteNotice[];
}

export const SuiteHomeNotices: React.FC<SuiteHomeNoticesProps> = ({ notices }) => {
  if (!notices || notices.length === 0) return null;

  return (
    <div className="w-full flex flex-col">
      {notices.map((notice) => (
        <div 
          key={notice.id}
          className={`
            flex items-center justify-between px-8 py-2 border-b border-border-technical
            ${notice.severity === 'warning' ? 'bg-energy-yellow/5' : ''}
            ${notice.severity === 'danger' ? 'bg-danger/5' : ''}
            ${notice.severity === 'info' ? 'bg-primary/5' : ''}
          `}
        >
          <div className="flex items-center gap-3">
            <Icon 
              name={notice.severity === 'warning' ? 'warning' : 'info'} 
              size="sm" 
              className={`
                ${notice.severity === 'warning' ? 'text-energy-yellow' : ''}
                ${notice.severity === 'danger' ? 'text-danger' : ''}
                ${notice.severity === 'info' ? 'text-primary' : ''}
              `}
            />
            <LpdText size="xs" weight="medium" className="text-text-main">
              {notice.title}
            </LpdText>
          </div>

          {notice.primaryAction && (
            <button 
              onClick={notice.primaryAction.onClick}
              className="text-micro font-bold uppercase tracking-widest text-primary hover:underline"
            >
              {notice.primaryAction.label}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
