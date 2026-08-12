import fs from 'node:fs';
import path from 'node:path';

const sourceRoots = ['apps/loopdev-os/src', 'ds/packages/ui/src', 'modules'];
const extensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs']);
const outputJson = process.argv.includes('--json');
const failOnFindings = process.argv.includes('--fail-on-findings');
const failOnNewFindings = process.argv.includes('--fail-on-new-findings');
const baselinePath = process.argv
  .find((argument) => argument.startsWith('--baseline='))
  ?.slice('--baseline='.length);
const fileFilter = process.argv
  .find((argument) => argument.startsWith('--file='))
  ?.slice('--file='.length);
const ruleFilter = process.argv
  .find((argument) => argument.startsWith('--rule='))
  ?.slice('--rule='.length);
const findings = [];
const findingKeys = new Set();

function loadBaseline() {
  if (!baselinePath) return [];
  const baseline = JSON.parse(fs.readFileSync(path.resolve(baselinePath), 'utf8'));
  return Array.isArray(baseline) ? baseline : (baseline.findings ?? []);
}

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
  tabControlConsistency: 'Tab control consistency review',
  timelineConsistency: 'Timeline consistency review',
  implicitButtonVariant: 'Implicit button variant review',
  lightModeActionContrast: 'Light mode action contrast review',
  iconColorConsistency: 'Icon color consistency review',
  sidebarRoutePolicy: 'Sidebar route policy review',
  duplicateImportBinding: 'Duplicate import binding review',
  tokenUsage: 'Design token usage review',
  shellArchitecture: 'Shell architecture review',
};
const designContracts = JSON.parse(
  fs.readFileSync(path.resolve('config/design-contract-registry.json'), 'utf8'),
).rules;

