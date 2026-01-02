import React from 'react';
import { useTypography } from './useTypography';

/**
 * @component Text
 * @description Primitiva tipográfica base alineada a v3.8. Soporta Inter y JetBrains Mono.
 * @category Foundations
 * @status stable
 */
export const Text = (props: any) => {
  const { classes, Component } = useTypography(props);
  const { children, size, weight, variant, className, as, ...rest } = props;
  return <Component className={classes} {...rest}>{children}</Component>;
};

/**
 * @component Heading
 * @description Variante preconfigurada para titulares de alto impacto. Inter Black con tracking negativo.
 * @category Foundations
 * @status stable
 */
export const Heading = ({ size = '3xl', weight = 'black', ...props }) => (
  <Text size={size} weight={weight} as="h1" {...props} />
);

/**
 * @component Code
 * @description Variante para datos técnicos, logs y snippets. Utiliza superficies semánticas y tokens de texto atenuado.
 * @category Foundations
 * @status stable
 */
export const Code = ({ variant = 'mono', className = '', ...props }) => (
  <Text 
    variant={variant} 
    className={`bg-surface-glass px-1.5 py-0.5 rounded border border-border-subtle text-text-muted ${className}`} 
    {...props} 
  />
);