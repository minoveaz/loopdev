'use client';

import React, { createContext, useContext, useState, useMemo } from 'react';
import type { TenantId, SubbrandId } from '../types/tenant';

export type Tenant = TenantId;
export type Subbrand = SubbrandId;

interface TenantContextType {
  tenant: Tenant;
  subbrand: Subbrand;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export interface TenantProviderProps {
  tenant: Tenant;
  subbrand?: Subbrand;
  children: ReactNode;
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ 
  tenant, 
  subbrand = 'none', 
  children 
}) => {
  return (
    <TenantContext.Provider value={{ tenant, subbrand }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
