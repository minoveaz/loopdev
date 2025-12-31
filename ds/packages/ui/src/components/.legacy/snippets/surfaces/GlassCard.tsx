import React from 'react';
import { cn } from '../../../helpers/cn';
import { Box, Stack } from '../../../components/layout';

export interface GlassCardProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  backgroundImage?: string;
}

/**
 * Snippet: surfaces/GlassCard
 * Frosted glass effect with decorative blobs and brand-aware gradients.
 */
export const GlassCard: React.FC<GlassCardProps> = ({ 
  title, 
  description, 
  children, 
  className = '',
  backgroundImage
}) => {
  return (
    <div 
      className={cn(
        "relative rounded-[32px] overflow-hidden min-h-[18rem] flex items-center justify-center shadow-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 group",
        className
      )}
      style={{ 
        background: backgroundImage || `linear-gradient(45deg, var(--lpd-color-brand-primary), var(--lpd-color-brand-secondary))` 
      }}
    >
      {/* Decorative Blobs */}
      <div className="w-48 h-48 bg-white rounded-full absolute top-[-10%] left-[-10%] opacity-20 blur-3xl group-hover:scale-110 transition-transform duration-700" />
      <div className="w-64 h-64 bg-white rounded-full absolute bottom-[-15%] right-[-10%] opacity-10 blur-3xl group-hover:translate-x-4 transition-transform duration-700" />
      
      {/* The Glass Panel */}
      <Box 
        className="relative z-10 w-5/6 p-8 border border-white/30 text-white text-center shadow-2xl backdrop-blur-xl"
        radius="3xl"
        style={{ background: 'rgba(255, 255, 255, 0.12)' }}
      >
        <Stack gap={2}>
          {title && <h4 className="font-bold text-2xl drop-shadow-md">{title}</h4>}
          {description && <p className="text-sm opacity-90 leading-relaxed max-w-sm mx-auto">{description}</p>}
          
          {children && (
            <div className="mt-4 flex justify-center">
              {children}
            </div>
          )}
        </Stack>
      </Box>
    </div>
  );
};
