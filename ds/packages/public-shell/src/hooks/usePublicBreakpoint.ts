'use client';

import { useEffect, useState } from 'react';
import type { PublicViewportMode } from '@loopdev/contracts';

export interface PublicBreakpointState {
  mode: PublicViewportMode;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
}

const getBreakpointState = (width: number): PublicBreakpointState => {
  if (width < 640) {
    return {
      mode: 'mobile',
      isMobile: true,
      isTablet: false,
      isDesktop: false,
      width,
    };
  }
  if (width < 1024) {
    return {
      mode: 'tablet',
      isMobile: false,
      isTablet: true,
      isDesktop: false,
      width,
    };
  }
  return {
    mode: 'desktop',
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    width,
  };
};

export const usePublicBreakpoint = (): PublicBreakpointState => {
  const [state, setState] = useState<PublicBreakpointState>(() => {
    if (typeof window !== 'undefined') {
      return getBreakpointState(window.innerWidth);
    }
    return {
      mode: 'desktop',
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      width: 1280,
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setState(getBreakpointState(window.innerWidth));
    };

    window.addEventListener('resize', handleResize, { passive: true });
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return state;
};
