import { ColorToken } from "../../types";

export interface ColorTokenCardProps {
  token: ColorToken;
  theme: 'light' | 'dark';
  isActive?: boolean;
  onClick?: () => void;
  onCopy?: (value: string) => void;
}
