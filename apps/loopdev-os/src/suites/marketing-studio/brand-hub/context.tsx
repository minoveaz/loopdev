'use client';

import React, { createContext, useContext, useState } from 'react';

// Unified Entity Types for the entire suite
export type EntityType = 
  | 'brand' 
  | 'token' 
  | 'rule' 
  | 'version' 
  | 'dependency' 
  | 'color.token' 
  | 'identity.mission' 
  | 'identity.vision' 
  | 'identity.tone' 
  | 'identity.claim';

export interface SelectedEntity {
  type: string; // Use string to allow dots (e.g. color.token)
  id: string;
  name?: string;
  data?: any;
}

interface BrandHubContextType {
  // Selection & Inspector
  selectedEntity: SelectedEntity | null;
  setSelectedEntity: (entity: SelectedEntity | null) => void;
  isInspectorOpen: boolean;
  setInspectorOpen: (open: boolean) => void;
  
  // Brand State
  activeBrand: any | null;
  setActiveBrand: (brand: any | null) => void;

  // Visual System Preview State (Global so Inspector can see it)
  previewTheme: 'light' | 'dark';
  setPreviewTheme: (theme: 'light' | 'dark') => void;
  viewMode: 'grid' | 'table';
  setViewMode: (mode: 'grid' | 'table') => void;
}

const BrandHubContext = createContext<BrandHubContextType | undefined>(undefined);

export const BrandHubProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedEntity, setSelectedEntity] = useState<SelectedEntity | null>(null);
  const [isInspectorOpen, setInspectorOpen] = useState(false);
  const [activeBrand, setActiveBrand] = useState<any | null>(null);
  
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const handleSelect = (entity: SelectedEntity | null) => {
    setSelectedEntity(entity);
    if (entity) setInspectorOpen(true);
  };

  return (
    <BrandHubContext.Provider value={{ 
      selectedEntity, 
      setSelectedEntity: handleSelect,
      isInspectorOpen,
      setInspectorOpen,
      activeBrand,
      setActiveBrand,
      previewTheme,
      setPreviewTheme,
      viewMode,
      setViewMode
    }}>
      {children}
    </BrandHubContext.Provider>
  );
};

export const useBrandHub = () => {
  const context = useContext(BrandHubContext);
  if (context === undefined) {
    throw new Error('useBrandHub must be used within a BrandHubProvider');
  }
  return context;
};
