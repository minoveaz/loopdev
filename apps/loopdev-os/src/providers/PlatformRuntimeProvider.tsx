'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import {
  PlatformEnvironmentModeSchema,
  type PlatformEnvironmentMode,
  type PlatformNetworkPolicy,
  type PlatformPersistencePolicy,
} from '@loopdev/contracts';

type PlatformRuntimeValue = {
  mode: PlatformEnvironmentMode;
  network: PlatformNetworkPolicy;
  persistence: PlatformPersistencePolicy;
  setMode: (mode: PlatformEnvironmentMode) => void;
  reset: () => void;
};

export const PlatformRuntimeContext = createContext<PlatformRuntimeValue | undefined>(undefined);

function policiesForMode(mode: PlatformEnvironmentMode) {
  if (mode === 'real') return { network: { reads: 'remote', writes: 'remote' } as const, persistence: 'remote' as const };
  if (mode === 'preview') return { network: { reads: 'local', writes: 'blocked' } as const, persistence: 'none' as const };
  return { network: { reads: 'local', writes: 'local' } as const, persistence: 'local' as const };
}

export function PlatformRuntimeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<PlatformEnvironmentMode>('real');
  const policies = policiesForMode(mode);

  const value = useMemo(
    () => ({
      mode,
      ...policies,
      setMode: (nextMode: PlatformEnvironmentMode) => {
        setModeState(PlatformEnvironmentModeSchema.parse(nextMode));
      },
      reset: () => {
        setModeState('real');
      },
    }),
    [mode, policies],
  );

  return <PlatformRuntimeContext.Provider value={value}>{children}</PlatformRuntimeContext.Provider>;
}

export function usePlatformRuntime(): PlatformRuntimeValue {
  const context = useContext(PlatformRuntimeContext);
  if (!context) throw new Error('usePlatformRuntime must be used within a PlatformRuntimeProvider');
  return context;
}
