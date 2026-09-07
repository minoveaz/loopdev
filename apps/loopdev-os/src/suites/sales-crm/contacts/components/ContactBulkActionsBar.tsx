'use client';

import React from 'react';
import { CheckSquare, Download, FolderKanban, CheckCircle2, X } from 'lucide-react';
import { Button } from '@loopdev/ui';

interface ContactBulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onExportSelected?: () => void;
  onAssignPipeline?: () => void;
  onMarkVerified?: () => void;
}

export function ContactBulkActionsBar({
  selectedCount,
  onClearSelection,
  onExportSelected,
  onAssignPipeline,
  onMarkVerified,
}: ContactBulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-2xl pointer-events-none animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-border-subtle bg-background/95 p-2 sm:p-2.5 shadow-xl backdrop-blur-md pointer-events-auto">
        <div className="flex items-center gap-2 pl-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
            {selectedCount}
          </span>
          <span className="text-xs font-medium text-text-main hidden sm:inline">
            contactos seleccionados
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {onExportSelected && (
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={onExportSelected}
              className="h-8 gap-1.5 text-xs px-2.5"
            >
              <Download size={13} strokeWidth={1.75} />
              <span className="hidden md:inline">Exportar</span>
            </Button>
          )}

          {onAssignPipeline && (
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={onAssignPipeline}
              className="h-8 gap-1.5 text-xs px-2.5"
            >
              <FolderKanban size={13} strokeWidth={1.75} />
              <span className="hidden md:inline">A Pipeline</span>
            </Button>
          )}

          {onMarkVerified && (
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={onMarkVerified}
              className="h-8 gap-1.5 text-xs px-2.5 text-emerald-700 dark:text-emerald-300"
            >
              <CheckCircle2 size={13} strokeWidth={1.75} />
              <span className="hidden md:inline">Verificar</span>
            </Button>
          )}

          <div className="h-4 w-px bg-border-subtle mx-1" />

          <button
            type="button"
            onClick={onClearSelection}
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-text-muted hover:bg-surface hover:text-text-main transition-colors"
            title="Deseleccionar todos"
            aria-label="Deseleccionar todos"
          >
            <X size={14} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
