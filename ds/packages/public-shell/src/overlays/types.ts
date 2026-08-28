import type { ReactNode } from 'react';

export interface PublicAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children?: ReactNode;
}

export interface PublicCookieBannerProps {
  title?: string;
  description?: string;
  privacyPolicyUrl?: string;
  onAcceptAll?: () => void;
  onRejectNonEssential?: () => void;
}
