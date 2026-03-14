import { TypographySystem } from '@loopdev/contracts';

/**
 * The Official LoopDev Brand Typography System.
 * Modeled strictly according to the TypographySchema.
 */
export const LOOPDEV_TYPOGRAPHY_SYSTEM: TypographySystem = {
  primary: {
    family: 'Inter',
    type: 'sans',
    source: 'google',
    sourceUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;900&display=swap',
    license: 'OFL (Open Font License)',
    description: "Designed for computer screens, Inter features a tall x-height to aid in readability of mixed-case and lower-case text.",
    variants: [
      { weight: 400, style: 'normal', usage: 'Body text' },
      { weight: 600, style: 'normal', usage: 'UI emphasis' },
      { weight: 900, style: 'normal', usage: 'Display headings' }
    ],
    fallbacks: ['system-ui', '-apple-system', 'sans-serif']
  },
  secondary: {
    family: 'JetBrains Mono',
    type: 'mono',
    source: 'google',
    license: 'OFL (Open Font License)',
    description: "A typeface for developers. Its characters have increased height for better readability in code.",
    variants: [
      { weight: 400, style: 'normal', usage: 'Code blocks' },
      { weight: 700, style: 'normal', usage: 'Technical data keys' }
    ],
    fallbacks: ['Menlo', 'Monaco', 'monospace']
  },
  baseSize: 16,
  scaleRatio: 1.25, // Major Third
  lineHeightBase: 1.5,
  aiOptimized: true
};
