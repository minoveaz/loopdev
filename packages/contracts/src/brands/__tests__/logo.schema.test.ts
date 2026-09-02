import { describe, it, expect } from 'vitest';
import { LogoSystemSchema, LogoAssetSchema } from '../logo.schema';

describe('Logo Schema Contracts', () => {
  describe('LogoAssetSchema', () => {
    it('accepts a logo asset referenced by URL', () => {
      const validAsset = {
        url: 'https://storage.loopdev.com/logos/isotype.svg',
        format: 'svg',
        alt: 'Test Logo',
      };
      const result = LogoAssetSchema.safeParse(validAsset);
      expect(result.success).toBe(true);
    });

    it('accepts a logo asset containing raw SVG markup', () => {
      const validAsset = {
        rawSvg: '<svg>...</svg>',
        format: 'svg',
      };
      const result = LogoAssetSchema.safeParse(validAsset);
      expect(result.success).toBe(true);
    });

    it('rejects logo assets with malformed URLs', () => {
      const invalidAsset = {
        url: 'not-a-url',
      };
      const result = LogoAssetSchema.safeParse(invalidAsset);
      expect(result.success).toBe(false);
    });
  });

  describe('LogoSystemSchema', () => {
    it('accepts a logo system with primary, monochrome, and specification data', () => {
      const validSystem = {
        primary: {
          isotype: { rawSvg: '<svg/>', format: 'svg' },
          horizontal: { url: 'https://api.com/h.svg' },
        },
        monochrome: {
          positive: { isotype: { rawSvg: '<svg/>' } },
        },
        specs: {
          aspectRatio: '1:1',
          minSize: 32,
        },
      };

      const result = LogoSystemSchema.safeParse(validSystem);
      expect(result.success).toBe(true);
    });

    it('rejects logo systems whose primary lockup omits the isotype', () => {
      const invalidSystem = {
        primary: {
          horizontal: { url: 'https://api.com/h.svg' },
          // Missing isotype
        },
      };
      const result = LogoSystemSchema.safeParse(invalidSystem);
      expect(result.success).toBe(false);
    });

    it('applies default aspect ratio and grid values to minimal logo systems', () => {
      const minimalSystem = {
        primary: { isotype: { rawSvg: '<svg/>' } },
      };

      const result = LogoSystemSchema.parse(minimalSystem);
      expect(result.specs?.aspectRatio).toBe('Variable');
      expect(result.specs?.gridType).toBe('Pixel Perfect');
    });
  });
});
