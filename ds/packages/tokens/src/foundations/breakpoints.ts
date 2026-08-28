export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;

export function getMediaQuery(breakpoint: BreakpointKey, type: 'min' | 'max' = 'min') {
  const value = BREAKPOINTS[breakpoint];
  return `(${type}-width: ${type === 'max' ? value - 1 : value}px)`;
}

export const TAILWIND_BREAKPOINT_MAP = {
  'max-sm': getMediaQuery('sm', 'max'),
  'max-md': getMediaQuery('md', 'max'),
  'max-lg': getMediaQuery('lg', 'max'),
  'max-xl': getMediaQuery('xl', 'max'),
  sm: getMediaQuery('sm'),
  md: getMediaQuery('md'),
  lg: getMediaQuery('lg'),
  xl: getMediaQuery('xl'),
  '2xl': getMediaQuery('2xl'),
} as const;