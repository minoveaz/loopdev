import { NavGroupProps } from './types';

/**
 * @hook useNavGroup
 * @description Lógica para gestionar el espaciado y visibilidad del grupo.
 */
export const useNavGroup = (props: NavGroupProps) => {
  const { isRail = false, className = '' } = props;

  // 1. Ritmo Vertical (Historia 2.1 de Rail Mode)
  const containerClasses = `
    ${isRail ? 'mt-10 first:mt-0' : 'space-y-2'}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  return {
    isRail,
    containerClasses
  };
};
