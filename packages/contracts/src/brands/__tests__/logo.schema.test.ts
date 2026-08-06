import { describe, it, expect } from 'vitest';
import { LogoSystemSchema, LogoAssetSchema } from '../logo.schema';

describe('Logo Schema Contracts', () => {
  
  describe('LogoAssetSchema', () => {
    it('should validate a valid asset with URL', () => {
      const validAsset = {
        url: 'https://storage.loopdev.com/logos/isotype.svg',
        format: 'svg',
        alt: 'Test Logo'
      };
      const result = LogoAssetSchema.safeParse(validAsset);
      expect(result.success).toBe(true);
    });

    it('should validate a valid asset with raw SVG', () => {
      const validAsset = {
        rawSvg: '<svg>...</svg>',
        format: 'svg'
      };
      const result = LogoAssetSchema.safeParse(validAsset);
      expect(result.success).toBe(true);
    });

    it('should reject invalid URL formats', () => {
      const invalidAsset = {
        url: 'not-a-url'
      };
      const result = LogoAssetSchema.safeParse(invalidAsset);
      expect(result.success).toBe(false);
    });
  });

  describe('LogoSystemSchema', () => {
    it('should validate a complete system configuration', () => {
      const validSystem = {
        primary: {
          isotype: { rawSvg: '<svg/>', format: 'svg' },
          horizontal: { url: 'https://api.com/h.svg' }
        },
        monochrome: {
          positive: { isotype: { rawSvg: '<svg/>' } }
        },
        specs: {
          aspectRatio: '1:1',
          minSize: 32
        }
      };

      const result = LogoSystemSchema.safeParse(validSystem);
      expect(result.success).toBe(true);
    });

    it('should enforce the isotype as a mandatory lockup element', () => {
      const invalidSystem = {
        primary: {
          horizontal: { url: 'https://api.com/h.svg' }
          // Missing isotype
        }
      };
      const result = LogoSystemSchema.safeParse(invalidSystem);
      expect(result.success).toBe(false);
    });

    it('should provide default values for specs', () => {
      const minimalSystem = {
        primary: { isotype: { rawSvg: '<svg/>' } }
      };

      const result = LogoSystemSchema.parse(minimalSystem);
      expect(result.specs?.aspectRatio).toBe('Variable');
      expect(result.specs?.gridType).toBe('Pixel Perfect');
    });
  });

});
