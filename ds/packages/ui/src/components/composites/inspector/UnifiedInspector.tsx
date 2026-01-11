'use client';

import React, { useState } from 'react';
import { InspectorPanel } from '../workspace/InspectorPanel';
import { LpdText } from '../../atoms/foundations/Typography';
import { TechnicalStatusBadge } from '../../atoms/indicators/TechnicalStatusBadge';
import { Button } from '../../atoms/inputs/Button';
import { Divider } from '../../atoms/surfaces/Divider';
import { InspectorContext, InspectorTabId } from '../../../types/inspector';
import { cn } from '../../../helpers/cn';

interface UnifiedInspectorProps {
  context: InspectorContext;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  activeTab?: InspectorTabId;
  onTabChange?: (tab: InspectorTabId) => void;
}

const TABS: Array<{ id: InspectorTabId; label: string }> = [
  { id: 'context', label: 'Context' },
  { id: 'impact', label: 'Impact' },
  { id: 'diff', label: 'Diff' },
  { id: 'governance', label: 'Gov' },
];

/**
 * @component UnifiedInspector
 * @description The Global Shell for the ModuleInspector system.
 * Implements the standard layout, header, and tab navigation.
 */
export const UnifiedInspector: React.FC<UnifiedInspectorProps> = ({
  context,
  isOpen,
  onClose,
  children,
  activeTab = 'context',
  onTabChange
}) => {
  const { entity, mode, intent } = context;
  const [internalTab, setInternalTab] = useState<InspectorTabId>('context');

  const currentTab = onTabChange ? activeTab : internalTab;
  const handleTabChange = (tabId: InspectorTabId) => {
    if (onTabChange) {
      onTabChange(tabId);
    } else {
      setInternalTab(tabId);
    }
  };

  // Determine header status badge based on mode
  const renderStatusBadge = () => {
    switch (mode) {
      case 'locked':
        return <TechnicalStatusBadge label="LOCKED" severity="neutral" variant="ghost" />;
      case 'draft':
        return <TechnicalStatusBadge label="DRAFT" severity="warning" variant="glass" />;
      case 'review':
        return <TechnicalStatusBadge label="REVIEW" severity="critical" variant="solid" />;
      default:
        return null;
    }
  };

  const title = entity?.name || entity?.type || 'Module Inspector';

  return (
    <InspectorPanel
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      headerSlot={renderStatusBadge()}
    >
      <div className="h-full flex flex-col -m-4"> {/* Cancel InspectorPanel's internal padding for the header/tabs */}
        
        {/* 1. Tab Row */}
        <div className="flex border-b border-border-technical bg-background-surface px-4">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "px-3 py-3 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2 -mb-px",
                currentTab === tab.id 
                  ? "text-primary border-primary" 
                  : "text-text-muted border-transparent hover:text-text-main"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 2. Entity Sub-Header */}
        {entity && (
            <div className="px-6 py-4 border-b border-border-technical bg-background-subtle/50">
                <div className="flex flex-col gap-1">
                    <LpdText size="nano" className="text-text-muted font-mono uppercase tracking-widest opacity-60">
                        {entity.type.toUpperCase()}
                    </LpdText>
                    <LpdText size="sm" weight="bold" className="text-text-main">
                        {entity.name}
                    </LpdText>
                </div>
            </div>
        )}
        
        {/* 3. Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4">
             {children}
        </div>

        {/* 4. Governance/Footer Zone */}
        {(intent === 'request-approval' || intent === 'approve' || intent === 'reject') && (
           <div className="p-4 border-t border-border-technical bg-background-surface">
              <Button fullWidth variant="primary">
                 Confirm Decision
              </Button>
           </div>
        )}
      </div>
    </InspectorPanel>
  );
};