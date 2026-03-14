'use client';

import { useMemo } from 'react';

export const useLabel = (props: any) => {
  const { 
    required = false,
    className = '',
    as = 'label',
    textSize = 'xs', // Default size 10px
    textWeight = 'bold', // Default weight 700
    children,
    // Destructure and ignore the conflicting 'color' HTML attribute
    color,
    ...rest
  } = props;

  const finalClassName = useMemo(() => {
    // VISUAL_COMPOSITION_SYSTEM v3.8 -> "UI Labels: weight 700, uppercase, 10px"
    const baseStyles = 'uppercase tracking-widest text-slate-400';
    return [baseStyles, className].join(' ').trim();
  }, [className]);

  // Props to be passed down to the composed Text component
  const textComponentProps = {
    as: as,
    size: textSize,
    weight: textWeight,
    className: finalClassName,
    ...rest
  };

  return {
    textComponentProps,
    children,
    required, // Returning boolean state instead of JSX for compatibility with pure .ts files
  };
};