import { describe, expect, it } from 'vitest';
import {
  PlatformEnvironmentModeSchema,
  PlatformNetworkPolicySchema,
  PlatformPersistencePolicySchema,
} from '../runtime';

describe('Platform runtime contracts', () => {
  it('supports the three explicit environment modes', () => {
    expect(PlatformEnvironmentModeSchema.options).toEqual(['real', 'sandbox', 'preview']);
  });

  it('keeps network and persistence policies explicit', () => {
    expect(PlatformNetworkPolicySchema.parse({ reads: 'local', writes: 'blocked' })).toEqual({
      reads: 'local',
      writes: 'blocked',
    });
    expect(PlatformPersistencePolicySchema.safeParse('server').success).toBe(false);
  });
});
