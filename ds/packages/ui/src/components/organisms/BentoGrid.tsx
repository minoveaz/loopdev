import React from 'react';
import { cn } from '@/helpers/cn';
import { ArrowRight } from 'lucide-react';
import { Box, Stack } from '@/components/layout';

export interface BentoItemProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  visual?: React.ReactNode;
  className?: string;
  colSpan?: 1 | 2 | 3;
  rowSpan?: 1 | 2;
  variant?: 'default' | 'primary' | 'image';
}

export const BentoItem: React.FC<BentoItemProps> = ({ 
  title, 
  description, 
  icon, 
  visual, 
  className = '',
  colSpan = 1,
  rowSpan = 1,
  variant = 'default'
}) => {
  
  const colClasses = {
    1: 'md:col-span-1',
    2: 'md:col-span-2',
    3: 'md:col-span-3',
  };

  const rowClasses = {
    1: 'md:row-span-1',
    2: 'md:row-span-2',
  };

  const variantStyles = {
    default: 'bg-[var(--lpd-color-bg-base)] border border-[var(--lpd-color-border-subtle)] text-[var(--lpd-color-text-base)] hover:border-[var(--lpd-color-brand-primary)] shadow-sm hover:shadow-xl',
    primary: 'bg-[var(--lpd-color-brand-primary)] text-[var(--lpd-color-text-base)] border-transparent shadow-xl shadow-[var(--lpd-color-brand-primary)]/10',
    image: 'bg-[var(--lpd-color-slate-900)] text-white border-transparent overflow-hidden relative shadow-lg',
  };

  return (
    <Box 
      padding={6}
      radius="3xl"
      className={cn(
        "relative overflow-hidden transition-all duration-500 hover:-translate-y-1 flex flex-col group",
        colClasses[colSpan], 
        rowClasses[rowSpan],
        variantStyles[variant],
        className
      )}
    >
      {/* Content Top */}
      <div className="relative z-10 flex items-start justify-between mb-4">
        {icon && (
          <Box 
            padding={2} 
            radius="lg" 
            className={cn(
              variant === 'primary' ? 'bg-white/20 text-white' : 'bg-white/50 backdrop-blur-sm shadow-sm text-[var(--lpd-color-brand-primary)]'
            )}
          >
            {React.cloneElement(icon as React.ReactElement, { size: 20 })}
          </Box>
        )}
      </div>

      <Stack gap={1} className="relative z-10 mt-auto">
        <h3 className="text-xl font-bold tracking-tight leading-tight">{title}</h3>
        <p className={cn(
          "text-sm leading-relaxed font-medium",
          variant === 'default' ? 'text-[var(--lpd-color-text-muted)]' : 'opacity-80'
        )}>
          {description}
        </p>
      </Stack>

      {/* Visual Slot */}
      {visual && (
        <div className="absolute inset-0 z-0 opacity-100 transition-opacity pointer-events-none">
          {visual}
        </div>
      )}

      {/* Hover decoration */}
      {variant === 'default' && (
        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 duration-500">
           <ArrowRight size={20} className="text-[var(--lpd-color-brand-primary)]" />
        </div>
      )}
    </Box>
  );
};

export interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

export const BentoGrid: React.FC<BentoGridProps> = ({ children, className = '' }) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[minmax(180px,auto)]", className)}>
      {children}
    </div>
  );
};
