'use client';

import React from 'react';
import { QuickActionCard } from './QuickActionCard';
import { SuiteHomeAction } from './types';

interface SuiteHomeQuickStartProps {
  actions: SuiteHomeAction[];
}

/**
 * @component SuiteHomeQuickStart
 * @description Bloque de acciones rápidas (Launcher).
 * Renderiza una fila de QuickActionCards compactas.
 */
export const SuiteHomeQuickStart: React.FC<SuiteHomeQuickStartProps> = ({ actions }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
      {actions.slice(0, 3).map((action) => ( // Limitamos visualmente a 3 como sugiere el estándar
        <QuickActionCard
          key={action.id}
          {...action}
        />
      ))}
    </div>
  );
};