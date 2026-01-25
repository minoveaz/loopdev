import { LogoSystem } from '@loopdev/contracts';

// The Official LoopDev Isotype (Vector Path)
const LOOP_ISOTYPE_SVG = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 7.5C6.11929 7.5 5 8.61929 5 10V14C5 15.3807 6.11929 16.5 7.5 16.5C8.88071 16.5 10 15.3807 10 14V10C10 8.61929 8.88071 7.5 7.5 7.5Z" stroke="currentColor" stroke-width="2"/><path d="M16.5 7.5C15.1193 7.5 14 8.61929 14 10V14C14 15.3807 15.1193 16.5 16.5 16.5C17.8807 16.5 19 15.3807 19 14V10C19 8.61929 17.8807 7.5 16.5 7.5Z" stroke="currentColor" stroke-width="2"/><path d="M10 12H14" stroke="currentColor" stroke-width="2"/></svg>`;

// The Horizontal Lockup (Symbol + Text) - Simplified for MVP
const LOOP_HORIZONTAL_SVG = `<svg viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="translate(0,0)">${LOOP_ISOTYPE_SVG}</g><text x="32" y="17" font-family="Inter, sans-serif" font-weight="800" font-size="14" fill="currentColor">loop.dev</text></svg>`;

// The Vertical Lockup (Stacked)
const LOOP_VERTICAL_SVG = `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="translate(20,12) scale(1)">${LOOP_ISOTYPE_SVG}</g><text x="32" y="52" text-anchor="middle" font-family="Inter, sans-serif" font-weight="800" font-size="8" fill="currentColor">loop.dev</text></svg>`;

export const LOOPDEV_LOGO_SYSTEM: LogoSystem = {
  primary: {
    isotype: {
      url: '/assets/logo-isotype.svg',
      rawSvg: LOOP_ISOTYPE_SVG,
      format: 'svg',
      width: 24,
      height: 24,
      alt: 'LoopDev Infinite Loop Symbol'
    },
    horizontal: {
      url: '/assets/logo-full.svg',
      rawSvg: LOOP_HORIZONTAL_SVG,
      format: 'svg',
      width: 120,
      height: 24,
      alt: 'LoopDev Horizontal Logo'
    },
    vertical: {
      url: '/assets/logo-vertical.svg',
      rawSvg: LOOP_VERTICAL_SVG,
      format: 'svg',
      width: 64,
      height: 64,
      alt: 'LoopDev Vertical Stack'
    }
  },
  monochrome: {
    positive: {
      isotype: { rawSvg: LOOP_ISOTYPE_SVG, format: 'svg', alt: 'Monochrome Black' }
    },
    negative: {
      isotype: { rawSvg: LOOP_ISOTYPE_SVG, format: 'svg', alt: 'Monochrome White' }
    }
  },
  specs: {
    aspectRatio: '1:1 (Symbol) / 5:1 (Lockup)',
    gridType: '8px Grid System',
    strokeWeight: '2px (Fluid)',
    minSize: 16,
    clearSpace: '1x X-Height'
  }
};
