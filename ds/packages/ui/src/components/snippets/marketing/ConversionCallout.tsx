import React from 'react';
import { Gift } from 'lucide-react';
import { Callout } from '@/components/molecules/Callout';

/**
 * Snippet: marketing/ConversionCallout
 * A high-impact CTA section for the end of pages.
 */
export const ConversionCallout = () => (
  <Callout 
    title="Scale your brand system"
    description="Join 2,000+ teams using LoopDev to maintain consistency across every marketing asset and digital platform."
    primaryAction={{ label: 'Start Free Trial' }}
    secondaryAction={{ label: 'View Pricing' }}
    variant="brand"
    icon={<Gift size={32} />}
  />
);
