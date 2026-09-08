'use client';

import React from 'react';
import { CheckCircle2, Download, FolderKanban, X } from 'lucide-react';
import { Button, IconButton } from '@loopdev/ui';

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
    <div className="animate-in fade-in slide-in-from-bottom-4 pointer-events-none fixed bottom-20 left-1/2 z-50 w-full max-w-2xl -translate-x-1/2 px-4 duration-300 lg:bottom-6">
      <div className="border-border-subtle bg-background/95 pointer-events-auto flex items-center justify-between gap-3 rounded-2xl border p-2 shadow-xl backdrop-blur-md sm:p-2.5">
        <div className="flex items-center gap-2 pl-2">
          <span className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold">
            {selectedCount}
          </span>
          <span className="text-text-main hidden text-xs font-medium sm:inline">
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
              className="h-8 gap-1.5 px-2.5 text-xs"
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
              className="h-8 gap-1.5 px-2.5 text-xs"
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
              className="text-status-success h-8 gap-1.5 px-2.5 text-xs"
            >
              <CheckCircle2 size={13} strokeWidth={1.75} />
              <span className="hidden md:inline">Verificar</span>
            </Button>
          )}

          <div className="bg-border-subtle mx-1 h-4 w-px" />

          <IconButton
            type="button"
            variant="ghost"
            size="sm"
            ariaLabel="Deseleccionar todos"
            onClick={onClearSelection}
            className="text-text-muted hover:bg-surface hover:text-text-main inline-flex h-7 w-7 items-center justify-center rounded-lg transition-colors"
            title="Deseleccionar todos"
          >
            <X size={14} strokeWidth={2} />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
