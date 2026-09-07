'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
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

const MODE_STORAGE_KEY = 'loopdev:platform-runtime-mode:v1';

function readStoredMode(): PlatformEnvironmentMode {
  if (typeof window === 'undefined') return 'real';
  const storedMode = window.localStorage.getItem(MODE_STORAGE_KEY);
  return storedMode === null ? 'real' : PlatformEnvironmentModeSchema.parse(storedMode);
}

export function PlatformRuntimeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<PlatformEnvironmentMode>(readStoredMode);
  const policies = policiesForMode(mode);

  const setMode = useCallback((nextMode: PlatformEnvironmentMode) => {
    const parsedMode = PlatformEnvironmentModeSchema.parse(nextMode);
    setModeState(parsedMode);
    window.localStorage.setItem(MODE_STORAGE_KEY, parsedMode);
  }, []);
  const reset = useCallback(() => {
    setModeState('real');
    window.localStorage.removeItem(MODE_STORAGE_KEY);
  }, []);
  const value = useMemo(
    () => ({
      mode,
      ...policies,
      setMode,
      reset,
    }),
    [mode, policies, reset, setMode],
  );

  return <PlatformRuntimeContext.Provider value={value}>{children}</PlatformRuntimeContext.Provider>;
}

export function usePlatformRuntime(): PlatformRuntimeValue {
  const context = useContext(PlatformRuntimeContext);
  if (!context) throw new Error('usePlatformRuntime must be used within a PlatformRuntimeProvider');
  return context;
}
