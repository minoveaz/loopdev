#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const repositoryRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const BUSINESS_TABLE_PATTERN =
  /^(crm_|communication_|catalog_|marketing_|content_|quant_|strategy_|insurance_|operations_)/i;
const APPEND_ONLY_TABLES = new Set(['crm_activities', 'crm_audit_events']);
const POLICY_VERBS_BY_TABLE = new Map([
  ['marketing_creative_projects', ['select', 'insert', 'update']],
  ['marketing_creative_project_versions', ['select', 'insert']],
  ['marketing_creative_variants', ['select', 'insert']],
]);
const VERBS = ['select', 'insert', 'update', 'delete'];

function normalizeIdentifier(identifier) {
  return identifier.replaceAll('"', '').toLowerCase();
}

function findCreateTableDefinitions(sql) {
  const definitions = [];
  const pattern =
    /create\s+table\s+(?:if\s+not\s+exists\s+)?(?:public\.)?("?[a-z_][a-z0-9_]*"?)\s*\(/gi;
  let match;

  while ((match = pattern.exec(sql)) !== null) {
    const openIndex = pattern.lastIndex - 1;
    let depth = 0;
    let quote = null;
    let endIndex = openIndex;

    for (let index = openIndex; index < sql.length; index += 1) {
      const character = sql[index];
      if (quote) {
        if (character === quote && sql[index - 1] !== '\\') quote = null;
        continue;
      }
      if (character === "'" || character === '"') {
        quote = character;
        continue;
      }
      if (character === '(') depth += 1;
      if (character === ')') {
        depth -= 1;
        if (depth === 0) {
          endIndex = index;
          break;
        }
      }
    }

    definitions.push({
      name: normalizeIdentifier(match[1]),
      body: sql.slice(openIndex + 1, endIndex),
    });
    pattern.lastIndex = endIndex + 1;
  }

  return definitions;
}

function hasRls(sql, tableName) {
  const escaped = tableName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(
    `alter\\s+table\\s+(?:public\\.)?${escaped}\\s+enable\\s+row\\s+level\\s+security`,
    'i',
  ).test(sql);
}

function policiesForTable(sql, tableName) {
  const escaped = tableName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return [...sql.matchAll(
    new RegExp(
      `create\\s+policy\\s+[^;]+?\\s+on\\s+(?:public\\.)?${escaped}\\s+for\\s+(select|insert|update|delete|all)\\b`,
      'gi',
    ),
  )].map((match) => match[1].toLowerCase());
}

function hasScopedForeignKey(body, parentTable) {
  const escaped = parentTable.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(
    `foreign\\s+key\\s*\\([^)]*\\borganization_id\\b[^)]*\\)\\s*references\\s+(?:public\\.)?${escaped}\\s*\\(\\s*id\\s*,\\s*organization_id\\s*\\)`,
    'i',
  ).test(body);
}

function directBusinessReferences(body) {
  return [...body.matchAll(
    /references\s+(?:public\.)?("?[a-z_][a-z0-9_]*"?)\s*\(\s*id\s*\)/gi,
  )]
    .map((match) => normalizeIdentifier(match[1]))
    .filter((tableName) => BUSINESS_TABLE_PATTERN.test(tableName));
}

function grantIssues(sql) {
  const issues = [];
  const grantPattern = /\bgrant\s+([^;]+?)\s+on\s+(?:table\s+)?(?:public\.)?("?[\w]+"?)\s+to\s+([^;]+);/gi;
  for (const match of sql.matchAll(grantPattern)) {
    const privileges = match[1].trim().toLowerCase();
    const tableName = normalizeIdentifier(match[2]);
    const recipients = match[3].trim().toLowerCase();

    if (/\ball(?:\s+privileges)?\b/.test(privileges)) {
      issues.push(`grant on ${tableName} uses all privileges`);
    }
    if (/(^|,\s*)(public|anon)(\s*,|$)/.test(recipients)) {
      issues.push(`grant on ${tableName} exposes a business table to public or anon`);
    }
  }
  return issues;
}

export function validateSql(sql, fileName = 'migration.sql') {
  const issues = [];

  if (/\bfor\s+all\b/i.test(sql)) {
    issues.push('policies must declare a specific SQL verb');
  }

  for (const issue of grantIssues(sql)) issues.push(issue);

  for (const definition of findCreateTableDefinitions(sql)) {
    if (!BUSINESS_TABLE_PATTERN.test(definition.name)) continue;

    if (!/\borganization_id\b/i.test(definition.body)) {
      issues.push(`${definition.name} is organization-owned but has no organization_id`);
    }
    if (!/references\s+(?:public\.)?organizations\s*\(\s*id\s*\)/i.test(definition.body)) {
      issues.push(`${definition.name} must reference public.organizations(id)`);
    }
    if (!hasRls(sql, definition.name)) {
      issues.push(`${definition.name} does not enable row level security`);
    }

    const policies = policiesForTable(sql, definition.name);
    const expectedVerbs =
      POLICY_VERBS_BY_TABLE.get(definition.name) ??
      (APPEND_ONLY_TABLES.has(definition.name) ? ['select', 'insert'] : VERBS);
    for (const verb of expectedVerbs) {
      if (!policies.includes(verb)) issues.push(`${definition.name} has no ${verb} policy`);
    }
    for (const forbiddenVerb of VERBS.filter((verb) => !expectedVerbs.includes(verb))) {
      if (policies.includes(forbiddenVerb)) {
        issues.push(`${definition.name} must not have a ${forbiddenVerb} policy`);
      }
    }

    for (const parentTable of directBusinessReferences(definition.body)) {
      if (!hasScopedForeignKey(definition.body, parentTable)) {
        issues.push(
          `${definition.name} references ${parentTable}(id) without an organization-aware composite foreign key`,
        );
      }
    }
  }

  return issues.map((message) => `${fileName}: ${message}`);
}

function optionValue(args, option) {
  const index = args.indexOf(option);
  return index === -1 ? undefined : args[index + 1];
}

function changedFiles(base, head) {
  return execFileSync('git', ['diff', '--name-only', `${base}...${head}`], {
    cwd: repositoryRoot,
    encoding: 'utf8',
  })
    .split(/\r?\n/)
    .map((file) => file.trim())
    .filter((file) => file.endsWith('.sql') && file.startsWith('supabase/migrations/'));
}

function allMigrationFiles(directory = 'supabase/migrations') {
  return readdirSync(resolve(repositoryRoot, directory), { withFileTypes: true }).flatMap((entry) => {
    const relativePath = `${directory}/${entry.name}`;
    if (entry.isDirectory()) return allMigrationFiles(relativePath);
    return entry.name.endsWith('.sql') ? [relativePath] : [];
  });
}

export function validateFiles(files) {
  return files.flatMap((file) => {
    const absolutePath = resolve(repositoryRoot, file);
    return existsSync(absolutePath) ? validateSql(readFileSync(absolutePath, 'utf8'), file) : [];
  });
}

function main(args) {
  const all = args.includes('--all');
  const base = optionValue(args, '--base') ?? process.env.BASE_SHA ?? 'origin/develop';
  const head = optionValue(args, '--head') ?? process.env.HEAD_SHA ?? 'HEAD';
  const files = all
    ? allMigrationFiles()
    : changedFiles(base, head);
  const issues = validateFiles(files);

  console.log(`Supabase governance migrations checked: ${files.length}`);
  if (issues.length > 0) {
    for (const issue of issues) console.error(`- ${issue}`);
    return 1;
  }
  console.log('Supabase migration governance passed.');
  return 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) process.exitCode = main(process.argv.slice(2));
