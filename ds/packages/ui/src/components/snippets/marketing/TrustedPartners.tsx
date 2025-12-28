import React from 'react';
import { LogoCloud } from '@/components/molecules/LogoCloud';
import { Box } from '@/components/layout';

// Helper local para el demo
const PlaceholderLogo = ({ text }: { text: string }) => (
  <div className="flex items-center gap-3 font-black text-xl text-[var(--lpd-color-text-base)]">
    <Box background="subtle" radius="lg" className="w-9 h-9 flex items-center justify-center text-xs font-black uppercase">
      {text.charAt(0)}
    </Box>
    <span>{text}</span>
  </div>
);

/**
 * Snippet: marketing/TrustedPartners
 * A showcase of partner or client logos.
 */
export const TrustedPartners = () => (
  <Box padding={8} background="base" border radius="3xl" className="shadow-sm">
    <LogoCloud 
      title="Trusted by innovative brands"
      logos={[
        { name: 'Acme Corp', logo: <PlaceholderLogo text="Acme" /> },
        { name: 'Globex', logo: <PlaceholderLogo text="Globex" /> },
        { name: 'Soylent', logo: <PlaceholderLogo text="Soylent" /> },
        { name: 'Initech', logo: <PlaceholderLogo text="Initech" /> },
        { name: 'Umbrella', logo: <PlaceholderLogo text="Umbrella" /> },
      ]}
    />
  </Box>
);
