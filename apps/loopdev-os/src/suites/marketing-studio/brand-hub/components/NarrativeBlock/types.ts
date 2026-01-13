import { BrandIdentity } from "../../types";

export interface NarrativeBlockProps {
  data: BrandIdentity['narrative'];
  isEditable?: boolean;
  onUpdate?: (field: string, value: any) => void;
  onFieldClick?: (field: string) => void;
}
