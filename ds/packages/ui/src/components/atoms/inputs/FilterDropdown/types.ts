export interface FilterDropdownProps {
  /** Icono del trigger */
  icon: string;
  /** Label descriptivo */
  label: string;
  /** Lista de opciones disponibles */
  options: string[];
  /** Lista de opciones seleccionadas */
  selected: string[];
  /** Callback al alternar una opción */
  onToggle: (value: string) => void;
  /** Clase CSS adicional para el contenedor */
  className?: string;
}
