'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { LeadRowViewModel } from './types';

type LeadsRuntimeValue = {
  selectedLead: LeadRowViewModel | null;
  selectLead: (lead: LeadRowViewModel) => void;
  clearSelectedLead: () => void;
};

const LeadsRuntimeContext = createContext<LeadsRuntimeValue | null>(null);

export function LeadsRuntimeProvider({ children }: { children: ReactNode }) {
  const [selectedLead, setSelectedLead] = useState<LeadRowViewModel | null>(null);
  const clearSelectedLead = useCallback(() => setSelectedLead(null), []);
  const value = useMemo(
    () => ({
      selectedLead,
      selectLead: setSelectedLead,
      clearSelectedLead,
    }),
    [clearSelectedLead, selectedLead],
  );

  return <LeadsRuntimeContext.Provider value={value}>{children}</LeadsRuntimeContext.Provider>;
}

export function useLeadsRuntime() {
  const value = useContext(LeadsRuntimeContext);
  if (!value) throw new Error('useLeadsRuntime must be used inside LeadsRuntimeProvider');
  return value;
}
