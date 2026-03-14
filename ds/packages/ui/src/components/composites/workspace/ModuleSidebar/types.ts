import React from 'react';
import { NavGroup } from '@loopdev/contracts';

export type SidebarMode = 'module' | 'brand';

export interface BrandItem {
  id: string;
  name: string;
  status: 'draft' | 'published' | 'archived';
  updatedAt: string;
}

export interface ModuleSidebarProps {
  /** Modo de visualización del sidebar */
  mode: SidebarMode;
  
  /** [Module Mode] Lista de marcas */
  brands?: BrandItem[];
  
  /** [Module Mode] Valor del buscador */
  searchValue?: string;
  
  /** [Module Mode] Callback al buscar */
  onSearchChange?: (value: string) => void;
  
  /** [Module Mode] Callback al seleccionar una marca */
  onSelectBrand?: (brandId: string) => void;
  
  /** [Brand Mode] Estructura de navegación de la marca */
  navGroups?: NavGroup[];
  
  /** [Brand Mode] Callback para volver al directorio */
  onBackToDirectory?: () => void;

  /** [Brand Mode] Callback para navegar entre secciones */
  onNavigate?: (routeId: string) => void;
  
  /** [Brand Mode] ID de la ruta activa */
  activeRouteId?: string;

  /** Estado de carga */
  isLoading?: boolean;

  /** Clase CSS adicional */
  className?: string;
}
