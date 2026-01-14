/**
 * @utility color
 * @description Helpers for chromatic calculations and accessibility checks.
 */

/**
 * Calculates the relative luminance of a HEX color.
 * Based on WCAG 2.0 formula.
 */
export const getLuminance = (hex: string): number => {
  // Support hex with alpha by stripping it for luminance calculation
  const cleanHex = hex.replace('#', '').substring(0, 6);
  
  if (cleanHex.length !== 6) return 0;

  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const a = [r, g, b].map((v) => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

/**
 * Calculates contrast ratio between two HEX colors.
 * Formula: (L1 + 0.05) / (L2 + 0.05)
 */
export const getContrastRatio = (hex1: string, hex2: string): number => {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  
  const brightest = Math.max(l1, l2);
  const darkest = Math.min(l1, l2);
  
  return (brightest + 0.05) / (darkest + 0.05);
};

/**
 * Returns WCAG 2.1 compliance level.
 * AAA: 7.0+ (Universal accessibility)
 * AA: 4.5+ (Paragraphs/Small text)
 * AA_LARGE: 3.0+ (Headlines/Large text only)
 * FAIL: < 3.0 (Decorative/Low visibility)
 */
export const getWCAGStatus = (ratio: number): 'AAA' | 'AA' | 'AA_LARGE' | 'FAIL' => {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA_LARGE';
  return 'FAIL';
};

/**
 * Recommends a text color (White or Black) based on background luminance.
 */
export const getContrastColor = (hex: string): 'white' | 'black' => {
  const luminance = getLuminance(hex);
  return luminance > 0.179 ? 'black' : 'white';
};

/**
 * Simple HEX validation.
 */
export const isValidHex = (hex: string): boolean => {
  return /^#([A-Fa-f0-9]{3}){1,2}([A-Fa-f0-9]{2})?$/.test(hex);
};