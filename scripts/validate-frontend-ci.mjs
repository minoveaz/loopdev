import { spawnSync } from 'node:child_process';

const isWindows = process.platform === 'win32';
const pnpmCommand = isWindows ? 'pnpm.cmd' : 'pnpm';
const steps = [
  ['UI lint', ['--filter', '@loopdev/ui', 'lint']],
  ['Web application lint', ['--filter', 'loopdev-os', 'lint']],
  ['Frontend quality gate', ['front:check']],
  ['Build shared contracts', ['--filter', '@loopdev/contracts', 'build']],
  ['UI typecheck', ['--filter', '@loopdev/ui', 'typecheck']],
  ['Web application typecheck', ['exec', 'tsc', '-p', 'apps/loopdev-os/tsconfig.json', '--noEmit']],
  ['Frontend unit and component tests', ['test']],
  ['Build shared UI', ['--filter', '@loopdev/ui', 'build']],
  ['Build web application', ['--filter', 'loopdev-os', 'build']],
];

for (const [label, args] of steps) {
  console.log(`\n==> ${label}: pnpm ${args.join(' ')}`);
  const result = spawnSync(pnpmCommand, args, { stdio: 'inherit', shell: isWindows });
  if (result.error) {
    console.error(`Unable to start ${pnpmCommand}: ${result.error.message}`);
    process.exit(1);
  }
  if (result.status !== 0) {
    console.error(`\nFrontend validation stopped at: ${label}`);
    process.exit(result.status ?? 1);
  }
}

console.log('\nFrontend CI validation completed successfully.');