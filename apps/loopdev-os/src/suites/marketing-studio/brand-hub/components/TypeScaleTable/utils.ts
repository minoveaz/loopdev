/**
 * Calculates the font size for a given scale step.
 * 
 * @param baseSize - The root font size in pixels (e.g., 16)
 * @param scaleRatio - The multiplier ratio (e.g., 1.25 for Major Third)
 * @param power - The exponent step (e.g., 3 for H1, -1 for Caption)
 * @returns Object containing rounded pixel value and precise rem string
 */
export const calculateTypeScale = (baseSize: number, scaleRatio: number, power: number) => {
  const size = baseSize * Math.pow(scaleRatio, power);
  return {
    px: Math.round(size),
    rem: (size / 16).toFixed(3)
  };
};
