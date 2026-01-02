import React from 'react';
import { Box, Container, Grid, Stack, Inline } from '../../../components/layout';
import { cn } from '../../../helpers/cn';
import { useTenant } from '../../../providers/tenant-provider';
import { TENANT_DATA } from '../../../data/tenants';

export interface FooterSection {
  title: string;
  links: { label: string; href: string }[];
}

export interface MarketingFooterProps {
  sections: FooterSection[];
  description?: string;
  className?: string;
}

export const MarketingFooter: React.FC<MarketingFooterProps> = ({ 
  sections, 
  description,
  className 
}) => {
  const { tenant } = useTenant();
  const data = TENANT_DATA[tenant];
  const currentYear = new Date().getFullYear();

  return (
    <Box as="footer" paddingY={16} background="base" className={cn("border-t border-[var(--lpd-color-border-subtle)]", className)}>
      <Container>
        <Grid cols={12} gap={8} responsive="none" className="grid-cols-1 md:grid-cols-12">
          {/* Brand Info */}
          <Stack gap={6} className="md:col-span-4">
            <Inline gap={2} align="center">
              <Box background="primary" radius="md" className="w-8 h-8 flex items-center justify-center text-white font-bold">
                {data.name.charAt(0)}
              </Box>
              <h2 className="text-xl font-bold tracking-tight">{data.name}</h2>
            </Inline>
            {description && (
              <p className="text-[var(--lpd-color-text-muted)] text-sm leading-relaxed max-w-xs">
                {description}
              </p>
            )}
          </Stack>

          {/* Links Grid */}
          <div className="md:col-span-8">
            <Grid cols={3} gap={8} responsive="form">
              {sections.map((section) => (
                <Stack key={section.title} gap={4}>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--lpd-color-text-base)]">
                    {section.title}
                  </h3>
                  <Stack gap={2}>
                    {section.links.map((link) => (
                      <a 
                        key={link.label} 
                        href={link.href} 
                        className="text-sm text-[var(--lpd-color-text-muted)] hover:text-[var(--lpd-color-brand-primary)] transition-colors"
                      >
                        {link.label}
                      </a>
                    ))}
                  </Stack>
                </Stack>
              ))}
            </Grid>
          </div>
        </Grid>

        {/* Bottom Bar */}
        <Box paddingY={8} className="mt-16 border-t border-[var(--lpd-color-border-subtle)]">
          <Inline justify="between" align="center" gap={4} className="text-xs text-[var(--lpd-color-text-muted)]">
            <p>© {currentYear} {data.name}. All rights reserved.</p>
            <Inline gap={6}>
              <a href="#" className="hover:text-[var(--lpd-color-text-base)] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[var(--lpd-color-text-base)] transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-[var(--lpd-color-text-base)] transition-colors">Cookies</a>
            </Inline>
          </Inline>
        </Box>
      </Container>
    </Box>
  );
};
