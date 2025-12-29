
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import type { SearchResult } from './utils';

export const useAutocomplete = (initialQuery: string = '', initialResults: SearchResult[]) => {
  const [query, setQuery] = useState(initialQuery);
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null); // The finalized selection
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1); // The item currently focused via keyboard/mouse
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter results based on query
  const filteredResults = useMemo(() => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return initialResults.filter(item => 
      item.title.toLowerCase().includes(lowerQuery) || 
      item.subtitle.toLowerCase().includes(lowerQuery)
    );
  }, [query, initialResults]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setIsOpen(val.length > 0);
    setActiveId(null);
    setHighlightedIndex(0); // Reset highlight to first item on type
  };

  const handleSelect = (id: string) => {
    setActiveId(id);
    const selected = initialResults.find(r => r.id === id);
    if (selected) {
        setQuery(selected.title);
        setIsOpen(false);
        setHighlightedIndex(-1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredResults.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredResults.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredResults[highlightedIndex]) {
          handleSelect(filteredResults[highlightedIndex].id);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  const handleFocus = () => {
    if (query.length > 0) setIsOpen(true);
  };

  // Sync mouse hover with keyboard index
  const handleMouseEnterItem = (index: number) => {
    setHighlightedIndex(index);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  useEffect(() => {
      if (initialQuery) setIsOpen(true);
  }, []);

  return {
    query,
    isOpen,
    activeId,
    filteredResults,
    highlightedIndex,
    handleInputChange,
    handleSelect,
    handleFocus,
    handleKeyDown,
    handleMouseEnterItem,
    containerRef
  };
};
