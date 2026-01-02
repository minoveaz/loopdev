
import React from 'react';

export type ResultType = 'folder' | 'file' | 'person';

export interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: ResultType;
  // highlightMatch removed, calculation will be dynamic
}

export const getIconForType = (type: ResultType): string => {
  switch (type) {
    case 'folder': return 'folder_shared';
    case 'file': return 'description';
    case 'person': return 'person';
    default: return 'search';
  }
};

export const getIconStyles = (type: ResultType): string => {
  switch (type) {
    case 'folder': 
      return 'bg-blue-100 dark:bg-blue-900/30 text-primary';
    case 'file': 
      return 'bg-energy/20 text-[#b39700] dark:text-energy';
    case 'person': 
      return 'bg-slate-100 dark:bg-slate-700 text-slate-500';
    default: 
      return 'bg-slate-100 dark:bg-slate-700 text-slate-500';
  }
};
