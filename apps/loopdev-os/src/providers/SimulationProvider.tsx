'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';

interface SimulationContextValue {
  isSimulationActive: boolean;
  toggleSimulation: () => void;
  setSimulationActive: (active: boolean) => void;
}

const STORAGE_KEY = 'loopdev:simulation-mode';

const SimulationContext = createContext<SimulationContextValue | null>(null);

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const [isSimulationActive, setIsSimulationActiveState] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        setIsSimulationActiveState(stored === 'true');
      }
    } catch {
      // Ignorar restricciones en entornos con cookies/storage deshabilitados
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const setSimulationActive = useCallback((active: boolean) => {
    setIsSimulationActiveState(active);
    try {
      localStorage.setItem(STORAGE_KEY, String(active));
    } catch {
      // Storage error fallback
    }
  }, []);

  const toggleSimulation = useCallback(() => {
    setSimulationActive(!isSimulationActive);
  }, [isSimulationActive, setSimulationActive]);

  const value = useMemo(
    () => ({
      // Durante SSR o antes de hidratar, mantener false para consistencia
      isSimulationActive: isHydrated ? isSimulationActive : false,
      toggleSimulation,
      setSimulationActive,
    }),
    [isSimulationActive, isHydrated, toggleSimulation, setSimulationActive],
  );

  return <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>;
}

export function useSimulation(): SimulationContextValue {
  const context = useContext(SimulationContext);
  if (!context) {
    return {
      isSimulationActive: false,
      toggleSimulation: () => undefined,
      setSimulationActive: () => undefined,
    };
  }
  return context;
}
