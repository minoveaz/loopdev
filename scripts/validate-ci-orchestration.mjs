#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import path from 'node:path';

function validateRegistry(registry) {
  const errors = [];
  if (!Array.isArray(registry?.checks) || registry.checks.length === 0) {
    return ['validation registry must contain checks'];
  }

  const ids = new Set();
  const commands = new Map();
  for (const check of registry.checks) {
    if (!check?.id?.trim()) errors.push('every validation check requires an id');
    if (ids.has(check.id)) errors.push(`validation check '${check.id}' is duplicated`);
    ids.add(check.id);
    if (!check?.domain?.trim()) errors.push(`check '${check.id}' requires a domain`);
    if (!check?.owner?.trim()) errors.push(`check '${check.id}' requires an owner`);
    if (!check?.risk?.trim()) errors.push(`check '${check.id}' requires a risk`);
    if (!check?.command?.trim() || !check.command.trim().startsWith('pnpm ')) {
      errors.push(`check '${check.id}' must declare a pnpm command`);
    }
    if (commands.has(check.command)) {
      errors.push(
        `checks '${commands.get(check.command)}' and '${check.id}' duplicate command '${check.command}'`,
      );
    }
    commands.set(check.command, check.id);
    if (!Array.isArray(check.modes) || (check.modes.length === 0 && check.layer !== 'routing')) {
      errors.push(`check '${check.id}' requires at least one execution mode`);
    }
  }
  return errors;
}

function validateWorkflowContract(workflowSource) {
  const requiredCommands = [
    'pnpm test:domain-catalog',
    'pnpm test:e2e-catalog',
    'pnpm test:protected-surfaces',
    'pnpm test:package-impact',
    'pnpm validate:plan',
  ];
  const errors = requiredCommands
    .filter((command) => !workflowSource.includes(command))
    .map((command) => `CI changes job must run '${command}'`);
  if (
    !workflowSource.includes('- name: Protect platform-owned shell surfaces') ||
    !workflowSource.includes('if: github.event_name == \'pull_request\'')
  ) {
    errors.push('protected-surface ownership must run only for pull requests');
  }
  return errors;
}

function validateCiOrchestration(registry, workflowSource) {
  return [...validateRegistry(registry), ...validateWorkflowContract(workflowSource)];
}

function main() {
  const root = process.cwd();
  const registry = JSON.parse(
    readFileSync(path.join(root, 'config/validation-registry.json'), 'utf8'),
  );
  const workflow = readFileSync(path.join(root, '.github/workflows/ci.yml'), 'utf8');
  const errors = validateCiOrchestration(registry, workflow);
  if (errors.length > 0) {
    console.error(`CI orchestration validation failed:\n- ${errors.join('\n- ')}`);
    process.exitCode = 1;
    return;
  }
  console.log(`CI orchestration validation passed for ${registry.checks.length} controls.`);
}

export { validateCiOrchestration, validateRegistry, validateWorkflowContract };

if (process.argv[1]?.endsWith('validate-ci-orchestration.mjs')) main();
