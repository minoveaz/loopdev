'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface QuantOpsContextType {
  selectedBotId: string | null;
  isInspectorOpen: boolean;
  openBotInspector: (botId: string) => void;
  closeInspector: () => void;
}

const QuantOpsContext = createContext<QuantOpsContextType | undefined>(undefined);

export const QuantOpsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedBotId, setSelectedBotId] = useState<string | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  const openBotInspector = useCallback((botId: string) => {
    console.log(`[QuantOpsContext] Opening inspector for bot: ${botId}`);
    setSelectedBotId(botId);
    setIsInspectorOpen(true);
  }, []);

  const closeInspector = useCallback(() => {
    console.log('[QuantOpsContext] Closing inspector');
    setIsInspectorOpen(false);
    // Keep selectedBotId for a smooth close animation
  }, []);

  return (
    <QuantOpsContext.Provider value={{ 
      selectedBotId, 
      isInspectorOpen, 
      openBotInspector, 
      closeInspector 
    }}>
      {children}
    </QuantOpsContext.Provider>
  );
};

export const useQuantOps = () => {
  const context = useContext(QuantOpsContext);
  if (!context) throw new Error('useQuantOps must be used within QuantOpsProvider');
  return context;
};
