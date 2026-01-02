import React from 'react';
import { useLabel } from './useLabel';
import { Text } from '../Typography';

export interface LabelProps {
  children: React.ReactNode;
  required?: boolean;
  className?: string;
  as?: any;
  htmlFor?: string;
  textSize?: string;
  textWeight?: string;
}

/**
 * @component Label
 * @description Etiqueta semántica para formularios y texto técnico. Es una composición pre-configurada de la primitiva Text.
 * @category Primitives
 * @status beta
 */
export const Label: React.FC<LabelProps> = (props) => {
  const { textComponentProps, children, required } = useLabel(props);

  return (
    <Text {...textComponentProps}>
      {children}
      {required && <span className="text-danger ml-1" title="Required field">*</span>}
    </Text>
  );
};