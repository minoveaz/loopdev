import React from 'react';

/**
 * @interface KanbanColumn
 * @description Structure representing a column in the Kanban board.
 */
export interface KanbanColumn {
  id: string;
  title: string;
  /** Semantic surface tone owned by the consuming suite. */
  tone?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger';
  bgClass?: string;
  headerClass?: string;
}

/**
 * @interface KanbanBoardProps
 * @description Props contract for the generic KanbanBoard component.
 */
export interface KanbanBoardProps<T> {
  columns: KanbanColumn[];
  items: T[];
  getColumnId: (item: T) => string;
  getItemId: (item: T) => string;
  renderCard: (item: T) => React.ReactNode;
  onCardDrop?: (itemId: string, targetColumnId: string) => void | Promise<void>;
  
  // Custom metrics hook per column
  getColumnMetrics?: (columnId: string, items: T[]) => {
    count: number;
    valueLabel?: string;
  };
  
  isLoading?: boolean;
  emptyStateSlot?: React.ReactNode;
}
