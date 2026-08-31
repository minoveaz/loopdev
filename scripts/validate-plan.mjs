#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';
import process from 'node:process';
import { isBackendOnlyWebFile, resolveImpact } from './validate-package-impact.mjs';
import { domainForFile } from './validation-domain-catalog-utils.mjs';

const checks = {
  governance: {
    label: 'Track governance',
    risk: 'The change remains traceable and follows repository delivery rules.',
    paths: ['tracks/', 'scripts/tracks/', '.github/skills/track-governance/'],
  },
  data: {
    label: 'Database safety',
    risk: 'Migrations, schema, and tenant security remain valid.',
    paths: ['supabase/'],
  },
  mobile: {
    label: 'Mobile application',
    risk: 'The native mobile application keeps its contracts and user flows.',
    paths: ['apps/loopdev-mobile/'],
  },
  shell: {
    label: 'Shell experience',
    risk: 'Navigation, layout behavior, accessibility, and responsive shell geometry remain valid.',
    paths: [
      'apps/loopdev-os/src/app/shell-showcase/',
      'apps/loopdev-os/src/app/launchpad/',
      'ds/packages/ui/src/components/composites/shell/',
      'ds/packages/ui/src/components/composites/utilities/PlatformContextPanel/',
      'scripts/check-shell.mjs',
    ],
  },
  web: {
    label: 'Web application experience',
    risk: 'Affected web routes and browser behavior remain usable and accessible.',
    paths: ['apps/loopdev-os/', 'e2e/', 'playwright.config.mjs'],
  },
};

const fullFallbackFiles = [
  '.github/workflows/',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  'package.json',
  'turbo.json',
  'vitest.config.ts',
  'tsconfig.json',
];

function matchesPath(file, path) {
  return file === path || file.startsWith(path);
}

function isDocumentationOnly(file) {
  return file.startsWith('docs/') || file.startsWith('conductor/') || /\.(md|mdx|txt)$/i.test(file);
}

function buildExperiencePlan(files) {
  const hasWebApplicationChange = files.some(
    (file) =>
      (file.startsWith('apps/loopdev-os/') &&
        !file.startsWith('apps/loopdev-os/src/app/api/') &&
        !file.startsWith('apps/loopdev-os/src/services/') &&
        !file.startsWith('apps/loopdev-os/src/types/')) ||
      file.startsWith('ds/packages/ui/'),
  );
  const desktop =
    hasWebApplicationChange ||
    files.some((file) =>
      [
        'e2e/authenticated.application.spec.mjs',
        'e2e/phase5.certification.spec.mjs',
        'e2e/shell.accessibility.spec.mjs',
        'e2e/shell.smoke.spec.mjs',
        'e2e/shell.visual.spec.mjs',
      ].includes(file),
    );
  const mobile =
    hasWebApplicationChange ||
    files.some((file) =>
      [
        'e2e/authenticated.mobile.spec.mjs',
        'e2e/responsive.visual.spec.mjs',
        'e2e/shell.mobile-diagnostic.spec.mjs',
      ].includes(file),
    );
  const visual =
    files.some((file) => file.endsWith('.visual.spec.mjs')) ||
    files.some((file) => file.startsWith('ds/packages/ui/'));

  return { desktop, mobile, visual };
}

function buildValidationPlan(files) {
  const changedFiles = files.map((file) => file.replaceAll('\\', '/')).filter(Boolean);
  const changedDomains = new Set();
  const reasons = [];
  let fullFallback = false;

  for (const file of changedFiles) {
    if (isDocumentationOnly(file)) {
      if (file.startsWith('tracks/') || file.startsWith('scripts/tracks/')) {
        changedDomains.add('governance');
      }
      continue;
    }

    const domain = domainForFile(file);
    if (domain?.routing?.planDomain) changedDomains.add(domain.routing.planDomain);

    for (const [domain, check] of Object.entries(checks)) {
      if (
        check.paths.some((path) => matchesPath(file, path)) &&
        !(domain === 'web' && isBackendOnlyWebFile(file))
      ) {
        changedDomains.add(domain);
      }
    }

    if (fullFallbackFiles.some((path) => matchesPath(file, path))) {
      fullFallback = true;
      reasons.push(`${file} is shared repository or workflow configuration`);
    }
  }

  const packageImpact = resolveImpact(changedFiles);
  if (packageImpact.globalFallback) {
    fullFallback = true;
    reasons.push('package impact resolver selected the global fallback');
  }
  if (packageImpact.hasTargetedValidation) changedDomains.add('packages');

  if (changedDomains.size === 0 && changedFiles.length > 0 && !fullFallback) {
    reasons.push('no registered executable surface was affected');
  }

  const selected = [...changedDomains].map((domain) => ({
    id: domain,
    label: checks[domain]?.label ?? 'Shared packages',
    risk:
      checks[domain]?.risk ??
      'Affected shared packages and their declared consumers remain compatible.',
  }));

  return {
    changedFiles,
    experiences: buildExperiencePlan(changedFiles),
    selected,
    fullFallback,
    fallbackReason: fullFallback ? reasons.join('; ') : null,
    note: fullFallback ? null : reasons.join('; ') || null,
    skipped: Object.entries(checks)
      .filter(([domain]) => !changedDomains.has(domain))
      .map(([domain, check]) => ({ id: domain, label: check.label, reason: 'not affected' })),
  };
}

