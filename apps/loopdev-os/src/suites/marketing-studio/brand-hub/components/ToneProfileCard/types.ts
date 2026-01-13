import { ToneProfile } from "../../types";

export interface ToneProfileCardProps {
  profile: ToneProfile;
  onClick?: () => void;
  className?: string;
}
