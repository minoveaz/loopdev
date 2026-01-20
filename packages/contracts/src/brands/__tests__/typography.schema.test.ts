import { describe, it, expect } from 'vitest';
import { TypographySystemSchema, FontDefinitionSchema } from '../typography.schema';

describe('Typography Schema Contracts', () => {
  
  describe('FontDefinitionSchema', () => {
    it('should validate a valid google font definition', () => {
      const validFont = {
        family: 'Inter',
        type: 'sans',
        source: 'google',
        sourceUrl: 'https://fonts.google.com',
        variants: [{ weight: 400, style: 'normal' }]
      };
      
      const result = FontDefinitionSchema.safeParse(validFont);
      expect(result.success).toBe(true);
    });

    it('should reject invalid weights (out of 100-900 range)', () => {
      const invalidFont = {
        family: 'BadFont',
        type: 'sans',
        source: 'system',
        variants: [{ weight: 2000, style: 'normal' }] // Invalid weight
      };
      
      const result = FontDefinitionSchema.safeParse(invalidFont);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Number must be less than or equal to 900');
      }
    });

    it('should enforce required fields', () => {
      const incompleteFont = {
        family: 'Inter',
        // Missing type and source
      };
      const result = FontDefinitionSchema.safeParse(incompleteFont);
      expect(result.success).toBe(false);
    });
  });

  describe('TypographySystemSchema', () => {
    it('should validate a complete system configuration', () => {
      const validSystem = {
        primary: {
          family: 'Inter',
          type: 'sans',
          source: 'google',
          variants: []
        },
        baseSize: 16,
        scaleRatio: 1.25,
        lineHeightBase: 1.5
      };

      const result = TypographySystemSchema.safeParse(validSystem);
      expect(result.success).toBe(true);
    });

    it('should reject baseSize smaller than accessibility floor (12px)', () => {
      const unsafeSystem = {
        primary: { family: 'Inter', type: 'sans', source: 'system', variants: [] },
        baseSize: 10, // Too small
      };

      const result = TypographySystemSchema.safeParse(unsafeSystem);
      expect(result.success).toBe(false);
    });

    it('should provide default values for optional fields', () => {
      const minimalSystem = {
        primary: { family: 'Inter', type: 'sans', source: 'system', variants: [] }
      };

      const result = TypographySystemSchema.parse(minimalSystem);
      expect(result.baseSize).toBe(16); // Default
      expect(result.scaleRatio).toBe(1.25); // Default
      expect(result.aiOptimized).toBe(true); // Default
    });
  });

});
