import React from 'react';
import { useDivider } from './useDivider';
import { Text } from '../Typography';

/**
 * @component Divider
 * @description Separador visual para contenido, con soporte para orientación y etiquetas.
 * @category Primitives
 * @status stable
 */
export const Divider = (props: any) => {
  const {
    label,
    isHorizontal,
    containerClasses,
    lineClasses,
    labelWrapperClasses,
    ...rest
  } = useDivider(props);

  // Fallback visual directo si el token falla
  const lineStyle = { backgroundColor: 'var(--lpd-color-border-subtle, #e2e8f0)' };

  if (!label) {
    if (isHorizontal) {
      return (
        <div 
          className={`h-px w-full bg-border-subtle ${props.className || ''}`} 
          style={lineStyle}
          {...rest}
          role="separator"
        />
      );
    }
    return (
      <div 
        className={`w-px min-h-[1em] self-stretch bg-border-subtle ${props.className || ''}`} 
        style={lineStyle}
        {...rest}
        role="separator"
      />
    );
  }

  return (
    <div className={containerClasses} {...rest} role="separator">
      <div className={lineClasses} style={lineStyle} />
      <Text as="span" size="xs" weight="medium" className={`shrink-0 ${labelWrapperClasses}`}>
        {label}
      </Text>
      <div className={lineClasses} style={lineStyle} />
    </div>
  );
};