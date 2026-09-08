import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const roots = ['apps', 'modules'];
const extensions = new Set(['.ts', '.tsx']);
const contractTypes = [
  'Organization',
  'OrganizationMembership',
  'Workspace',
  'Permission',
  'CrmContact',
  'CrmLead',
  'CrmOpportunity',
  'CrmActivity',
  'CrmTask',
  'MarketingCampaign',
  'MarketingAsset',
  'MarketingCopy',
  'SocialConnection',
  'InsuranceProduct',
  'EligibilityResult',
  'Quote',
  'Onboarding',
  'Policy',
];
const forbidden = new RegExp(
  `^(?!\\s*import\\b)\\s*(?:export\\s+)?(?:interface|type)\\s+(${contractTypes.join('|')})\\b`,
  'gm',
);
const violations = [];

function walk(directory) {
  if (!fs.existsSync(directory)) return;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (['node_modules', '.next', 'dist', 'coverage'].includes(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute);
    else if (extensions.has(path.extname(entry.name))) inspect(absolute);
  }
}
function inspect(file) {
  const source = fs.readFileSync(file, 'utf8');
  const scriptKind = path.extname(file) === '.tsx' ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, scriptKind);
  const sourceWithoutImports = maskImportDeclarations(source, sourceFile);
  for (const match of sourceWithoutImports.matchAll(forbidden)) {
    violations.push(
      `${path.relative(process.cwd(), file)}:${sourceWithoutImports.slice(0, match.index).split('\n').length} locally declares shared contract type ${match[1]}`,
    );
  }
}

function maskImportDeclarations(source, sourceFile) {
  const masked = source.split('');
  function maskNode(node) {
    for (let index = node.getStart(sourceFile); index < node.end; index += 1) {
      if (masked[index] !== '\n' && masked[index] !== '\r') masked[index] = ' ';
    }
  }
  function visit(node) {
    if (ts.isImportDeclaration(node) || ts.isImportEqualsDeclaration(node)) {
      maskNode(node);
      return;
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return masked.join('');
}
for (const root of roots) walk(root);
if (violations.length > 0) {
  console.error(`${violations.join('\n')}\nImport the type from @loopdev/contracts instead.`);
  process.exitCode = 1;
} else console.log('No locally redeclared shared contract types found.');
