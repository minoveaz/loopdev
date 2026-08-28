import { spawnSync } from 'node:child_process';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const root = process.cwd();
const pnpmCommand = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const changedOnly = process.argv.includes('--changed-only');

const shellPaths = [
  'apps/loopdev-os/src/app/globals.css',
  'apps/loopdev-os/src/app/layout.tsx',
  'apps/loopdev-os/src/app/shell-showcase/',
  'e2e/shell-showcase.contract.spec.mjs',
  'e2e/shell.visual.spec.mjs',
  'apps/loopdev-os/src/components/layout/suiteNavMode.ts',
  'ds/packages/ui/src/components/atoms/navigation/NavSidebarItem/',
  'ds/packages/ui/src/components/atoms/surfaces/TechnicalDropdown/',
  'ds/packages/ui/src/components/atoms/surfaces/TechnicalSurface/',
  'ds/packages/ui/src/components/atoms/surfaces/TechnicalTooltip/',
  'ds/packages/ui/src/components/composites/shell/',
  'ds/packages/ui/src/components/composites/utilities/PlatformContextPanel/',
  'ds/packages/ui/src/styles/globals.css',
  'packages/contracts/src/platform/navigation.ts',
  'scripts/check-shell.mjs',
  'vitest.config.ts',
  'package.json',
];

const shellTests = [
  'ds/packages/ui/src/components/composites/shell/SuiteSidebar/SuiteSidebar.test.tsx',
  'ds/packages/ui/src/components/composites/shell/PlatformHeader/PlatformHeader.test.tsx',
  'ds/packages/ui/src/components/composites/utilities/PlatformContextPanel/PlatformContextPanel.test.tsx',
  'ds/packages/ui/src/components/composites/shell/SidebarFooter/SidebarFooter.test.tsx',
  'ds/packages/ui/src/components/atoms/surfaces/TechnicalTooltip/TechnicalTooltip.test.tsx',
];

function readChangedFiles() {
  const files = new Set();

  const status = execFileSync('git', ['status', '--porcelain=v1', '-z'], { cwd: root });
  const entries = status.toString().split('\0').filter(Boolean);

  for (const entry of entries) {
    const file = entry.slice(3);
    files.add(file.replaceAll('\\', '/'));
  }

  return [...files];
}

function affectsShell(file) {
  return shellPaths.some((shellPath) => file === shellPath || file.startsWith(shellPath));
}

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  if (result.error) {
    console.error(`Unable to start ${command}: ${result.error.message}`);
    process.exit(1);
  }
  if (result.status !== 0) process.exit(result.status ?? 1);
}

const changedFiles = readChangedFiles();
const shellChangedFiles = changedFiles.filter(affectsShell);

if (changedOnly && shellChangedFiles.length === 0) {
  console.log('Shell Interaction Surface unchanged; skipping shell validation.');
  process.exit(0);
}

if (changedOnly) {
  console.log('Shell Interaction Surface changed:');
  shellChangedFiles.forEach((file) => console.log(`- ${file}`));
}

run(pnpmCommand, [
  'exec',
  'vitest',
  'run',
  '--config',
  'vitest.config.ts',
  ...shellTests.map((file) => path.relative(root, path.resolve(root, file))),
]);
run(pnpmCommand, ['--filter', '@loopdev/ui', 'typecheck']);
