import React from 'react';
import { cn } from '@/helpers/cn';
import { Stack, Box } from '@/components/layout';
import { Sparkles } from 'lucide-react';

export interface MeshHeroProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

/**
 * Snippet: surfaces/MeshHero
 * Dynamic surface with radial gradients and a focus on visual impact.
 */
export const MeshHero: React.FC<MeshHeroProps> = ({ 
  title, 
  description, 
  icon,
  className = ''
}) => {
  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-[40px] border border-[var(--lpd-color-border-subtle)] shadow-sm p-12 min-h-[20rem] flex flex-col justify-center items-center text-center transition-all duration-700 hover:shadow-2xl group",
        className
      )}
      style={{ 
        background: `radial-gradient(at 0% 0%, var(--lpd-color-brand-primary) 0px, transparent 50%), radial-gradient(at 100% 100%, var(--lpd-color-brand-secondary) 0px, transparent 50%), var(--lpd-color-bg-base)` 
      }}
    >
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ 
             background: 'radial-gradient(var(--lpd-color-text-base) 1px, transparent 1px)', 
             backgroundSize: '20px 20px'
           }} 
      />

      <Box 
        background="base" 
        radius="2xl" 
        className="w-16 h-16 shadow-xl flex items-center justify-center mb-8 text-[var(--lpd-color-brand-primary)] group-hover:scale-110 transition-transform duration-500"
      >
        {icon || <Sparkles size={32} />}
      </Box>
      
      <Stack gap={3} align="center">
        {title && <h4 className="font-black text-[var(--lpd-color-text-base)] text-3xl tracking-tight">{title}</h4>}
        {description && <p className="text-[var(--lpd-color-text-muted)] text-base max-w-sm leading-relaxed font-medium">{description}</p>}
      </Stack>
    </div>
  );
};
