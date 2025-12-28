import React from 'react';
import { cn } from '@/helpers/cn';

import { InfiniteMarquee } from '@/components/layout/foundations/InfiniteMarquee';
import { Grid } from '@/components/layout/foundations/Grid';

export interface LogoItem {
  name: string;
  logo: React.ReactNode;
}

export interface LogoCloudProps {
  title?: string;
  logos: LogoItem[];
  variant?: 'grid' | 'row' | 'ticker';
  className?: string;
}

export const LogoCloud: React.FC<LogoCloudProps> = ({ 
  title, 
  logos,
  variant = 'ticker',
  className
}) => {
  const isTicker = variant === 'ticker';

  return (
    <div className={cn("w-full py-8 relative", className)}>
      {title && (
        <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-[var(--lpd-color-text-muted)] mb-10">
          {title}
        </p>
      )}
      
      <div className="relative group">
        {/* Faded Edges Overlay */}
        {isTicker && (
          <>
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[var(--lpd-color-bg-base)] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[var(--lpd-color-bg-base)] to-transparent z-10 pointer-events-none" />
          </>
        )}

        {isTicker ? (
          <InfiniteMarquee speed="slow" pauseOnHover={true}>
            {logos.map((item, idx) => (
              <div 
                key={idx} 
                className="group flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 opacity-40 hover:opacity-100 hover:scale-110 px-8"
                title={item.name}
              >
                {item.logo}
              </div>
            ))}
          </InfiniteMarquee>
        ) : (
          <Grid responsive="logos" gap={12} className="opacity-60 items-center">
            {logos.map((item, idx) => (
              <div 
                key={idx} 
                className="group flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 opacity-50 hover:opacity-100 hover:scale-110"
                title={item.name}
              >
                {item.logo}
              </div>
            ))}
          </Grid>
        )}
      </div>
    </div>
  );
};
