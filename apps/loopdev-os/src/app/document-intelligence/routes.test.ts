import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const routeRoot = path.resolve(process.cwd(), 'apps/loopdev-os/src/app/document-intelligence');

describe('Document Intelligence public routes', () => {
  it.each([
    ['home', path.join(routeRoot, 'page.tsx')],
    ['new extraction', path.join(routeRoot, 'new/page.tsx')],
    ['document review', path.join(routeRoot, '[documentId]/page.tsx')],
  ])('keeps the %s route entrypoint', (_name, routePath) => {
    expect(existsSync(routePath)).toBe(true);
  });
});
