import React from 'react';
import { cn } from '../../../helpers/cn';

export interface InfiniteMarqueeProps {
  children: React.ReactNode;
  speed?: 'slow' | 'medium' | 'fast';
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
  className?: string;
}

const speedMap = {
  slow: '40s',
  medium: '25s',
  fast: '15s',
};

/**
 * InfiniteMarquee Primitive
 * Handles horizontal infinite scrolling animation for any list of elements.
 */
export const InfiniteMarquee: React.FC<InfiniteMarqueeProps> = ({
  children,
  speed = 'medium',
  direction = 'left',
  pauseOnHover = true,
  className,
}) => {
  return (
    <div className={cn("relative flex overflow-hidden group", className)}>
      <div 
        className={cn(
          "flex min-w-full shrink-0 items-center justify-around gap-12 py-4 animate-scroll",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
          direction === 'right' && "direction-reverse"
        )}
        style={{ '--duration': speedMap[speed] } as React.CSSProperties}
      >
        {children}
        {/* Duplicate children for infinite loop */}
        {children}
      </div>
      
      {/* Second set for seamless loop */}
      <div 
        aria-hidden="true"
        className={cn(
          "flex min-w-full shrink-0 items-center justify-around gap-12 py-4 animate-scroll",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
          direction === 'right' && "direction-reverse"
        )}
        style={{ '--duration': speedMap[speed] } as React.CSSProperties}
      >
        {children}
        {children}
      </div>

      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }
        .animate-scroll {
          animation: marquee-scroll var(--duration) linear infinite;
        }
        .direction-reverse {
          animation-direction: reverse;
        }
      `}</style>
    </div>
  );
};
