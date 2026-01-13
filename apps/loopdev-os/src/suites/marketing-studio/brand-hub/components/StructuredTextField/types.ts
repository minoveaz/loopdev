export interface StructuredTextFieldProps {
  label: string;
  description?: string;
  value: string;
  isEditable?: boolean;
  onValueChange?: (newValue: string) => void;
  onClick?: () => void;
  className?: string;
}
