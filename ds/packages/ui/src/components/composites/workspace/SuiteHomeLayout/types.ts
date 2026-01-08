import React from 'react';

export interface SuiteHomeAction {
  id: string;
  label: string;
  description: string;
  icon: string;
  onClick: () => void;
}

export interface SuiteHomeMetric {
  id: string;
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
}

export interface SuiteHomeModule {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'coming_soon' | 'locked' | 'deploying';
  lastActivity?: string;
  ctaLabel: string;
  onOpen: () => void;
}

export interface SuiteHomeNotice {
  id: string;
  message: string;
  tone: 'warning' | 'info' | 'danger';
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface SuiteHomeActivityItem {
  id: string;
  action: string;
  module: string;
  timestamp: string;
  href: string;
}

export interface SuiteHomeLayoutProps {
  /** Título de la Suite (ej: 'Marketing Studio') */
  title: string;
  
  /** Subtítulo descriptivo */
  subtitle: string;
  
  /** Información dinámica de contexto (ej: 'Marca activa: X') */
  contextLine?: string;

  /** Estado del usuario para priorización de bloques */
  userState: 'new' | 'active';

  /** Alertas de gobernanza */
  notices?: SuiteHomeNotice[];

  /** Acciones de arranque rápido */
  quickActions: SuiteHomeAction[];

  /** Métricas ejecutivas */
  metrics: SuiteHomeMetric[];

  /** Listado de módulos operativos */
  modules: SuiteHomeModule[];

  /** Feed de actividad reciente */
  activity: SuiteHomeActivityItem[];

  /** Callback para ver toda la actividad */
  onViewActivityAll?: () => void;

  /** Clase CSS adicional */
  className?: string;
}
