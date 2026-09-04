import type { ReactNode } from 'react';

export interface ProductShowcaseItem {
  id: string;
  title: string;
  description: string;
  badge?: string;
  iconName?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  period?: string;
  description: string;
  isPopular?: boolean;
  features: string[];
  ctaLabel: string;
  onSelect?: () => void;
}

export interface ProductShowcaseGridProps {
  title?: string;
  subtitle?: string;
  products: ProductShowcaseItem[];
  className?: string;
}

export interface PricingComparisonTableProps {
  title?: string;
  subtitle?: string;
  tiers: PricingTier[];
  className?: string;
}

export interface FeatureSpotlightProps {
  badge?: string;
  title: string;
  description: string;
  bullets: string[];
  ctaSlot?: ReactNode;
  visualSlot?: ReactNode;
  reversed?: boolean;
  className?: string;
}
