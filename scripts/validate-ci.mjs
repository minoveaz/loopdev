import { spawn } from 'node:child_process';

const isWindows = process.platform === 'win32';
const pnpmCommand = isWindows ? 'pnpm.cmd' : 'pnpm';
const validationPhases = [
  {
    id: 'static',
    label: 'Static and repository checks',
    steps: [
      ['Documentation links', ['docs:links:check']],
      ['Registry catalog synchronization', ['registries:check']],
      ['Lint', ['lint']],
      ['Frontend quality gate', ['front:check']],
    ],
  },
  {
    id: 'contracts',
    label: 'Shared contract build',
    steps: [['Build shared contracts', ['turbo', 'run', 'build', '--filter=@loopdev/contracts']]],
  },
  {
    id: 'certification',
    label: 'Compilation, tests and production build',
    steps: [
      ['Typecheck', ['typecheck']],
      ['Unit and component tests', ['test:coverage']],
      ['Production build', ['build']],
    ],
  },
];

function runStep([label, args]) {
  console.log(`\n==> ${label}: pnpm ${args.join(' ')}`);
  return new Promise((resolve, reject) => {
    const env = {
      ...process.env,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy-anon-key-for-build-prerender',
    };

    const child = spawn(pnpmCommand, args, {
      stdio: 'inherit',
      shell: isWindows,
      env,
    });

    child.once('error', (error) => {
      reject(new Error(`Unable to start ${pnpmCommand} for ${label}: ${error.message}`));
    });
    child.once('close', (status, signal) => {
      if (status === 0) {
        resolve();
        return;
      }

      const reason = signal ? ` (terminated by ${signal})` : '';
      reject(
        new Error(`Validation failed at ${label} with status ${status ?? 'unknown'}${reason}`),
      );
    });
  });
}

async function runPhase(phase, executeStep = runStep) {
  console.log(`\n## ${phase.label}`);
  const results = await Promise.allSettled(phase.steps.map(executeStep));
  const failures = results
    .filter((result) => result.status === 'rejected')
    .map((result) => result.reason);

  if (failures.length > 0) {
    for (const failure of failures) console.error(`\n${failure.message}`);
    return false;
  }

  return true;
}

async function main() {
  for (const phase of validationPhases) {
    if (!(await runPhase(phase))) {
      process.exitCode = 1;
      return;
    }
  }

  console.log('\nCI validation completed successfully.');
}

export { runPhase, runStep, validationPhases };

if (process.argv[1]?.endsWith('validate-ci.mjs')) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
