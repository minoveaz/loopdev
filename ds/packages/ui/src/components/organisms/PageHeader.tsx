import React from 'react';
import { Inline, Stack, Box, Container } from '@/components/layout';
import { cn } from '@/helpers/cn';

export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: React.ReactNode;
  actions?: React.ReactNode;
  tabs?: React.ReactNode;
  className?: string;
}

/**
 * PageHeader (Level 2 Header)
 * Handles contextual page information, navigation (tabs), and primary actions.
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  breadcrumbs,
  actions,
  tabs,
  className,
}) => {
  return (
    <Box background="base" className={cn("border-b border-[var(--lpd-color-border-subtle)]", className)}>
      <Container size="xl">
        <Stack gap={6} className="py-6">
          {/* Top Row: Breadcrumbs & Actions */}
          <Inline justify="between" align="start">
            <Stack gap={1} className="flex-1">
              {breadcrumbs && (
                <div className="text-xs text-[var(--lpd-color-text-muted)] font-medium mb-1">
                  {breadcrumbs}
                </div>
              )}
              <h1 className="text-3xl font-bold tracking-tight text-[var(--lpd-color-text-base)]">
                {title}
              </h1>
              {description && (
                <p className="text-[var(--lpd-color-text-muted)] text-sm max-w-2xl">
                  {description}
                </p>
              )}
            </Stack>

            {actions && (
              <Inline gap={3} className="shrink-0 pt-1">
                {actions}
              </Inline>
            )}
          </Inline>

          {/* Bottom Row: Tabs/Secondary Nav */}
          {tabs && (
            <Box className="-mb-6">
              {tabs}
            </Box>
          )}
        </Stack>
      </Container>
    </Box>
  );
};
