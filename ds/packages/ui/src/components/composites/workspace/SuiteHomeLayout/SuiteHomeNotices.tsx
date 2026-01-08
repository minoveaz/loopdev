'use client';

import React from 'react';
import { LpdText, IconButton, Icon } from '../../../atoms';
import { SuiteHomeNotice } from './types';

export interface SuiteHomeNoticesProps {
  notices: SuiteHomeNotice[];
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
            ${notice.tone === 'warning' ? 'bg-energy-yellow/5' : ''}
            ${notice.tone === 'danger' ? 'bg-danger/5' : ''}
            ${notice.tone === 'info' ? 'bg-primary/5' : ''}
          `}
        >
          <div className="flex items-center gap-3">
            <Icon 
              name={notice.tone === 'warning' ? 'warning' : 'info'} 
              size="sm" 
              className={`
                ${notice.tone === 'warning' ? 'text-energy-yellow' : ''}
                ${notice.tone === 'danger' ? 'text-danger' : ''}
                ${notice.tone === 'info' ? 'text-primary' : ''}
              `}
            />
            <LpdText size="sm" weight="medium" className="text-text-main">
              {notice.message}
            </LpdText>
          </div>

          {notice.action && (
            <button 
              onClick={notice.action.onClick}
              className="text-micro font-bold uppercase tracking-widest text-primary hover:underline"
            >
              {notice.action.label}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
