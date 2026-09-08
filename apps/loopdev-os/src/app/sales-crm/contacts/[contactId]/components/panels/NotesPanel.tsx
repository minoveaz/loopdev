'use client';

import { useState } from 'react';
import { FileText, Plus } from 'lucide-react';
import { Button, Heading } from '@loopdev/ui';
import { formatDate } from '../types';
import { SimulatedBadge, EmptyState } from '../sharedComponents';
import type { NoteDisplayItem } from '../customer360DisplayTypes';

interface NotesPanelProps {
  displayedNotes: NoteDisplayItem[];
  isNotesSimulated?: boolean;
}

export function NotesPanel({ displayedNotes }: NotesPanelProps) {
  const [quickNote, setQuickNote] = useState('');

  return (
    <div className="flex w-full min-w-0 flex-1 flex-col space-y-4">
      <div className="border-border-subtle flex items-center justify-between border-b pb-3">
        <div>
          <Heading as="h3" size="sm" weight="semibold" className="text-text-main">
            Internal Notes
          </Heading>
          <p className="text-text-muted mt-0.5 text-xs">
            Clearance-governed executive notes, call recaps, and account intelligence.
          </p>
        </div>
      </div>

      {/* Note Composer Box */}
      <div className="border-border-subtle bg-surface-muted/20 w-full min-w-0 space-y-3 rounded-xl border p-3">
        <textarea
          rows={3}
          value={quickNote}
          onChange={(e) => setQuickNote(e.target.value)}
          placeholder="Añadir una nota rápida de reunión o llamada..."
          className="text-text-main placeholder:text-text-muted w-full resize-none bg-transparent text-xs focus:outline-none"
        />
        <div className="border-border-subtle/50 flex items-center justify-between border-t pt-2">
          <span className="text-text-muted text-[11px]">Visibilidad: Equipo CRM</span>
          <Button
            size="sm"
            variant="primary"
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
        <div className="w-full min-w-0 space-y-3 pt-2">
          {displayedNotes.map((note) => {
            const isSimulated = Boolean(note.isSimulated);
            return (
              <div
                key={note.id}
                className={`w-full min-w-0 space-y-2 rounded-xl p-4 transition-all ${
                  isSimulated
                    ? 'border border-dashed border-amber-500/40 bg-amber-500/[0.03]'
                    : 'border-border-subtle bg-surface-muted/20 hover:border-border-subtle/80 border'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-text-main text-xs font-semibold">
                      LoopDev Team Member
                    </span>
                    {isSimulated && <SimulatedBadge />}
                  </div>
                  <span className="text-text-muted font-mono text-[11px]">
                    {formatDate(note.createdAt)}
                  </span>
                </div>
                <p className="text-text-muted whitespace-pre-wrap break-words text-xs leading-relaxed">
                  {note.body}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<FileText className="text-text-muted h-8 w-8" />}
          title="No authorized notes"
          description="Internal notes will appear here once saved by team members with appropriate clearance."
        />
      )}
    </div>
  );
}
