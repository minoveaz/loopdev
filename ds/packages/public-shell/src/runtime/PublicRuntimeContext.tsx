'use client';

import { createContext, useContext } from 'react';
import type { PublicRuntimeContextValue } from './types';

export const PublicRuntimeContext = createContext<PublicRuntimeContextValue | null>(null);

export const usePublicRuntime = (): PublicRuntimeContextValue => {
  const context = useContext(PublicRuntimeContext);
  if (!context) {
    throw new Error('usePublicRuntime must be used within a <PublicRuntime>');
  }
  return context;
};
