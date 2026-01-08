import React from 'react';
import { BadgeSeverity } from '../../../atoms/indicators/TechnicalStatusBadge/types';

export type { BadgeSeverity };

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

/**
 * @interface SuiteNotice
 * @description Contrato de gobernanza para avisos de sistema.
 */
export interface SuiteNotice {
  id: string;
  severity: 'info' | 'warning' | 'danger' | 'success';
  scope?: 'system' | 'suite' | 'module' | 'integration';
  title: string;
  description?: string;
  primaryAction: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
  icon?: string;
}

export interface SuiteHomeActivityItem {
  id: string;
  action: string;
  module: string;
  timestamp: string;
  href: string;
  icon?: string;
  tone?: 'primary' | 'warning' | 'neutral' | 'success';
  description?: string;
}

export interface SuiteHomeLayoutProps {
  /** Título de la Suite (ej: 'Marketing Studio') */
  title: string;
  
  /** Subtítulo descriptivo */
  subtitle: string;
  
  /** Información dinámica de contexto (ej: 'Marca activa: X') */
  contextLine?: string;

  /** Icono de identidad de la suite */
  icon?: string;

  /** Tono semántico de la suite */
  tone?: 'primary' | 'energy' | 'innovation' | 'neutral';

  /** Estado del usuario para priorización de bloques */
  userState: 'new' | 'active';

  /** Alertas de gobernanza */
  notices?: SuiteNotice[];

  /** Acciones de arranque rápido */
  quickActions: SuiteHomeAction[];

  /** Métricas ejecutivas */
  metrics: SuiteHomeMetric[];

  /** Título de la sección de métricas */
  insightsTitle?: string;

  /** Listado de módulos operativos */
  modules: SuiteHomeModule[];

  /** Título de la sección de módulos */
  modulesTitle?: string;

  /** Feed de actividad reciente */
  activity: SuiteHomeActivityItem[];

  /** Callback para ver toda la actividad */
  onViewActivityAll?: () => void;

  /** Clase CSS adicional */
  className?: string;
}