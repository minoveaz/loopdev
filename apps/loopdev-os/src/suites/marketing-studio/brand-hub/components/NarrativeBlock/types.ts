import { BrandIdentity } from "../../types";

export interface NarrativeBlockProps {
  data: BrandIdentity['narrative'];
  isEditable?: boolean;
  onUpdate?: (field: keyof BrandIdentity['narrative'], value: string | Array<{ title: string; description: string }>) => void;
  onFieldClick?: (field: string) => void;
}
