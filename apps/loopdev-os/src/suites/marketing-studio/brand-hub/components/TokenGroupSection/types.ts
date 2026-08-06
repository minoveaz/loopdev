import { ColorToken } from "../../types";

export interface TokenGroupSectionProps {
  title: string;
  description?: string;
  tokens: ColorToken[];
  theme: 'light' | 'dark';
  selectedTokenId?: string;
  onTokenClick?: (token: ColorToken) => void;
  onCopy?: (value: string) => void;
}
