import React from 'react';
import { cn } from '@/helpers/cn';
import { Box, Stack, Inline } from '@/components/layout';
import { BarChart3 } from 'lucide-react';

export interface TechnicalDotGridProps {
  title?: string;
  metric?: string;
  label?: string;
  icon?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'pattern-only';
}

/**
 * Snippet: surfaces/TechnicalDotGrid
 * Technical background grid pattern for data visualization and engineering aesthetics.
 */
export const TechnicalDotGrid: React.FC<TechnicalDotGridProps> = ({ 
  title = "Métricas", 
  metric = "98.5%", 
  label = "Uptime",
  icon,
  className = '',
  variant = 'default'
}) => {
  const isPatternOnly = variant === 'pattern-only';

  const dotPattern = {
    background: 'radial-gradient(var(--lpd-color-text-muted) 1px, transparent 1px)', 
    backgroundSize: '24px 24px',
  };

  if (isPatternOnly) {
    return (
      <div 
        className={cn("absolute inset-0 opacity-[0.08] pointer-events-none", className)} 
        style={dotPattern}
      />
    );
  }

  return (
    <Box 
      radius="3xl" 
      background="base"
      border 
      className={cn("relative overflow-hidden min-h-[14rem] flex flex-col group transition-all duration-300 hover:border-[var(--lpd-color-brand-primary)]", className)}
    >
      {/* The Dot Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.08]" 
        style={dotPattern}
      />
      
      <Box 
        padding={5} 
        className="relative z-10 border-b border-[var(--lpd-color-border-subtle)] bg-[var(--lpd-color-bg-base)]/80 backdrop-blur-md"
      >
        <Inline justify="between" align="center">
          <span className="font-black text-[10px] uppercase tracking-[0.2em] text-[var(--lpd-color-text-muted)] flex items-center gap-2">
            {icon || <BarChart3 size={14} className="text-[var(--lpd-color-brand-primary)]" />} 
            {title}
          </span>
          <Box paddingX={2} paddingY={0.5} radius="full" background="subtle" className="text-[9px] font-bold uppercase tracking-wider">Live</Box>
        </Inline>
      </Box>
      
      <div className="relative z-10 flex-1 p-6 flex items-center justify-center">
        <Stack gap={1} align="center">
          <span className="text-5xl font-black text-[var(--lpd-color-text-base)] tracking-tighter block group-hover:scale-110 transition-transform duration-500">
            {metric}
          </span>
          <span className="block text-[10px] text-[var(--lpd-color-text-muted)] uppercase tracking-[0.2em] font-black opacity-50">
            {label}
          </span>
        </Stack>
      </div>
    </Box>
  );
};
