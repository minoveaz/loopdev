
import React from 'react';

export type ComponentCategory = 'All' | 'Forms' | 'Data' | 'Feedback' | 'Navigation' | 'Overlays' | 'Actions';
export type GridSize = 'small' | 'medium' | 'wide' | 'tall' | 'large' | 'full';

export interface ComponentEntry {
  id: string;
  title: string;
  category: ComponentCategory;
  description: string;
  size: GridSize;
  component: React.ReactNode;
}
