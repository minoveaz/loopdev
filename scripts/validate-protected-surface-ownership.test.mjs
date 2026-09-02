import assert from 'node:assert/strict';
import test from 'node:test';
import { validateProtectedSurfaceOwnership } from './validate-protected-surface-ownership.mjs';

const catalog = {
  protectedSurfaces: [
    {
      id: 'platform-shell',
      owner: 'platform',
      paths: ['ds/packages/ui/src/components/composites/shell/'],
    },
    { id: 'public-shell', owner: 'platform', paths: ['ds/packages/public-shell/'] },
  ],
};

const platformTrack = {
  id: 'public-shell-foundation',
  status: 'active',
  owner: 'platform',
  branch: 'feature/public-shell-foundation',
  branches: ['feature/public-shell-foundation'],
};

test('allows protected surface changes for an active platform track', () => {
  const errors = validateProtectedSurfaceOwnership(
    ['ds/packages/public-shell/src/PublicRuntime.tsx'],
    catalog,
    'feature/public-shell-foundation',
    [platformTrack],
  );

  assert.deepEqual(errors, []);
});

test('allows a domain branch to evolve Public Shell during its active standardization track', () => {
  const errors = validateProtectedSurfaceOwnership(
    ['apps/cimo/src/App.tsx', 'ds/packages/public-shell/src/PublicRuntime.tsx'],
    {
      protectedSurfaces: [
        {
          ...catalog.protectedSurfaces[1],
          allowedDuringActiveTracks: ['public-shell-foundation'],
        },
      ],
    },
    'feature/cimo-feed',
    [platformTrack],
  );

  assert.deepEqual(errors, []);
});

test('rejects a domain branch that changes Public Shell after its standardization track closes', () => {
  const errors = validateProtectedSurfaceOwnership(
    ['ds/packages/public-shell/src/PublicRuntime.tsx'],
    {
      protectedSurfaces: [
        {
          ...catalog.protectedSurfaces[1],
          allowedDuringActiveTracks: ['public-shell-foundation'],
        },
      ],
    },
    'feature/cimo-feed',
    [{ ...platformTrack, status: 'closed' }],
  );

  assert.equal(errors.length, 1);
  assert.match(errors[0], /public-shell/);
});

test('allows domain changes that do not touch a protected surface', () => {
  const errors = validateProtectedSurfaceOwnership(
    ['apps/cimo/src/App.tsx'],
    catalog,
    'feature/cimo-feed',
    [],
  );

  assert.deepEqual(errors, []);
});
