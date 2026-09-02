import { describe, it, expect } from 'vitest';
import { calculateTypeScale } from './utils';

describe('TypeScaleTable Logic', () => {
  it('returns the base size and 1rem at power 0', () => {
    // 16 * 1.25^0 = 16
    const result = calculateTypeScale(16, 1.25, 0);
    expect(result.px).toBe(16);
    expect(result.rem).toBe('1.000');
  });

  it('calculates the rounded pixel and rem values when scaling up', () => {
    // 16 * 1.25^2 = 16 * 1.5625 = 25
    const result = calculateTypeScale(16, 1.25, 2);
    expect(result.px).toBe(25);
    expect(result.rem).toBe('1.563'); // 25/16
  });

  it('calculates the rounded pixel and rem values when scaling down', () => {
    // 16 * 1.25^-1 = 16 / 1.25 = 12.8 -> round to 13
    const result = calculateTypeScale(16, 1.25, -1);
    expect(result.px).toBe(13); // Math.round(12.8) is 13
    expect(result.rem).toBe('0.800'); // 12.8 / 16 is exactly 0.8
  });

  it('calculates a scale from custom base size and ratio inputs', () => {
    // 14 * 1.2^1 = 16.8 -> 17
    const result = calculateTypeScale(14, 1.2, 1);
    expect(result.px).toBe(17);
  });
});
