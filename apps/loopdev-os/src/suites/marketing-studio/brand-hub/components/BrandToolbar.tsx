'use client';

import React from 'react';
import { 
  ModuleToolbar, 
  Button, 
  IconButton, 
  Divider, 
  LpdText 
} from '@loopdev/ui';

export interface BrandToolbarProps {
  mode: 'module' | 'brand';
  brandStatus?: 'draft' | 'published' | 'archived';
  isReadOnly?: boolean;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  onAction?: (action: string) => void;
}

/**
 * @component BrandToolbar
 * @description Orquestador de intención para Brand Hub.
 * Gestiona 4 estados: Directory, Read-Only, Draft, Governance.
 */
export const BrandToolbar: React.FC<BrandToolbarProps> = (props) => {
  const { 
    mode, 
    brandStatus, 
    isReadOnly, 
    viewMode = 'grid',
    onViewModeChange,
    onAction 
  } = props;

  // 1. MODULE MODE (Directorio)
  if (mode === 'module') {
    return (
      <ModuleToolbar
        left={
          <div className="flex items-center gap-2">
            <IconButton icon="filter_list" size="sm" variant="ghost" aria-label="Filter" />
            <Divider orientation="vertical" className="h-4" />
            <LpdText size="nano" className="text-text-muted uppercase font-bold tracking-widest opacity-40">
              ALL BRANDS
            </LpdText>
          </div>
        }
        center={
          <div className="flex items-center bg-background-subtle p-0.5 rounded-lg border border-border-technical">
            <IconButton 
              icon="grid_view" 
              size="sm" 
              variant={viewMode === 'grid' ? 'primary' : 'ghost'} 
              onClick={() => onViewModeChange?.('grid')}
              aria-label="Grid View"
            />
            <IconButton 
              icon="view_list" 
              size="sm" 
              variant={viewMode === 'list' ? 'primary' : 'ghost'} 
              onClick={() => onViewModeChange?.('list')}
              aria-label="List View"
            />
          </div>
        }
        right={
          <Button 
            variant="primary" 
            size="sm" 
            startIcon="add"
            onClick={() => onAction?.('create_brand')}
          >
            Create Brand
          </Button>
        }
      />
    );
  }

  // 2. BRAND MODE: PUBLISHED (Read Only)
  if (isReadOnly) {
    return (
      <ModuleToolbar
        left={
          <div className="flex items-center gap-2">
            {/* Lock status is already in Header context */}
          </div>
        }
        right={
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              startIcon="compare_arrows" 
              onClick={() => onAction?.('compare')}
              title="Compare with previous versions"
            >
              Compare
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              startIcon="hub" 
              onClick={() => onAction?.('dependencies')}
              title="View system impact analysis"
            >
              Impact
            </Button>
            <Divider orientation="vertical" className="h-4" />
            <Button 
              variant="primary" 
              size="sm" 
              startIcon="edit_note"
              onClick={() => onAction?.('create_draft')}
              title="Create a new draft version to edit"
            >
              Create Draft
            </Button>
          </div>
        }
      />
    );
  }

  // 3. BRAND MODE: DRAFT (Active Editing)
  return (
    <ModuleToolbar
      left={
        <div className="flex items-center gap-2">
          <LpdText size="nano" className="text-primary font-mono font-bold uppercase tracking-widest">
            // EDITING DRAFT
          </LpdText>
        </div>
      }
      center={
        <div className="flex items-center gap-2">
           {/* Zoom controls could go here */}
        </div>
      }
      right={
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => onAction?.('discard_draft')}>
            Discard
          </Button>
          <Button variant="secondary" size="sm" startIcon="save" onClick={() => onAction?.('save_draft')}>
            Save
          </Button>
          <Divider orientation="vertical" className="h-4" />
          <Button 
            variant="primary" 
            size="sm" 
            startIcon="gavel"
            onClick={() => onAction?.('request_approval')}
          >
            Request Approval
          </Button>
        </div>
      }
    />
  );
};