function changedFilesFromGit(runGit = execFileSync) {
  const base = process.env.BASE_SHA ?? 'origin/develop';
  const head = process.env.HEAD_SHA ?? 'HEAD';
  return runGit('git', ['diff', '--name-only', `${base}...${head}`], { encoding: 'utf8' })
    .split(/\r?\n/)
    .filter(Boolean);
}

function changedFilesFromCommit(revision = 'HEAD', runGit = execFileSync) {
  return runGit('git', ['diff-tree', '--no-commit-id', '--name-only', '-r', revision], {
    encoding: 'utf8',
  })
    .split(/\r?\n/)
    .filter(Boolean);
}

function changedFilesFromWorktree(runGit = execFileSync) {
  const commands = [
    ['diff', '--name-only'],
    ['diff', '--name-only', '--cached'],
    ['ls-files', '--others', '--exclude-standard'],
  ];

  return [
    ...new Set(
      commands.flatMap((args) =>
        runGit('git', args, { encoding: 'utf8' }).split(/\r?\n/).filter(Boolean),
      ),
    ),
  ].sort();
}

function printPlan(plan) {
  console.log('Validation plan');
  console.log(`Changed files: ${plan.changedFiles.length}`);
  console.log(`Full fallback: ${plan.fullFallback ? 'yes' : 'no'}`);
  if (plan.fallbackReason) console.log(`Fallback reason: ${plan.fallbackReason}`);
  if (plan.note) console.log(`Selection note: ${plan.note}`);
  console.log('\nSelected protections:');
  for (const check of plan.selected) console.log(`- ${check.label}: ${check.risk}`);
  console.log('\nSkipped protections:');
  for (const check of plan.skipped) console.log(`- ${check.label}: ${check.reason}`);
}

function renderGithubSummary(plan) {
  const selected = plan.selected.length
    ? plan.selected.map((check) => `| ${check.label} | Selected | ${check.risk} |`).join('\n')
    : '| None | Skipped | No registered executable surface was affected |';
  const skipped = plan.skipped.length
    ? plan.skipped.map((check) => `| ${check.label} | Skipped | ${check.reason} |`).join('\n')
    : '| None | Selected | Every registered domain was selected |';

  return [
    '## Validation plan',
    '',
    `Changed files: **${plan.changedFiles.length}**`,
    `Full certification fallback: **${plan.fullFallback ? 'yes' : 'no'}**`,
    plan.fallbackReason ? `Fallback reason: ${plan.fallbackReason}` : '',
    plan.note ? `Selection note: ${plan.note}` : '',
    '',
    '| Protection | Decision | Risk or reason |',
    '| --- | --- | --- |',
    selected,
    skipped,
    '',
    '_This report explains derived validation scope; it does not provide a skip override._',
    '',
  ]
    .filter((line) => line !== '')
    .join('\n');
}

function writeGithubSummary(plan) {
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${renderGithubSummary(plan)}\n`);
  }
}

function buildGithubOutputs(plan) {
  return [
    `full_fallback=${plan.fullFallback}`,
    `selected_domains=${plan.selected.map(({ id }) => id).join(',')}`,
    `fallback_reason=${plan.fallbackReason ?? ''}`,
    `browser_desktop=${plan.experiences.desktop}`,
    `browser_mobile=${plan.experiences.mobile}`,
    `browser_visual=${plan.experiences.visual}`,
  ].join('\n');
}

function writeGithubOutputs(plan) {
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `${buildGithubOutputs(plan)}\n`);
  }
}

export {
  buildGithubOutputs,
  buildValidationPlan,
  changedFilesFromCommit,
  changedFilesFromGit,
  changedFilesFromWorktree,
  renderGithubSummary,
  writeGithubOutputs,
  writeGithubSummary,
};

if (process.argv[1]?.endsWith('validate-plan.mjs')) {
  const scope = process.argv[2] ?? 'branch';
  const revision = process.argv[3] ?? 'HEAD';
  if (!['branch', 'commit', 'worktree'].includes(scope)) {
    throw new Error(`Unknown plan scope: ${scope}`);
  }
  const files =
    scope === 'worktree'
      ? changedFilesFromWorktree()
      : scope === 'commit'
        ? changedFilesFromCommit(revision)
        : changedFilesFromGit();
  const plan = buildValidationPlan(files);
  printPlan(plan);
  writeGithubOutputs(plan);
  writeGithubSummary(plan);
}
