'use client';

import React from 'react';
import { LpdText, cn } from '@loopdev/ui';

interface DoDontItem {
  type: 'do' | 'dont';
  label: string;
  description: string;
}

export interface InspectionDoDontProps {
  items: DoDontItem[];
}

export const InspectionDoDont: React.FC<InspectionDoDontProps> = ({ items }) => {
  return (
    <div className="flex flex-col gap-4">
      {items.map((item, i) => (
        <div 
          key={i} 
          className={cn(
            "p-4 rounded-xl border flex gap-3",
            item.type === 'do' 
              ? "bg-green-500/5 border-green-500/20" 
              : "bg-red-500/5 border-red-500/20"
          )}
        >
          <span className={cn(
            "material-symbols-outlined text-lg",
            item.type === 'do' ? "text-green-600" : "text-red-600"
          )}>
            {item.type === 'do' ? 'check_circle' : 'cancel'}
          </span>
          <div className="flex flex-col gap-0.5">
            <LpdText size="xs" weight="bold" className="text-text-main uppercase tracking-tight">
              {item.type === 'do' ? 'Recommended Usage' : 'Restricted Usage'}
            </LpdText>
            <LpdText size="xs" className="text-text-muted leading-relaxed">
              <span className="font-bold text-text-main">{item.label}:</span> {item.description}
            </LpdText>
          </div>
        </div>
      ))}
    </div>
  );
};
