import React from 'react';
import { TechnicalDropdownProps } from './types';

export const TECHNICAL_DROPDOWN_FIXTURES: Record<string, any> = {
  basic: {
    trigger: <button>Click me</button>,
    align: 'start',
    sideOffset: 8
  },
  complex: {
    trigger: <button>Advanced Menu</button>,
    align: 'end',
    sideOffset: 12
  }
};
