'use client';

import React from 'react';
import { cn } from '../../../../helpers/cn';
import { Badge, Heading } from '../../../atoms';
import { Skeleton } from '../../../atoms/feedback/Skeleton';
import { KanbanBoardProps } from './types';
import { useKanbanBoard } from './useKanbanBoard';

const COLUMN_TONE_CLASSES = {
  neutral: 'bg-shell-surface border-border-subtle',
  primary: 'bg-shell-surface border-border-subtle',
  success: 'bg-shell-surface border-border-subtle',
  warning: 'bg-shell-surface border-border-subtle',
  danger: 'bg-shell-surface border-border-subtle',
} as const;

const COLUMN_TONE_DOT_CLASSES = {
  neutral: 'bg-text-muted',
  primary: 'bg-primary',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-rose-500',
} as const;

/**
 * @component KanbanBoard
 * @description A generic, high-density, multi-tenant workspace Kanban board with HTML5 Drag & Drop.
 * @category Composites
 * @status stable
 * @version 1.0.0
 */
export function KanbanBoard<T>({
  columns,
  items,
  getColumnId,
  getItemId,
  renderCard,
  onCardDrop,
  getColumnMetrics,
  isLoading = false,
  emptyStateSlot,
}: KanbanBoardProps<T>) {
  const {
    draggedItemId,
    draggedOverColumnId,
    handleDragStart,
    handleDragOver,
    handleDragEnter,
    handleDragEnd,
    handleDrop,
  } = useKanbanBoard(onCardDrop);

  if (isLoading) {
    return (
      <div
        role="region"
        aria-label="Tablero Kanban"
        tabIndex={0}
        className="flex flex-row snap-x snap-mandatory overflow-x-auto gap-4 h-full min-h-[400px] px-1 pb-1 pr-6 select-none custom-scrollbar"
      >
        {columns.map((col) => (
          <div
            key={col.id}
            className="flex flex-col w-72 shrink-0 rounded-2xl border border-border-technical/30 p-4 bg-slate-900/10 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-4 border-b border-border-technical/20 pb-3">
              <Skeleton className="h-4 w-32 rounded-lg" />
              <Skeleton className="h-3 w-8 rounded-lg" />
            </div>
            <div className="flex flex-col gap-3 flex-grow">
              <Skeleton className="h-28 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Handle overall empty state if there are no items
  if (items.length === 0 && emptyStateSlot) {
    return <div className="flex-1 flex items-center justify-center">{emptyStateSlot}</div>;
  }

  return (
    <div
      role="region"
      aria-label="Tablero Kanban"
      tabIndex={0}
      className="flex flex-row snap-x snap-mandatory overflow-x-auto gap-4 h-full min-h-[400px] px-1 pb-1 pr-6 select-none custom-scrollbar"
    >
      {columns.map((col) => {
        const columnItems = items.filter((item) => getColumnId(item) === col.id);

        // Calculate Metrics
        let count = columnItems.length;
        let valueLabel: string | undefined = undefined;

        if (getColumnMetrics) {
          const metrics = getColumnMetrics(col.id, items);
          count = metrics.count;
          valueLabel = metrics.valueLabel;
        }

        const isDraggedOver = draggedOverColumnId === col.id;

        return (
          <div
            key={col.id}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragEnter={(e) => handleDragEnter(e, col.id)}
            onDrop={(e) => handleDrop(e, col.id)}
            className={cn(
              'flex flex-col w-72 shrink-0 snap-start rounded-3xl p-5 transition-all duration-300 flex-grow min-h-[300px]',
              col.bgClass || `${COLUMN_TONE_CLASSES[col.tone ?? 'neutral']} border shadow-sm`,
              isDraggedOver && 'border-primary/40 bg-shell-surface/90 shadow-lg',
            )}
          >
            {/* Column Header */}
            <div
              className={cn(
                'flex items-center justify-between mb-4 border-b border-border-subtle pb-3',
                col.headerClass,
              )}
            >
              <div className="flex min-w-0 items-center gap-2">
                <span
                  aria-hidden="true"
                  className={cn(
                    'h-2 w-2 shrink-0 rounded-full',
                    COLUMN_TONE_DOT_CLASSES[col.tone ?? 'neutral'],
                  )}
                />
                <Heading
                  size="xs"
                  weight="black"
                  className="min-w-0 truncate text-text-main uppercase tracking-wider"
                  title={col.title}
                >
                  {col.title}
                </Heading>
              </div>

              <div className="flex items-center gap-1.5 select-none">
                <Badge variant="outline" showDot={false} className="px-1.5 py-0.5 text-[10px]">
                  {count}
                </Badge>
                {valueLabel !== undefined && (
                  <Badge
                    variant="outline"
                    status="success"
                    showDot={false}
                    className="px-1.5 py-0.5 text-[10px]"
                  >
                    {valueLabel}
                  </Badge>
                )}
              </div>
            </div>

            {/* Column Cards Container */}
            <div className="flex flex-col gap-3 overflow-y-auto pr-1 flex-1 py-1 custom-scrollbar min-h-[150px]">
              {columnItems.map((item) => {
                const itemId = getItemId(item);
                const isDragging = draggedItemId === itemId;

                return (
                  <div
                    key={itemId}
                    draggable="true"
                    onDragStart={(e) => handleDragStart(e, itemId)}
                    onDragEnd={handleDragEnd}
                    className={cn(
                      'transition-all duration-200 cursor-grab active:cursor-grabbing',
                      isDragging &&
                        'opacity-40 scale-95 border-2 border-dashed border-accent/30 rounded-xl',
                    )}
                  >
                    {renderCard(item)}
                  </div>
                );
              })}

              {columnItems.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-3 py-10 text-center text-sm text-text-muted">
                  <span>No items in this stage</span>
                  {emptyStateSlot}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export * from './types';
export * from './useKanbanBoard';
export * from './fixtures';
