'use client';

import React from 'react';
import { 
  LpdText, 
  Skeleton, 
  ContextBlock, 
  ImpactBlock, 
  DiffBlock, 
  GovernanceBlock, 
  InspectorTabId, 
  InspectorContext 
} from '@loopdev/ui';
import { ColorTokenInspector } from './inspectors/ColorTokenInspector';
import { useBrandHub } from '../context';

interface BrandInspectorProps {
  tab: InspectorTabId;
  context: InspectorContext;
  isLoading?: boolean;
}

/**
 * @component BrandInspector
 * @description The specific renderer for Marketing Studio > Brand Hub.
 * Decides what content to show for 'brand.identity', 'color.token', etc.
 */
export const BrandInspector: React.FC<BrandInspectorProps> = ({ tab, context, isLoading }) => {
  const { entity } = context;
  const { activeBrand, previewTheme } = useBrandHub();

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  if (!entity) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-12 text-center opacity-40">
        <LpdText size="sm" className="font-mono uppercase tracking-widest">
          No Entity Selected
        </LpdText>
        <LpdText size="xs" className="mt-2">
          Select an item in the canvas to inspect details.
        </LpdText>
      </div>
    );
  }

  // --- SPECIALIZED RENDERERS ---

  // 1. Color Tokens
  if (entity.type === 'color.token') {
    const token = activeBrand?.palette?.tokens.find((t: any) => t.id === entity.id);
    if (token) {
      return (
        <div className="p-6 h-full overflow-y-auto">
          <ColorTokenInspector 
            token={token} 
            theme={previewTheme} 
            activeTab={tab} 
          />
        </div>
      );
    }
  }

  // --- GENERIC RENDERERS BY TAB ---

  if (tab === 'context') {
    return (
      <div className="px-6">
        <ContextBlock 
            title="Metadata"
            items={[
                { label: 'Created By', value: 'System Admin' },
                { label: 'Created At', value: '2024-01-15' },
                { label: 'Version', value: entity.versionId || 'v1.0.0 (Latest)' }
            ]}
        />
        <ContextBlock 
            title="Ownership"
            items={[
                { label: 'Owner', value: 'Marketing Team' },
                { label: 'Classification', value: 'Public' }
            ]}
        />
        <div className="py-4">
             <LpdText size="nano" weight="bold" className="text-text-muted uppercase tracking-widest opacity-80 mb-2">Description</LpdText>
             <LpdText size="sm" className="text-text-muted leading-relaxed">
                This entity defines the core identity attributes for {entity.name}. 
                Changes here propagate to all consumer modules.
            </LpdText>
        </div>
      </div>
    );
  }

  if (tab === 'impact') {
    return (
      <div className="p-6 space-y-4">
         <ImpactBlock 
            severity="high"
            title="High Impact Detected"
            description={`Modifying this ${entity.type} will affect 12 modules and 45 active campaigns across the organization.`}
            affectedModules={['CRM', 'DAM', 'Content Engine']}
         />
      </div>
    );
  }

  if (tab === 'diff') {
     return (
         <div className="p-6">
             <DiffBlock 
                changes={[
                    { type: 'modified', label: 'Primary Color Token' },
                    { type: 'removed', label: 'Legacy Font Face' },
                    { type: 'added', label: 'Secondary Palette' }
                ]}
             />
         </div>
     )
  }

  if (tab === 'governance') {
      return (
          <div className="p-6">
              <LpdText size="nano" weight="bold" className="text-text-muted uppercase tracking-widest opacity-80 mb-4">Approval Chain</LpdText>
              <GovernanceBlock 
                 steps={[
                     { role: 'Draft Created', status: 'approved', actor: 'You', date: 'Today' },
                     { role: 'CMO Approval', status: 'pending' },
                     { role: 'System Publish', status: 'skipped' }
                 ]}
              />
          </div>
      )
  }

  return (
    <div className="p-12 text-center opacity-40 italic">
      <LpdText size="xs">Content for "{tab}" tab not implemented yet for this entity.</LpdText>
    </div>
  );
};