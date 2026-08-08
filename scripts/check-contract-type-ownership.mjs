import fs from 'node:fs';
import path from 'node:path';

const roots = ['apps', 'modules'];
const extensions = new Set(['.ts', '.tsx']);
const contractTypes = ['Organization', 'OrganizationMembership', 'Workspace', 'Permission', 'CrmContact', 'CrmLead', 'CrmOpportunity', 'CrmActivity', 'CrmTask', 'MarketingCampaign', 'MarketingAsset', 'MarketingCopy', 'SocialConnection', 'InsuranceProduct', 'EligibilityResult', 'Quote', 'Onboarding', 'Policy'];
const forbidden = new RegExp(`^(?!\\s*import\\b)\\s*(?:export\\s+)?(?:interface|type)\\s+(${contractTypes.join('|')})\\b`, 'gm');
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
  for (const match of source.matchAll(forbidden)) {
    violations.push(`${path.relative(process.cwd(), file)}:${source.slice(0, match.index).split('\n').length} locally declares shared contract type ${match[1]}`);
  }
}
for (const root of roots) walk(root);
if (violations.length > 0) {
  console.error(`${violations.join('\n')}\nImport the type from @loopdev/contracts instead.`);
  process.exitCode = 1;
} else console.log('No locally redeclared shared contract types found.');
