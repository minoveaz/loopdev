'use client';

import { useState } from 'react';
import { FileText, Plus } from 'lucide-react';
import { Button } from '@loopdev/ui';
import { formatDate } from '../types';
import { SimulatedBadge, EmptyState } from '../sharedComponents';
import type { NoteDisplayItem } from '../customer360DisplayTypes';

interface NotesPanelProps {
  displayedNotes: NoteDisplayItem[];
  isNotesSimulated?: boolean;
}

export function NotesPanel({
  displayedNotes,
}: NotesPanelProps) {
  const [quickNote, setQuickNote] = useState('');

  return (
    <div className="space-y-4 flex-1 flex flex-col min-w-0 w-full">
      <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
        <div>
          <h3 className="text-sm font-semibold text-text-main">Internal Notes</h3>
          <p className="text-xs text-text-muted mt-0.5">
            Clearance-governed executive notes, call recaps, and account intelligence.
          </p>
        </div>
      </div>

      {/* Note Composer Box */}
      <div className="rounded-xl border border-border-subtle bg-surface-muted/20 p-3 space-y-3 min-w-0 w-full">
        <textarea
          rows={3}
          value={quickNote}
          onChange={(e) => setQuickNote(e.target.value)}
          placeholder="Añadir una nota rápida de reunión o llamada..."
          className="w-full resize-none bg-transparent text-xs text-text-main placeholder:text-text-muted focus:outline-none"
        />
        <div className="flex items-center justify-between pt-2 border-t border-border-subtle/50">
          <span className="text-[11px] text-text-muted">Visibilidad: Equipo CRM</span>
          <Button
            size="sm"
            disabled={!quickNote.trim()}
            onClick={() => {
              setQuickNote('');
            }}
            className="inline-flex items-center gap-1 text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Guardar Nota
          </Button>
        </div>
      </div>

      {/* Notes Feed */}
      {displayedNotes.length ? (
        <div className="space-y-3 pt-2 min-w-0 w-full">
          {displayedNotes.map((note) => {
            const isSimulated = Boolean(note.isSimulated);
            return (
              <div
                key={note.id}
                className={`p-4 rounded-xl transition-all space-y-2 min-w-0 w-full ${
                  isSimulated
                    ? 'border border-dashed border-amber-500/40 bg-amber-500/[0.03]'
                    : 'border border-border-subtle bg-surface-muted/20 hover:border-border-subtle/80'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-text-main">
                      LoopDev Team Member
                    </span>
                    {isSimulated && <SimulatedBadge />}
                  </div>
                  <span className="text-[11px] font-mono text-text-muted">
                    {formatDate(note.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-text-muted leading-relaxed whitespace-pre-wrap break-words">
                  {note.body}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<FileText className="h-8 w-8 text-text-muted" />}
          title="No authorized notes"
          description="Internal notes will appear here once saved by team members with appropriate clearance."
        />
      )}
    </div>
  );
}
