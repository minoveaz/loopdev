import { ToneProfile } from "../../types";

export interface VoiceToneBlockProps {
  profiles: ToneProfile[];
  isLoading?: boolean;
  isEditable?: boolean;
  onProfileClick?: (profile: ToneProfile) => void;
  onUpdate?: (profiles: ToneProfile[]) => void;
}
