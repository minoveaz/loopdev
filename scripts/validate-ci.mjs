import { spawnSync } from 'node:child_process';

const isWindows = process.platform === 'win32';
const pnpmCommand = isWindows ? 'pnpm.cmd' : 'pnpm';
const steps = [
  ['Documentation links', ['docs:links:check']],
  ['Registry catalog synchronization', ['registries:check']],
  ['Lint', ['lint']],
  ['Frontend quality gate', ['front:check']],
  ['Build shared contracts', ['--filter', '@loopdev/contracts', 'build']],
  ['Typecheck', ['typecheck']],
  ['Unit and component tests', ['test:coverage']],
  ['Production build', ['build']],
];

for (const [label, args] of steps) {
  console.log(`\n==> ${label}: pnpm ${args.join(' ')}`);
  const result = spawnSync(pnpmCommand, args, {
    stdio: 'inherit',
    shell: isWindows,
  });

  if (result.error) {
    console.error(`Unable to start ${pnpmCommand}: ${result.error.message}`);
    process.exit(1);
  }

  if (result.status !== 0) {
    console.error(`\nValidation stopped at: ${label}`);
    process.exit(result.status ?? 1);
  }
}

console.log('\nCI validation completed successfully.');
