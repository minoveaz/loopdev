'use client';

import React, { createContext, useContext, useState } from 'react';

export type EntityType = 'brand' | 'token' | 'rule' | 'version' | 'dependency';

export interface SelectedEntity {
  type: EntityType;
  id: string;
  data: any;
}

interface BrandHubContextType {
  selectedEntity: SelectedEntity | null;
  setSelectedEntity: (entity: SelectedEntity | null) => void;
  isInspectorOpen: boolean;
  setInspectorOpen: (open: boolean) => void;
  activeBrand: any | null;
  setActiveBrand: (brand: any | null) => void;
}

const BrandHubContext = createContext<BrandHubContextType | undefined>(undefined);

export const BrandHubProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedEntity, setSelectedEntity] = useState<SelectedEntity | null>(null);
  const [isInspectorOpen, setInspectorOpen] = useState(false);
  const [activeBrand, setActiveBrand] = useState<any | null>(null);

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
      setActiveBrand
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