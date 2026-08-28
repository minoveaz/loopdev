'use client';

import { useEffect, useState } from 'react';
import { BREAKPOINTS, getMediaQuery, type BreakpointKey } from '@loopdev/tokens';

export function useBreakpoint(breakpoint: BreakpointKey, type: 'min' | 'max' = 'min') {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(getMediaQuery(breakpoint, type));
    const update = () => setMatches(mediaQueryList.matches);
    update();
    mediaQueryList.addEventListener('change', update);
    return () => mediaQueryList.removeEventListener('change', update);
  }, [breakpoint, type]);

  return matches;
}

export function useDeviceType() {
  const isDesktop = useBreakpoint('lg');
  const isTablet = useBreakpoint('md');
  return isDesktop ? 'desktop' : isTablet ? 'tablet' : 'mobile';
}

export function useIsMobile() {
  return !useBreakpoint('lg');
}

export { BREAKPOINTS };