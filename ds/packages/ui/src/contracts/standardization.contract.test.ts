import { describe, expect, it } from 'vitest';
import { BREAKPOINTS, getMediaQuery } from '../../../tokens/src/foundations/breakpoints';
import { CONTROL_GEOMETRY, ICON_BUTTON_GEOMETRY } from '../components/atoms/inputs/controls.geometry.contract';
import { CONTROL_STATE_CONTRACTS } from '../components/atoms/inputs/controls.states.contract';
import { EMPTY_STATE_GEOMETRY, getEmptyStateType } from '../components/atoms/feedback/states.geometry.contract';
import { TABLE_DENSITY_PRESETS, TABLE_RESPONSIVE_CONTRACT } from '../components/composites/content/ResponsiveTable/density.contract';
import { PLATFORM_RESPONSIVE_CONTRACTS } from '../helpers/responsive.contract';
import { FORBIDDEN_SURFACE_COMBINATIONS, SURFACE_VARIANT_SEMANTICS } from '../components/atoms/surfaces/TechnicalSurface/variants.contract';

describe('SaaS standardization contracts', () => {
  it('keeps CSS and JavaScript breakpoints aligned at the tablet boundary', () => {
    expect(BREAKPOINTS.lg).toBe(1024);
    expect(getMediaQuery('lg')).toBe('(min-width: 1024px)');
    expect(getMediaQuery('lg', 'max')).toBe('(max-width: 1023px)');
  });

  it('defines monotonic table density geometry and zone-owned mobile overflow', () => {
    expect(TABLE_DENSITY_PRESETS.comfortable.rowHeight).toBeGreaterThan(TABLE_DENSITY_PRESETS.dense.rowHeight);
    expect(TABLE_DENSITY_PRESETS.dense.rowHeight).toBeGreaterThan(TABLE_DENSITY_PRESETS.compact.rowHeight);
    expect(TABLE_RESPONSIVE_CONTRACT).toMatchObject({ breakpoint: 1024, horizontalOverflow: 'table-zone-only' });
  });

  it('keeps control and icon-button targets stable across sizes', () => {
    expect(CONTROL_GEOMETRY.md.minHeight).toBe(44);
    expect(ICON_BUTTON_GEOMETRY.md.size).toBe(44);
    expect(CONTROL_GEOMETRY.lg.minHeight).toBeGreaterThan(CONTROL_GEOMETRY.md.minHeight);
    expect(CONTROL_STATE_CONTRACTS.disabled.blocksInteraction).toBe(true);
    expect(CONTROL_STATE_CONTRACTS.loading.requiredAria['aria-busy']).toBe(true);
  });

  it('limits surface variants to governed semantic contexts', () => {
    expect(SURFACE_VARIANT_SEMANTICS.surface.contexts).toContain('data');
    expect(SURFACE_VARIANT_SEMANTICS.canvas.forbidden).toContain('nested-canvas');
    expect(FORBIDDEN_SURFACE_COMBINATIONS).toContainEqual({ variant: 'canvas', depth: 'overlay' });
  });

  it('defines increasing state geometry and distinguishes empty-state causes', () => {
    expect(EMPTY_STATE_GEOMETRY.sm.minHeight).toBeLessThan(EMPTY_STATE_GEOMETRY.md.minHeight);
    expect(EMPTY_STATE_GEOMETRY.md.minHeight).toBeLessThan(EMPTY_STATE_GEOMETRY.lg.minHeight);
    expect(getEmptyStateType(false, false, false)).toBe('empty');
    expect(getEmptyStateType(false, true, false)).toBe('filtered-empty');
    expect(getEmptyStateType(false, false, true)).toBe('search-empty');
  });

  it('assigns every platform transformation to the shared tablet breakpoint', () => {
    expect(PLATFORM_RESPONSIVE_CONTRACTS).toHaveLength(5);
    expect(PLATFORM_RESPONSIVE_CONTRACTS.every((contract) => contract.breakpoint === 'lg')).toBe(true);
  });
});