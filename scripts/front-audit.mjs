import fs from 'node:fs';
import path from 'node:path';

const sourceRoots = ['apps/loopdev-os/src', 'ds/packages/ui/src', 'modules'];
const extensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs']);
const outputJson = process.argv.includes('--json');
const findings = [];

const rules = {
  typography: 'Typography usage',
  hardcodedColor: 'Hardcoded color',
  forcedTheme: 'Forced theme',
  themeIsolation: 'Theme isolation',
  iconography: 'Iconography review',
  emojiIconography: 'Emoji iconography',
  filterPrimitiveConsistency: 'Filter primitive consistency',
  approvedInteractivePrimitive: 'Approved interactive primitive review',
  tabUnderlineCollision: 'Tab underline collision review',
  lowContrastOutlineAction: 'Low contrast outline action review',
};

function addFinding(file, line, rule, message, snippet) {
  findings.push({
    file: path.relative(process.cwd(), file),
    line,
    rule,
    message,
    snippet: snippet.trim().slice(0, 180),
  });
}

function lineNumber(source, index) {
  return source.slice(0, index).split('\n').length;
}

function inspect(file) {
  const source = fs.readFileSync(file, 'utf8');
  const lines = source.split('\n');
  const isHook = /(?:^|[/])use[A-Z][^/]*\.(?:ts|tsx)$/.test(file);
  const isTechnicalComponent = /(?:Technical|Status|Badge|Telemetry|TypeScale)/i.test(file);
  const isTestFile = /(?:\.test|\.spec)\.(?:ts|tsx|js|jsx)$/.test(file);
  const isDesignSystemFile = /(?:^|[/\\])ds[/\\]packages[/\\]ui[/\\]/.test(file);
  const isOfficialThemePrimitive = file.endsWith('ThemeToggle/useThemeToggle.ts');
  const isThemeOwner = isOfficialThemePrimitive || file.endsWith('dynamic-theme-provider.tsx') || file.endsWith('app/layout.tsx');

  if (file.endsWith('sales-crm/components/PipelineFilters.tsx') && /\bSelect\b/.test(source) && /\bFilterDropdown\b/.test(source)) {
    addFinding(file, 1, 'filterPrimitiveConsistency', 'Pipeline filters must use one approved dropdown primitive consistently.', source.split('\n')[0]);
  }

  if (/(?:<div|<nav)[^>]*className=["'][^"']*border-b[^"']*["'][^>]*>[\s\S]{0,1200}<Button[\s\S]{0,1200}border-b-2/.test(source)) {
    addFinding(file, 1, 'tabUnderlineCollision', 'Tabs combine a container underline with button underlines; active state can visually collide with the baseline.', 'container border-b + Button border-b-2');
  }

  if (/variant=["']outline["'][\s\S]{0,300}className=["'][^"']*(?:text-(?:slate|gray)-[5-9]|border-(?:slate|gray)-[1-3])[^"']*["']/.test(source) && /(?:bg-black|bg-slate-9|dark:bg-surface-dark|bg-surface-dark)/.test(source)) {
    addFinding(file, 1, 'lowContrastOutlineAction', 'Outline action may lose contrast on a dark surface; use a semantic high-contrast variant or tokens.', 'outline + dark surface + low-contrast utility');
  }

  lines.forEach((line, index) => {
    const lineNo = index + 1;
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('*')) return;

    if (!isDesignSystemFile && /<h[1-6]\b[^>]*className=|<h[1-6]\b[^>]*style=/.test(line)) {
      addFinding(file, lineNo, 'typography', 'Heading uses local typography styling; review Heading primitive usage.', line);
    }

    const hasHardcodedColor = /(?:text|bg|border|from|to|via)-\[#?[0-9a-fA-F]{3,8}\b|#[0-9a-fA-F]{6}\b/.test(line);
    const isTokenFallback = /var\(--[^,]+,\s*#[0-9a-fA-F]{3,8}\b/.test(line);
    if (hasHardcodedColor && !isTokenFallback && !isTestFile) {
      addFinding(file, lineNo, 'hardcodedColor', 'Use LoopDev tokens instead of a hardcoded color.', line);
    }

    if (!isOfficialThemePrimitive && /document\.documentElement\.(classList|style)|classList\.(add|remove)\(['"](?:dark|light)/.test(line)) {
      addFinding(file, lineNo, 'forcedTheme', 'Theme ownership belongs to the official theme provider, not a suite route.', line);
    }

    if (!isThemeOwner && /(document\.documentElement\.(classList|style)|classList\.(add|remove)\(['"](?:dark|light)|style\.setProperty\(['"]--lpd-color-)/.test(line)) {
      addFinding(file, lineNo, 'themeIsolation', 'Suite code must not mutate global theme classes or LoopDev color variables.', line);
    }

    if (!isTestFile && !isDesignSystemFile && /<button\b/.test(line) && !/Button|IconButton|button\.tsx/i.test(file)) {
      addFinding(file, lineNo, 'approvedInteractivePrimitive', 'Review whether the approved Button or IconButton primitive should be used.', line);
    }

    if (/<svg\b/.test(line) && !/Illustration|icons?\/|Icon\.tsx/i.test(file)) {
      addFinding(file, lineNo, 'iconography', 'Review icon against the approved LoopDev icon policy and Lucide adapter.', line);
    }

    const isFilterOrOptionLabel = /AVAILABLE_LABELS|<option\b|FilterDropdown/.test(line);
    if (!isTestFile && isFilterOrOptionLabel && /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(line)) {
      addFinding(file, lineNo, 'emojiIconography', 'UI iconography must use the approved LoopDev Icon primitive, not emoji.', line);
    }
  });

  // Detect inline typography styles spanning multiple lines.
  for (const match of source.matchAll(/style=\{\{[\s\S]{0,240}?(fontFamily|fontSize|fontWeight)[\s\S]{0,240}?\}\}/g)) {
    if (/TypeScale|Typography|TypefaceCard/i.test(file)) continue;
    addFinding(file, lineNumber(source, match.index), 'typography', 'Inline typography style should use a token or approved primitive.', match[0]);
  }
}

function walk(directory) {
  if (!fs.existsSync(directory)) return;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (['node_modules', '.next', 'dist', 'coverage'].includes(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute);
    else if (extensions.has(path.extname(entry.name))) inspect(absolute);
  }
}

for (const root of sourceRoots) walk(root);

const counts = Object.fromEntries(Object.keys(rules).map((rule) => [rule, findings.filter((finding) => finding.rule === rule).length]));
const report = {
  generatedAt: new Date().toISOString(),
  mode: 'informational',
  roots: sourceRoots,
  totalFindings: findings.length,
  counts,
  findings,
};

if (outputJson) {
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
} else {
  console.log('LoopDev Frontend Audit (informational)');
  console.log('========================================');
  console.log(`Scanned roots: ${sourceRoots.join(', ')}`);
  console.log(`Total findings: ${findings.length}`);
  console.log('');
  for (const [rule, label] of Object.entries(rules)) {
    console.log(`${label}: ${counts[rule]}`);
  }
  console.log('');
  findings.forEach(({ file, line, rule, message, snippet }) => {
    console.log(`[${rule}] ${file}:${line}`);
    console.log(`  ${message}`);
    console.log(`  ${snippet}`);
  });
  console.log('');
  console.log('This audit is informational and does not fail the command yet.');
}
