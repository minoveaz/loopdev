import { useMemo } from 'react';
import { SuiteSidebarProps } from './types';
import { NavGroup, NavItem } from '@loopdev/contracts';

/**
 * @hook useSuiteSidebar
 * @description Lógica de negocio para el controlador de contexto SuiteSidebar.
 * Gestiona el filtrado de permisos, prioridades y estados de densidad.
 */
export const useSuiteSidebar = (props: SuiteSidebarProps) => {
  const { 
    schema, 
    navMode, 
    accessMap, 
    activeModuleId,
    className = '' 
  } = props;

  // 1. Estado de Densidad
  const isRail = navMode === 'rail';

  // 2. Procesamiento de Navegación (Filtrado y Ordenación)
  const visibleGroups = useMemo(() => {
    return schema.groups
      .map(group => {
        // Filtrar items del grupo según el mapa de acceso
        const filteredItems = group.items.filter(item => {
          const moduleId = (item as any).moduleId; // Solo los de tipo 'module' tienen moduleId
          const access = moduleId ? accessMap[moduleId] : 'enabled';
          return access !== 'hidden';
        }).sort((a, b) => a.priority - b.priority);

        return { ...group, items: filteredItems };
      })
      // Ocultar grupos que se hayan quedado vacíos tras el filtrado
      .filter(group => group.items.length > 0)
      .sort((a, b) => a.priority - b.priority);
  }, [schema.groups, accessMap]);

  // 3. Composición de Clases del Contenedor
  // Delegamos el grueso del estilo al TechnicalSurface, aquí gestionamos el layout flex
  const containerClasses = `
    flex flex-col h-full w-full transition-all duration-300
    ${className}
  `.replace(/\s+/g, ' ').trim();

  // 4. Lógica de Scroll y Áreas Fijas
  const scrollAreaClasses = `
    flex-1 overflow-y-auto overflow-x-hidden
    scrollbar-none hover:scrollbar-thin scrollbar-thumb-primary/20
  `.replace(/\s+/g, ' ').trim();

  return {
    isRail,
    visibleGroups,
    containerClasses,
    scrollAreaClasses,
    suite: schema.suite,
    exitHatch: schema.exitHatch,
    activeModuleId
  };
};
