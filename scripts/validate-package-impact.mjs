#!/usr/bin/env node

import { execFileSync, spawnSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { routingForFile } from './validation-domain-catalog-utils.mjs';

const isWindows = process.platform === 'win32';
const pnpmCommand = isWindows ? 'pnpm.cmd' : 'pnpm';
const zeroSha = /^0+$/;

const packageRules = [
  {
    id: 'contracts',
    path: 'packages/contracts/',
    packageName: '@loopdev/contracts',
    scripts: ['lint', 'typecheck', 'build'],
    globalFallback: true,
    consumers: [
      ['@loopdev/ui', 'build'],
      ['loopdev-os', 'build'],
      ['loopdev-mobile', 'typecheck'],
      ['loopdev-mobile', 'test'],
    ],
  },
  {
    id: 'ui',
    path: 'ds/packages/ui/',
    packageName: '@loopdev/ui',
    scripts: ['lint', 'typecheck', 'build', 'test'],
    testArgs: ['--', '--maxWorkers=1'],
    consumers: [['loopdev-os', 'build']],
  },
  {
    id: 'ui-native',
    path: 'ds/packages/ui-native/',
    packageName: '@loopdev/ui-native',
    scripts: ['lint', 'typecheck'],
    consumers: [
      ['loopdev-mobile', 'lint'],
      ['loopdev-mobile', 'typecheck'],
      ['loopdev-mobile', 'test'],
    ],
  },
  {
    id: 'design-contracts',
    path: 'ds/packages/design-contracts/',
    packageName: '@loopdev/design-contracts',
    scripts: ['lint', 'typecheck'],
    consumers: [
      ['@loopdev/ui-native', 'typecheck'],
      ['loopdev-mobile', 'lint'],
      ['loopdev-mobile', 'typecheck'],
      ['loopdev-mobile', 'test'],
    ],
  },
  {
    id: 'tokens',
    path: 'ds/packages/tokens/',
    packageName: '@loopdev/tokens',
    scripts: ['lint', 'typecheck'],
    consumers: [
      ['@loopdev/ui', 'build'],
      ['@loopdev/ui-native', 'typecheck'],
      ['loopdev-os', 'build'],
      ['loopdev-mobile', 'lint'],
      ['loopdev-mobile', 'typecheck'],
      ['loopdev-mobile', 'test'],
    ],
  },
  {
    id: 'tailwind-config',
    path: 'ds/packages/tailwind-config/',
    packageName: '@loopdev/tailwind-config',
    scripts: ['lint', 'typecheck'],
    consumers: [
      ['@loopdev/ui', 'build'],
      ['loopdev-os', 'build'],
    ],
  },
  {
    id: 'eslint-config',
    path: 'ds/packages/eslint-config/',
    packageName: '@loopdev/eslint-config',
    scripts: ['lint', 'typecheck'],
    globalFallback: true,
  },
  {
    id: 'tsconfig',
    path: 'ds/packages/tsconfig/',
    packageName: '@loopdev/tsconfig',
    scripts: ['lint', 'typecheck'],
    globalFallback: true,
  },
  {
    id: 'public-shell',
    path: 'ds/packages/public-shell/',
    packageName: '@loopdev/public-shell',
    scripts: ['lint', 'typecheck', 'test', 'build'],
    consumers: [
      ['@loopdev/contracts', 'build'],
      ['@loopdev/ui', 'build'],
      ['cimo', 'build'],
      ['loopdev-os', 'build'],
    ],
  },
  {
    id: 'public-blocks',
    path: 'ds/packages/public-blocks/',
    packageName: '@loopdev/public-blocks',
    scripts: ['lint', 'typecheck', 'test', 'build'],
    consumers: [
      ['@loopdev/contracts', 'build'],
      ['@loopdev/public-shell', 'build'],
      ['cimo', 'build'],
    ],
  },
];

const globalPrefixes = [
  '.github/',
  'apps/',
  'config/',
  'ds/apps/',
  'labdev/',
  'modules/',
  'scripts/',
];

const globalRootFiles = new Set([
  'eslint.config.js',
  'eslint.config.mjs',
  'package.json',
  'playwright.config.mjs',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  'postcss.config.js',
  'tailwind.config.js',
  'tsconfig.json',
  'turbo.json',
  'vitest.config.ts',
]);

function getOption(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function getOptionValues(name) {
  const values = [];
  for (let index = 0; index < process.argv.length - 1; index += 1) {
    if (process.argv[index] === name) values.push(process.argv[index + 1]);
  }
  return values;
}

function runGit(args) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim();
}

function resolveBase(base) {
  if (base && !zeroSha.test(base)) return base;
  return runGit(['rev-parse', 'HEAD^']);
}

function getChangedFiles(base, head) {
  return runGit(['diff', '--name-only', `${base}...${head}`])
    .split(/\r?\n/)
    .map((file) => file.replaceAll('\\', '/'))
    .filter(Boolean);
}

function findPackageRule(file) {
  return packageRules.find((rule) => file.startsWith(rule.path));
}

function isDocumentation(file) {
  return (
    file.startsWith('docs/') ||
    file.startsWith('tracks/') ||
    file.startsWith('conductor/') ||
    /\.(md|mdx|txt)$/i.test(file)
  );
}

function isPackageManifest(file) {
  return file.endsWith('/package.json') || file === 'package.json';
}

function isBackendOnlyWebFile(file) {
  return (
    file.startsWith('apps/loopdev-os/src/app/api/') ||
    file.startsWith('apps/loopdev-os/src/services/') ||
    file.startsWith('apps/loopdev-os/src/types/')
  );
}

function resolveImpact(files) {
  const rules = new Map();
  const domainIds = new Set();
  let globalFallback = false;
  let mobile = false;
  let frontend = false;

  for (const file of files) {
    if (file.startsWith('supabase/')) continue;

    const catalogRouting = routingForFile(file);
    if (catalogRouting) {
      if (catalogRouting.routing.mobile) mobile = true;
      if (catalogRouting.routing.frontend) frontend = true;
      if (catalogRouting.routing.packageImpact) domainIds.add(catalogRouting.domain.id);
      if (catalogRouting.routing.packageRule) {
        const rule = packageRules.find(
          (candidate) => candidate.id === catalogRouting.routing.packageRule,
        );
        if (!rule) {
          throw new Error(
            `Missing package rule '${catalogRouting.routing.packageRule}' for domain '${catalogRouting.domain.id}'`,
          );
        }
        rules.set(rule.id, rule);
      }
      continue;
    }

    if (file.startsWith('e2e/')) {
      frontend = true;
      continue;
    }

    if (isDocumentation(file)) continue;

    const rule = findPackageRule(file);
    if (rule) {
      rules.set(rule.id, rule);
      if (rule.globalFallback || isPackageManifest(file)) globalFallback = true;
      continue;
    }

    if (isDocumentation(file)) continue;
    if (globalPrefixes.some((prefix) => file.startsWith(prefix)) || globalRootFiles.has(file)) {
      globalFallback = true;
      continue;
    }

    if (file.startsWith('packages/') || file.startsWith('ds/packages/')) {
      globalFallback = true;
      continue;
    }

    globalFallback = true;
  }

  return {
    changedFiles: files,
    domainIds: [...domainIds],
    packageIds: [...rules.keys()],
    packageRules: packageRules.filter((rule) => rules.has(rule.id)),
    globalFallback,
    hasTargetedValidation: rules.size > 0 || domainIds.size > 0,
    mobile,
    frontend,
  };
}

function addCommand(commands, packageName, script, extraArgs = []) {
  const args = ['--filter', packageName, script, ...extraArgs];
  const key = args.join('\u0000');
  if (!commands.has(key)) commands.set(key, args);
}

function buildCommands(packageRules, skippedConsumers = new Set(), domainIds = []) {
  const commands = new Map();

  for (const rule of packageRules) {
    for (const script of rule.scripts) {
      const extraArgs = script === 'test' ? (rule.testArgs ?? []) : [];
      addCommand(commands, rule.packageName, script, extraArgs);
    }

    for (const [consumer, script] of rule.consumers ?? []) {
      if (skippedConsumers.has(consumer)) continue;
      addCommand(commands, consumer, script);
    }
  }

  for (const id of domainIds) {
    addCommand(commands, 'loopdev-monorepo', 'validate:domain-controls', [id, '--include-build']);
  }

  return [...commands.values()];
}

function writeGithubOutput(impact) {
  if (!process.env.GITHUB_OUTPUT) return;

  appendFileSync(
    process.env.GITHUB_OUTPUT,
    [
      `global_fallback=${impact.globalFallback}`,
      `has_targeted_validation=${impact.hasTargetedValidation}`,
      `mobile=${impact.mobile}`,
      `frontend=${impact.frontend}`,
      `package_ids=${impact.packageIds.join(',')}`,
      `domain_ids=${impact.domainIds.join(',')}`,
    ].join('\n') + '\n',
  );
}

function formatCommand(args) {
  return `${pnpmCommand} ${args.join(' ')}`;
}

function main() {
  const base = resolveBase(getOption('--base') || process.env.BASE_SHA);
  const head = getOption('--head') || process.env.HEAD_SHA || 'HEAD';
  const skippedConsumers = new Set(getOptionValues('--skip-consumer'));
  const files = getChangedFiles(base, head);
  const impact = resolveImpact(files);
  const commands = buildCommands(impact.packageRules, skippedConsumers, impact.domainIds);

  writeGithubOutput(impact);

  console.log(`Package impact base: ${base}`);
  console.log(`Package impact head: ${head}`);
  console.log(`Changed files: ${files.length}`);
  console.log(`Targeted packages: ${impact.packageIds.join(', ') || 'none'}`);
  console.log(`Targeted domains: ${impact.domainIds.join(', ') || 'none'}`);
  console.log(`Global fallback: ${impact.globalFallback}`);
  console.log(`Mobile validation: ${impact.mobile}`);
  console.log(`Skipped consumers: ${[...skippedConsumers].join(', ') || 'none'}`);

  if (commands.length === 0) {
    console.log('No package-specific validation required.');
    return;
  }

  const dryRun = process.argv.includes('--dry-run');
  for (const args of commands) {
    console.log(`\n==> ${formatCommand(args)}`);
    if (dryRun) continue;

    const result = spawnSync(pnpmCommand, args, {
      stdio: 'inherit',
      shell: isWindows,
    });

    if (result.error) {
      console.error(`Unable to start ${pnpmCommand}: ${result.error.message}`);
      process.exit(1);
    }

    if (result.status !== 0) {
      console.error(`\nValidation stopped at: ${formatCommand(args)}`);
      process.exit(result.status ?? 1);
    }
  }
}

export { buildCommands, isBackendOnlyWebFile, resolveImpact };

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
