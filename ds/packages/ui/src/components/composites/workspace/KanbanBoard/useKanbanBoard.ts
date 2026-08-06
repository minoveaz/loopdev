import React, { useState } from 'react';

/**
 * @hook useKanbanBoard
 * @description Brain state-machine handling drag-and-drop actions for the KanbanBoard.
 */
export function useKanbanBoard(onCardDrop?: (itemId: string, targetColumnId: string) => void | Promise<void>) {
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [draggedOverColumnId, setDraggedOverColumnId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItemId(itemId);
    e.dataTransfer.setData('text/plain', itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDraggedOverColumnId(columnId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnd = () => {
    setDraggedItemId(null);
    setDraggedOverColumnId(null);
  };

  const handleDrop = async (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain') || draggedItemId;
    
    if (itemId && onCardDrop) {
      try {
        await onCardDrop(itemId, columnId);
      } catch (error) {
        console.error('Failed to update card status in drop transaction:', error);
      }
    }
    
    setDraggedItemId(null);
    setDraggedOverColumnId(null);
  };

  return {
    draggedItemId,
    draggedOverColumnId,
    handleDragStart,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDragEnd,
    handleDrop,
  };
}
export type UseKanbanBoardReturn = ReturnType<typeof useKanbanBoard>;
