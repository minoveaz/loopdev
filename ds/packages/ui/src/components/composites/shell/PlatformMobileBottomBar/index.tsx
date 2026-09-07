'use client';

import React from 'react';
import { Layers, Plus, Search, User } from 'lucide-react';
import { BrandLogo } from '../../../atoms';

export interface PlatformMobileBottomBarProps {
  /** Callback para abrir el menú de navegación y módulos de la suite */
  onOpenNavigation?: () => void;
  /** Callback para abrir la búsqueda global (Command Bar ⌘K) */
  onOpenSearch?: () => void;
  /** Callback para la acción rápida contextual central */
  onQuickAction?: () => void;
  /** Callback para abrir el AI Assistant de LoopDev */
  onOpenAI?: () => void;
  /** Callback para abrir el menú de perfil y tenant */
  onOpenProfile?: () => void;
  /** Identificador de la sección activa actual si aplica */
  activeContext?: 'navigation' | 'search' | 'action' | 'ai' | 'profile' | null;
  /** Etiqueta accesible para el botón de acción rápida */
  quickActionLabel?: string;
  /** Si hay notificaciones o actividad pendiente */
  hasNotifications?: boolean;
  /** Clases CSS adicionales */
  className?: string;
}

export const PlatformMobileBottomBar: React.FC<PlatformMobileBottomBarProps> = ({
  onOpenNavigation,
  onOpenSearch,
  onQuickAction,
  onOpenAI,
  onOpenProfile,
  activeContext = null,
  quickActionLabel = 'Acción rápida',
  className = '',
}) => {
  return (
    <div
      role="toolbar"
      aria-label="Barra de navegación principal móvil"
      className={`flex h-14 w-full items-center justify-around px-1 select-none ${className}`}
    >
      {/* 1. Módulos / Navegación */}
      <button
        type="button"
        onClick={onOpenNavigation}
        aria-label="Abrir navegación de módulos"
        aria-pressed={activeContext === 'navigation'}
        className={`flex flex-1 min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 rounded-xl py-1 text-[10px] font-medium transition-colors ${
          activeContext === 'navigation'
            ? 'text-primary'
            : 'text-text-muted hover:text-text-main active:text-text-main'
        }`}
      >
        <Layers className="size-[18px] shrink-0" aria-hidden="true" />
        <span>Módulos</span>
      </button>

      {/* 2. Buscar (Command Bar) */}
      <button
        type="button"
        onClick={onOpenSearch}
        aria-label="Buscar en la plataforma"
        aria-pressed={activeContext === 'search'}
        className={`flex flex-1 min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 rounded-xl py-1 text-[10px] font-medium transition-colors ${
          activeContext === 'search'
            ? 'text-primary'
            : 'text-text-muted hover:text-text-main active:text-text-main'
        }`}
      >
        <Search className="size-[18px] shrink-0" aria-hidden="true" />
        <span>Buscar</span>
      </button>

      {/* 3. Botón Central Elevado: Acción Rápida Contextual */}
      <div className="flex shrink-0 items-center justify-center px-1.5">
        <button
          type="button"
          onClick={onQuickAction}
          aria-label={quickActionLabel}
          className="group relative -mt-3.5 flex size-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary via-primary to-indigo-600 text-white shadow-md shadow-primary/30 border-2 border-surface-light dark:border-surface-dark active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Plus
            className="size-5 shrink-0 transition-transform duration-200 group-hover:rotate-90"
            aria-hidden="true"
          />
        </button>
      </div>

      {/* 4. AI Assistant de LoopDev */}
      <button
        type="button"
        onClick={onOpenAI}
        aria-label="Abrir asistente de IA"
        aria-pressed={activeContext === 'ai'}
        className={`group flex flex-1 min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 rounded-xl py-1 text-[10px] font-medium transition-colors ${
          activeContext === 'ai'
            ? 'text-primary'
            : 'text-text-muted hover:text-text-main active:text-text-main'
        }`}
      >
        <div className="relative flex items-center justify-center">
          <BrandLogo
            variant="isotype"
            surface="plain"
            size="xs"
            className="shrink-0 size-4"
            isotypeClassName={activeContext === 'ai' ? '!bg-primary' : ''}
          />
        </div>
        <span>AI</span>
      </button>

      {/* 5. Perfil / Usuario */}
      <button
        type="button"
        onClick={onOpenProfile}
        aria-label="Perfil y ajustes"
        aria-pressed={activeContext === 'profile'}
        className={`flex flex-1 min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 rounded-xl py-1 text-[10px] font-medium transition-colors ${
          activeContext === 'profile'
            ? 'text-primary'
            : 'text-text-muted hover:text-text-main active:text-text-main'
        }`}
      >
        <User className="size-[18px] shrink-0" aria-hidden="true" />
        <span>Perfil</span>
      </button>
    </div>
  );
};
