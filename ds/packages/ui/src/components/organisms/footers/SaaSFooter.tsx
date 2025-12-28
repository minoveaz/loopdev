import React from 'react';
import { Box, Container, Inline } from '@/components/layout';
import { cn } from '@/helpers/cn';

export interface SaaSFooterProps {
  version?: string;
  links?: { label: string; href: string }[];
  className?: string;
}

export const SaaSFooter: React.FC<SaaSFooterProps> = ({ 
  version, 
  links = [], 
  className 
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <Box 
      as="footer" 
      paddingY={4} 
      className={cn("border-t border-[var(--lpd-color-border-subtle)] bg-[var(--lpd-color-bg-base)]/50 backdrop-blur-sm", className)}
    >
      <Container size="xl">
        <Inline justify="between" align="center" className="text-[10px] uppercase tracking-widest font-bold text-[var(--lpd-color-text-muted)]">
          <Inline gap={4}>
            <span>© {currentYear} LoopDev System</span>
            {version && <span className="opacity-50">Version {version}</span>}
          </Inline>
          
          <Inline gap={6}>
            {links.map((link) => (
              <a 
                key={link.label} 
                href={link.href} 
                className="hover:text-[var(--lpd-color-brand-primary)] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </Inline>
        </Inline>
      </Container>
    </Box>
  );
};
