import React from 'react';
import { BentoGrid } from '@/components/organisms/BentoGrid';
import { Box } from '@/components/layout';

// Import individual bento cards
import { PolicyManagementCard } from './bento/PolicyManagementCard';
import { GlobalCoverageCard } from './bento/GlobalCoverageCard';
import { MobileAppCard } from './bento/MobileAppCard';
import { Support247Card } from './bento/Support247Card';
import { BankSecurityCard } from './bento/BankSecurityCard';

/**
 * Snippet: marketing/FeatureBento
 * A modern feature showcase using the Bento Grid layout.
 */
export const FeatureBento = () => (
  <Box padding={{ base: 4, md: 8 }} background="subtle" radius="3xl" border className="shadow-sm">
    <BentoGrid>
      <PolicyManagementCard />
      <GlobalCoverageCard />
      <MobileAppCard />
      <Support247Card />
      <BankSecurityCard />
    </BentoGrid>
  </Box>
);
