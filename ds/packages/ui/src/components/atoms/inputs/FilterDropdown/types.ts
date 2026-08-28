export interface FilterDropdownProps {
  /** Icono del trigger */
  icon: string;
  /** Label descriptivo */
  label: string;
  /** Lista de opciones disponibles */
  options: string[];
  /** Lista de opciones seleccionadas */
  selected: string[];
  /** Closes after one choice when the filter is single-select. */
  multiple?: boolean;
  /** Callback al alternar una opción */
  onToggle: (value: string) => void;
  /** Clears every selected option in multi-select mode. */
  onClear?: () => void;
  /** Prevents opening and interaction. */
  disabled?: boolean;
  /** Allows inspecting options without changing selection. */
  readOnly?: boolean;
  /** Shows the selected-item count badge in the trigger. */
  showSelectionCount?: boolean;
  /** Clase CSS adicional para el contenedor */
  className?: string;
}
