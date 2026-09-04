'use client';

import { useContext } from 'react';
import { AnalyticsContext } from './PublicAnalyticsProvider';
import type { AnalyticsContextValue } from './types';

export const usePublicAnalytics = (): AnalyticsContextValue => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('usePublicAnalytics must be used within a <PublicAnalyticsProvider>');
  }
  return context;
};