function addFinding(file, line, rule, message, snippet) {
  const relativeFile = path.relative(process.cwd(), file);
  if (fileFilter && !relativeFile.includes(fileFilter)) return;
  if (ruleFilter && rule !== ruleFilter) return;

  const key = `${relativeFile}:${line}:${rule}:${message}`;
  if (findingKeys.has(key)) return;
  findingKeys.add(key);

  findings.push({
    file: relativeFile,
    line,
    rule,
    contractKind: designContracts[rule]?.kind ?? 'unclassified',
    primaryRisk: designContracts[rule]?.risk ?? 'unclassified design risk',
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
  const isLeadModalFile = /MasterDetailModal[\\/]/.test(file);
  const isOfficialThemePrimitive = /ThemeToggle[\\/]useThemeToggle\.ts$/.test(file);
  const isThemeOwner =
    isOfficialThemePrimitive ||
    file.endsWith('dynamic-theme-provider.tsx') ||
    file.endsWith('app/layout.tsx');
  const isColorOwner =
    /(?:globals\.css|app[\\/]layout\.tsx|AiBudgetGenerator|PipelineCard|MetricGauge|ColorTokenCard|ColorTokenInspector|rules-data)/i.test(
      file,
    );
  const isAppLayout = /(?:^|[/\\])apps[/\\][^/\\]+[/\\]src[/\\]app[/\\].*layout\.tsx$/.test(file);
  const isRootAppLayout = /(?:^|[/\\])apps[/\\][^/\\]+[/\\]src[/\\]app[/\\]layout\.tsx$/.test(file);
  const isSuiteShellLayout =
    /(?:^|[/\\])app[/\\](?:marketing-studio|quant-ops|sales-crm|health-os)[/\\]layout\.tsx$/.test(
      file,
    );
  const directPaletteClass =
    /(?:^|:|\s)(?:text|bg|border|ring|from|via|to|fill|stroke)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}(?:\/\d{1,3})?(?=\s|$)/;
  const hasInlineColorValue = /(?:#[0-9a-fA-F]{3,8}|rgba?\(|hsla?\()/;

  if (
    file.endsWith('sales-crm/components/PipelineFilters.tsx') &&
    /\bSelect\b/.test(source) &&
    /\bFilterDropdown\b/.test(source)
  ) {
    addFinding(
      file,
      1,
      'filterPrimitiveConsistency',
      'Pipeline filters must use one approved dropdown primitive consistently.',
      source.split('\n')[0],
    );
  }

  if (
    isAppLayout &&
    !isRootAppLayout &&
    !isSuiteShellLayout &&
    /\bAppShell\b/.test(source) &&
    !/\bModuleWorkspace\b/.test(source)
  ) {
    addFinding(
      file,
      1,
      'shellArchitecture',
      'Module layouts must compose the canonical ModuleWorkspace directly; suite layouts own AppShell and module layouts own the second-level workspace.',
      'AppShell without direct ModuleWorkspace',
    );
  }

  const isOperationalModuleLayout =
    /(?:^|[/\\])app[/\\](?:marketing-studio|quant-ops|sales-crm|health-os)[/\\].+[/\\]layout\.tsx$/.test(
      file,
    );
  if (isOperationalModuleLayout && !/\bModuleWorkspace\b/.test(source)) {
    addFinding(
      file,
      1,
      'shellArchitecture',
      'Operational module layouts must compose the canonical ModuleWorkspace directly or be registered as an explicit shell exception.',
      'Operational module layout without ModuleWorkspace',
    );
  }

  if (/\bSuiteContentFrame\b/.test(source)) {
    addFinding(
      file,
      1,
      'shellArchitecture',
      'SuiteContentFrame is not a registered shell primitive; use AppShell for suite chrome and ModuleWorkspace for operational chrome.',
      'Unregistered SuiteContentFrame wrapper',
    );
  }

  if (
    /(?:^|[/\\])app[/\\][^/\\]+[/\\]layout\.tsx$/.test(file) &&
    /\bSuiteSidebar\b/.test(source) &&
    !/getSuiteNavMode/.test(source)
  ) {
    addFinding(
      file,
      1,
      'sidebarRoutePolicy',
      'Suite layouts must use the shared sidebar route policy so root and operational routes restore deterministic nav modes.',
      'SuiteSidebar without getSuiteNavMode',
    );
  }

  if (
    /(?:^|[/\\])app[/\\][^/\\]+[/\\]layout\.tsx$/.test(file) &&
    /pathname\.split\(['"]\/['"]\)\.length\s*>\s*2/.test(source)
  ) {
    addFinding(
      file,
      1,
      'sidebarRoutePolicy',
      'Do not infer Rail from URL depth; declare operational route prefixes in the shared sidebar policy.',
      'pathname depth-based nav mode',
    );
  }

  for (const match of source.matchAll(/import\s*\{([\s\S]*?)\}\s*from\s*['"][^'"]+['"]/g)) {
    const importedNames = match[1]
      .replace(/\/\/.*$/gm, '')
      .split(',')
      .map((name) => name.trim().split(/\s+as\s+/i)[0])
      .filter(Boolean);
    const duplicateNames = [
      ...new Set(importedNames.filter((name, index) => importedNames.indexOf(name) !== index)),
    ];
    if (duplicateNames.length > 0) {
      addFinding(
        file,
        lineNumber(source, match.index),
        'duplicateImportBinding',
        'Named imports must not declare the same binding more than once.',
        duplicateNames.join(', '),
      );
    }
  }

  if (
    /(?:<div|<nav)[^>]*className=["'][^"']*border-b[^"']*["'][^>]*>[\s\S]{0,1200}<Button[\s\S]{0,1200}border-b-2/.test(
      source,
    )
  ) {
    addFinding(
      file,
      1,
      'tabUnderlineCollision',
      'Tabs combine a container underline with button underlines; active state can visually collide with the baseline.',
      'container border-b + Button border-b-2',
    );
  }

  if (
    /activeTab/.test(source) &&
    /<Button\b(?![\s\S]{0,120}?variant=)[\s\S]{0,500}activeTab/.test(source)
  ) {
    addFinding(
      file,
      1,
      'tabControlConsistency',
      'Tabs must opt into an explicit variant and own their spacing/state container.',
      'active tab buttons without explicit variant',
    );
  }

  if (/activityLog\.map/.test(source) && /absolute[^"']*rounded-full/.test(source)) {
    addFinding(
      file,
      1,
      'timelineConsistency',
      'Activity timelines should use a stable marker gutter and avoid ad hoc circular markers that collide with content.',
      'activity timeline with absolute rounded-full marker',
    );
  }

  if (!isDesignSystemFile) {
    for (const match of source.matchAll(/<Button\b([^>]*)>/g)) {
      const buttonProps = match[1];
      if (!/\bvariant\s*=/.test(buttonProps)) {
        addFinding(
          file,
          lineNumber(source, match.index),
          'implicitButtonVariant',
          'Product buttons must declare an explicit variant so theme changes cannot make text or icons unreadable.',
          match[0],
        );
      }

      const isSolidAction =
        /variant\s*=\s*["'](?:primary|danger|energy)["']/.test(buttonProps) ||
        /(?:bg-(?:primary|emerald|rose|red|amber|blue)-\d{2,3}|bg-\[[^\]]+\])/.test(buttonProps);
      if (
        /text-white|text-slate-100|text-gray-100/.test(buttonProps) &&
        !isSolidAction &&
        !/dark:/.test(buttonProps)
      ) {
        addFinding(
          file,
          lineNumber(source, match.index),
          'lightModeActionContrast',
          'Button text or icons use a light-only color without a dark-mode override; review light-mode contrast.',
          match[0],
        );
      }
    }

    for (const match of source.matchAll(/<Icon\b([\s\S]{0,260}?)\/>/g)) {
      const iconProps = match[1];
      const isSemanticStatusIcon =
        /name\s*=\s*\{?['"]?(?:verified|check|close|error|warning|success|status\.)/.test(
          iconProps,
        );
      if (
        !isSemanticStatusIcon &&
        /(?:text|fill|stroke)-(?:blue|indigo|violet|teal|amber|emerald|rose|red|green|purple)-\d{2,3}/.test(
          iconProps,
        )
      ) {
        addFinding(
          file,
          lineNumber(source, match.index),
          'iconColorConsistency',
          'Icons should use LoopDev semantic tokens or inherit the control color instead of arbitrary palette utilities.',
          match[0],
        );
      }
    }
  }

  for (const match of source.matchAll(
    /<Button\b[\s\S]{0,320}?variant=["']outline["'][\s\S]{0,320}?>/g,
  )) {
    const buttonBlock = match[0];
    const hasLowContrastText =
      /(?:text-(?:slate|gray)-[5-9]\d{2}|border-(?:slate|gray)-[1-3]\d{2})/.test(buttonBlock);
    const hasDarkOverride = /dark:(?:text|border)-(?:slate|gray)-[3-9]\d{2}/.test(buttonBlock);
    if (hasLowContrastText && !hasDarkOverride) {
      addFinding(
        file,
        lineNumber(source, match.index),
        'lowContrastOutlineAction',
        'Outline action may lose contrast on a dark surface; use a semantic high-contrast variant or tokens.',
        buttonBlock,
      );
    }
  }

  lines.forEach((line, index) => {
    const lineNo = index + 1;
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('*')) return;

    if (!isDesignSystemFile && /<h[1-6]\b[^>]*className=|<h[1-6]\b[^>]*style=/.test(line)) {
      addFinding(
        file,
        lineNo,
        'typography',
        'Heading uses local typography styling; review Heading primitive usage.',
        line,
      );
    }

    const hasHardcodedColor =
      /(?:text|bg|border|from|to|via)-\[#?[0-9a-fA-F]{3,8}\b|#[0-9a-fA-F]{6}\b/.test(line);
    const isTokenFallback = /var\(--[^,]+,\s*#[0-9a-fA-F]{3,8}\b/.test(line);
    if (
      hasHardcodedColor &&
      !isTokenFallback &&
      !isTestFile &&
      !isDesignSystemFile &&
      !isColorOwner
    ) {
      addFinding(
        file,
        lineNo,
        'hardcodedColor',
        'Use LoopDev tokens instead of a hardcoded color.',
        line,
      );
    }

    const isTokenSafeClass =
      /(?:text|bg|border|ring|from|via|to|fill|stroke)-(?:primary|secondary|foreground|background|surface|shell|text|border|status|innovation|accent|destructive|muted|white|black)(?:[-/]|\\b)/.test(
        line,
      );
    const hasVisualContext =
      /className=|style=|(?:color|background(?:Color)?|fill|stroke)\s*[:=]/.test(line);
    if (
      !isTestFile &&
      !isDesignSystemFile &&
      !isColorOwner &&
      hasVisualContext &&
      (directPaletteClass.test(line) || (hasInlineColorValue.test(line) && !isTokenFallback)) &&
      !isTokenSafeClass
    ) {
      addFinding(
        file,
        lineNo,
        'tokenUsage',
        'Use LoopDev semantic design tokens instead of direct palette utilities or inline color values.',
        line,
      );
    }

    if (
      !isTestFile &&
      !isOfficialThemePrimitive &&
      /document\.documentElement\.(classList|style)|classList\.(add|remove)\(['"](?:dark|light)/.test(
        line,
      )
    ) {
      addFinding(
        file,
        lineNo,
        'forcedTheme',
        'Theme ownership belongs to the official theme provider, not a suite route.',
        line,
      );
    }

    if (
      !isTestFile &&
      !isThemeOwner &&
      /(document\.documentElement\.(classList|style)|classList\.(add|remove)\(['"](?:dark|light)|style\.setProperty\(['"]--lpd-color-)/.test(
        line,
      )
    ) {
      addFinding(
        file,
        lineNo,
        'themeIsolation',
        'Suite code must not mutate global theme classes or LoopDev color variables.',
        line,
      );
    }

    if (
      !isTestFile &&
      !isDesignSystemFile &&
      /<button\b/.test(line) &&
      !/Button|IconButton|button\.tsx/i.test(file)
    ) {
      addFinding(
        file,
        lineNo,
        'approvedInteractivePrimitive',
        'Review whether the approved Button or IconButton primitive should be used.',
        line,
      );
    }

    const isApprovedBrandMark =
      /(?:MasterDetailModal[\\/]index|MasterDetailModal[\\/]Header)\.tsx/i.test(file) &&
      /whatsapp/i.test(source);
    if (
      /<svg\b/.test(line) &&
      !isDesignSystemFile &&
      !isApprovedBrandMark &&
      !/Illustration|icons?\/|Icon\.tsx|MetricGauge|InfoPanel/i.test(file)
    ) {
      addFinding(
        file,
        lineNo,
        'iconography',
        'Review icon against the approved LoopDev icon policy and Lucide adapter.',
        line,
      );
    }

    const isUiLabelOrMarkup =
      /AVAILABLE_LABELS|<option\b|FilterDropdown|<\w+\b|className=|label=|title=|placeholder=/.test(
        line,
      );
    if (
      !isTestFile &&
      (isUiLabelOrMarkup || isLeadModalFile) &&
      /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(line)
    ) {
      addFinding(
        file,
        lineNo,
        'emojiIconography',
        'UI iconography must use the approved LoopDev Icon primitive, not emoji.',
        line,
      );
    }
  });

  // Detect inline typography styles spanning multiple lines.
  for (const match of source.matchAll(
    /style=\{\{[\s\S]{0,240}?(fontFamily|fontSize|fontWeight)[\s\S]{0,240}?\}\}/g,
  )) {
    if (/TypeScale|Typography|TypefaceCard/i.test(file)) continue;
    addFinding(
      file,
      lineNumber(source, match.index),
      'typography',
      'Inline typography style should use a token or approved primitive.',
      match[0],
    );
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

const counts = Object.fromEntries(
  Object.keys(rules).map((rule) => [
    rule,
    findings.filter((finding) => finding.rule === rule).length,
  ]),
);
const report = {
  generatedAt: new Date().toISOString(),
  mode: 'informational',
  roots: sourceRoots,
  totalFindings: findings.length,
  counts,
  findings,
};

const findingsByFile = Object.entries(
  findings.reduce((groups, finding) => {
    groups[finding.file] = (groups[finding.file] ?? 0) + 1;
    return groups;
  }, {}),
).sort(([, a], [, b]) => b - a);

report.findingsByFile = Object.fromEntries(findingsByFile);

const baselineFindings = loadBaseline();
const baselineKeys = new Set(
  baselineFindings.map(
    (finding) => `${finding.file}:${finding.line}:${finding.rule}:${finding.message}`,
  ),
);
const newFindings = findings.filter(
  (finding) =>
    !baselineKeys.has(`${finding.file}:${finding.line}:${finding.rule}:${finding.message}`),
);
report.baseline = baselinePath ?? null;
report.newFindings = newFindings;
report.newFindingsCount = newFindings.length;

if (outputJson) {
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
} else {
  console.log('LoopDev Frontend Audit (informational)');
  console.log('========================================');
  console.log(`Scanned roots: ${sourceRoots.join(', ')}`);
  console.log(`Total findings: ${findings.length}`);
  if (baselinePath) console.log(`New findings against baseline: ${newFindings.length}`);
  console.log('');
  for (const [rule, label] of Object.entries(rules)) {
    console.log(`${label}: ${counts[rule]}`);
  }
  console.log('');
  findings.forEach(({ file, line, rule, contractKind, primaryRisk, message, snippet }) => {
    console.log(`[${rule}][${contractKind}] ${file}:${line}`);
    console.log(`  ${message}`);
    console.log(`  Primary risk: ${primaryRisk}`);
    console.log(`  ${snippet}`);
  });
  if (findingsByFile.length > 0) {
    console.log('Findings by file:');
    findingsByFile.forEach(([file, count]) => console.log(`  ${count} ${file}`));
    console.log('');
  }
  console.log('');
  console.log('This audit is informational and does not fail the command yet.');
}

if (failOnFindings && findings.length > 0) process.exitCode = 1;
if (failOnNewFindings && newFindings.length > 0) process.exitCode = 1;
