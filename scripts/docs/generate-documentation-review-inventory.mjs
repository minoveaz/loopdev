import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, '../..');
const docsRoot = path.join(repositoryRoot, 'docs');
const outputPath = path.join(
  docsRoot,
  '04-governance',
  'DOCUMENTATION_REVIEW_INVENTORY.md',
);
const checkOnly = process.argv.includes('--check');

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(entryPath) : [entryPath];
  });
}

function classify(relativePath) {
  const normalizedPath = relativePath.replaceAll(path.sep, '/');

  if (normalizedPath.startsWith('archive/')) {
    return ['HISTORICAL', 'Archived evidence or migration source'];
  }

  if (
    normalizedPath ===
      'architecture/LOOPDEV_PRODUCT_ARCHITECTURE_AND_ROADMAP.md' ||
    normalizedPath === 'architecture/LOOPDEV_PILOT.md'
  ) {
    return ['FROZEN', 'Strategic reference; content changes prohibited'];
  }

  if (
    normalizedPath === 'README.md' ||
    normalizedPath.endsWith('/README.md') ||
    normalizedPath === 'registries/REGISTRY_CATALOG.md'
  ) {
    return ['NAVIGATION', 'Index or generated catalog'];
  }

  if (normalizedPath.startsWith('registries/')) {
    return ['CANONICAL', 'Domain registry or registry contract'];
  }

  if (normalizedPath.startsWith('04-governance/audits/')) {
    return ['HISTORICAL', 'Point-in-time audit evidence'];
  }

  return ['PENDING_REVIEW', 'Requires document-by-document review'];
}

function ownershipFor(relativePath, proposedState) {
  const normalizedPath = relativePath.replaceAll(path.sep, '/');

  if (proposedState === 'HISTORICAL') {
    return ['Historical evidence', 'Governance', 'Read-only'];
  }

  if (normalizedPath.startsWith('06-ai-skills/')) {
    return ['AI skills and agent behavior', 'AI Platform', 'Each skill or routing change'];
  }

  if (normalizedPath.startsWith('06-product/')) {
    return ['Suite product documentation', 'Domain owner', 'Each roadmap or module-scope change'];
  }

  if (normalizedPath.startsWith('04-governance/')) {
    return ['Governance and certification', 'Governance', 'Each policy change and quarterly audit'];
  }

  if (normalizedPath.startsWith('05-operations/')) {
    return ['Operations and engineering history', 'Platform', 'Each operational or execution change'];
  }

  if (normalizedPath.startsWith('02-frontend/') || normalizedPath.startsWith('registries/')) {
    return ['Frontend, design system, and registries', 'Platform', 'Each component or design-system change'];
  }

  if (normalizedPath.startsWith('03-platform/') || normalizedPath.startsWith('01-foundations/')) {
    return ['Foundations and platform', 'Platform', 'Each architecture or contract change'];
  }

  if (normalizedPath.startsWith('architecture/')) {
    return ['Product direction and architecture', 'Governance', 'Only when explicitly approved'];
  }

  return ['Documentation navigation', 'Repository automation', 'When paths, ownership, or status changes'];
}

const reviewedOverrides = {
  '04-governance/DOCUMENTATION_GOVERNANCE.md': {
    proposedState: 'CANONICAL',
    rationale: 'Defines the repository documentation lifecycle and authority policy',
    authority: 'Documentation governance',
    owner: 'Governance',
    cadence: 'Each policy or authority change',
    action: 'KEEP_AS_CANONICAL',
  },
  '04-governance/DOCUMENTATION_REVIEW_INVENTORY.md': {
    proposedState: 'NAVIGATION',
    rationale: 'Generated inventory of documentation lifecycle decisions',
    authority: 'Documentation governance',
    owner: 'Governance',
    cadence: 'Each documentation review cycle',
    action: 'GENERATED_AND_VALIDATED',
  },
  '06-ai-skills/SKILL_ROUTING_GUIDE.md': {
    proposedState: 'ACTIVE',
    rationale: 'Current high-level routing to repository Skills',
    authority: 'Repository Skills',
    owner: 'AI Platform',
    cadence: 'Each Skill routing change',
    action: 'KEEP_ALIGNED_WITH_GITHUB_SKILLS',
  },
  '06-ai-skills/SKILLS_REGISTRY.json': {
    proposedState: 'HISTORICAL',
    rationale: 'Legacy registry retained for the detailed security reference; .github/skills is authoritative',
    authority: 'Repository Skills',
    owner: 'AI Platform',
    cadence: 'No new content',
    action: 'ARCHIVE_AFTER_REFERENCE_REVIEW',
  },
  '01-foundations/ARCHITECTURAL_DECISIONS.md': {
    proposedState: 'CANONICAL',
    rationale: 'Architecture decision source; references require alignment with the current monorepo layout',
    authority: 'Architectural decisions',
    owner: 'Platform',
    cadence: 'Each architecture or contract change',
    action: 'UPDATE_AND_ALIGN',
  },
  'archive/foundations/2026-08-13/GAP_CLOSURE_PLAN.md': {
    proposedState: 'HISTORICAL',
    rationale: 'Superseded execution plan retained for audit provenance',
    authority: 'Delivery execution and phase status',
    owner: 'Governance',
    cadence: 'No new content',
    action: 'ARCHIVE_WITHOUT_MIGRATING_MILESTONES',
  },
  '01-foundations/SAAS_DATA_MODEL.md': {
    proposedState: 'CANONICAL',
    rationale: 'Conceptual data model, but tenant and organization terminology must align with the tenancy authority',
    authority: 'Foundations and platform',
    owner: 'Platform',
    cadence: 'Each architecture or contract change',
    action: 'UPDATE_AND_ALIGN',
  },
  '01-foundations/VISUAL_COMPOSITION_SYSTEM.md': {
    proposedState: 'CANONICAL',
    rationale: 'Visual system authority explicitly consumed by frontend protocols and certification',
    authority: 'Visual composition and tokens',
    owner: 'Platform',
    cadence: 'Each component or design-system change',
    action: 'REVIEW_AND_LINK_DEPENDENCIES',
  },
  '03-platform/API_STANDARDS.md': {
    proposedState: 'CANONICAL',
    rationale: 'Platform API contract and versioning authority',
    authority: 'Platform, APIs, security, and tenancy',
    owner: 'Platform',
    cadence: 'Each architecture or contract change',
    action: 'REVIEW_AND_LINK_IMPLEMENTATION',
  },
  '03-platform/DATABASE_SECURITY_RLS.md': {
    proposedState: 'CANONICAL',
    rationale: 'RLS policy authority; isolation-test evidence remains a tracked gap',
    authority: 'Platform, APIs, security, and tenancy',
    owner: 'Platform',
    cadence: 'Each architecture or contract change',
    action: 'UPDATE_WITH_TEST_EVIDENCE',
  },
  '03-platform/ENVIRONMENTS.md': {
    proposedState: 'CANONICAL',
    rationale: 'Deployment environment authority with a promotion flow requiring alignment to current Git governance',
    authority: 'Foundations and platform',
    owner: 'Platform',
    cadence: 'Each operational or deployment change',
    action: 'UPDATE_AND_ALIGN',
  },
  '03-platform/GIT_WORKFLOW.md': {
    proposedState: 'CANONICAL',
    rationale: 'Repository branching, commit, and pull-request authority',
    authority: 'Foundations and platform',
    owner: 'Platform',
    cadence: 'Each repository governance change',
    action: 'REVIEW_CURRENT_RULES',
  },
  '03-platform/INFRA_DEFINITION_OF_DONE.md': {
    proposedState: 'CANONICAL',
    rationale: 'Infrastructure completion gate referenced by delivery work',
    authority: 'Foundations and platform',
    owner: 'Platform',
    cadence: 'Each architecture or contract change',
    action: 'REVIEW_AND_LINK_VALIDATION',
  },
  '03-platform/INFRA_DEFINITION_OF_READY.md': {
    proposedState: 'CANONICAL',
    rationale: 'Infrastructure readiness gate for scoped work',
    authority: 'Foundations and platform',
    owner: 'Platform',
    cadence: 'Each architecture or contract change',
    action: 'REVIEW_AND_LINK_VALIDATION',
  },
  'archive/platform/2026-08-13/INFRASTRUCTURE_ROADMAP.md': {
    proposedState: 'HISTORICAL',
    rationale: 'Execution roadmap superseded by tracks and retained for provenance',
    authority: 'Delivery execution and phase status',
    owner: 'Governance',
    cadence: 'No new content',
    action: 'ARCHIVE_WITHOUT_MIGRATING_MILESTONES',
  },
  '03-platform/MULTI_TENANCY_STRATEGY.md': {
    proposedState: 'CANONICAL',
    rationale: 'Primary tenancy architecture authority; terminology and implementation status require reconciliation',
    authority: 'Platform, APIs, security, and tenancy',
    owner: 'Platform',
    cadence: 'Each architecture or contract change',
    action: 'UPDATE_AND_ALIGN',
  },
  'archive/platform/2026-08-13/SECURITY_AND_TENANT_MODEL.md': {
    proposedState: 'HISTORICAL',
    rationale: 'Duplicate security and tenancy guidance retained for provenance',
    authority: 'Platform, APIs, security, and tenancy',
    owner: 'Platform',
    cadence: 'No new content',
    action: 'ARCHIVE_WITHOUT_MIGRATING_MILESTONES',
  },
  '03-platform/SHELL_SHOWCASE_CONTRACT.md': {
    proposedState: 'CANONICAL',
    rationale: 'Executable shell contract backed by dedicated end-to-end and visual validation',
    authority: 'Frontend and design system',
    owner: 'Platform',
    cadence: 'Each shell contract or visual change',
    action: 'REVIEW_AGAINST_TESTS',
  },
  '03-platform/STORAGE_CONVENTIONS.md': {
    proposedState: 'CANONICAL',
    rationale: 'Storage path, privacy, and signed URL authority for tenant assets',
    authority: 'Platform, APIs, security, and tenancy',
    owner: 'Platform',
    cadence: 'Each storage or security change',
    action: 'REVIEW_AND_LINK_IMPLEMENTATION',
  },
  '02-frontend/COMPONENT_COMPOSITION_PROTOCOL.md': {
    proposedState: 'CANONICAL',
    rationale: 'Frontend composition authority; legacy Firestore and version references require alignment with registries and current visual authority',
    authority: 'Frontend and design system',
    owner: 'Platform',
    cadence: 'Each component or design-system change',
    action: 'UPDATE_AND_ALIGN',
  },
  '02-frontend/COMPONENT_TESTING_PROTOCOL.md': {
    proposedState: 'CANONICAL',
    rationale: 'Component testing authority using Playwright for browser and visual validation',
    authority: 'Frontend and design system',
    owner: 'Platform',
    cadence: 'Each component or design-system change',
    action: 'ALIGNED_WITH_PLAYWRIGHT',
  },
  '02-frontend/COMPONENT_WORKFLOW.md': {
    proposedState: 'CANONICAL',
    rationale: 'Component lifecycle authority; legacy user-history and lab references require migration to tracks and current workflows',
    authority: 'Frontend and design system',
    owner: 'Platform',
    cadence: 'Each component or design-system change',
    action: 'UPDATE_AND_ALIGN',
  },
  '02-frontend/DESIGN_TOKENS_USAGE.md': {
    proposedState: 'CANONICAL',
    rationale: 'Semantic token usage authority shared by web and mobile implementations',
    authority: 'Visual composition and tokens',
    owner: 'Platform',
    cadence: 'Each component or design-system change',
    action: 'REVIEW_AGAINST_TOKEN_PACKAGES',
  },
  '02-frontend/INSPECTOR_SYSTEM.md': {
    proposedState: 'CANONICAL',
    rationale: 'Inspector interaction and governance composition authority',
    authority: 'Frontend and design system',
    owner: 'Platform',
    cadence: 'Each component or design-system change',
    action: 'REVIEW_AGAINST_IMPLEMENTATION',
  },
  '02-frontend/LAYOUT_SYSTEM.md': {
    proposedState: 'CANONICAL',
    rationale: 'Cross-suite layout composition and certification authority',
    authority: 'Frontend and design system',
    owner: 'Platform',
    cadence: 'Each component or design-system change',
    action: 'REVIEW_AGAINST_SHELL_CONTRACT',
  },
  '02-frontend/LOOPDEV_FRONTEND_CONSTITUTION.md': {
    proposedState: 'ACTIVE',
    rationale: 'Concise operational frontend rules that point to detailed canonical authorities',
    authority: 'Frontend and design system',
    owner: 'Platform',
    cadence: 'Each component or design-system change',
    action: 'REVIEW_AND_LINK_AUTHORITIES',
  },
  '02-frontend/MODULE_WORKSPACE.md': {
    proposedState: 'CANONICAL',
    rationale: 'Operational workspace primitive authority and slot contract',
    authority: 'Frontend and design system',
    owner: 'Platform',
    cadence: 'Each component or design-system change',
    action: 'REVIEW_AGAINST_IMPLEMENTATION',
  },
  '02-frontend/MULTIPLATFORM_DESIGN_SYSTEM_ARCHITECTURE.md': {
    proposedState: 'CANONICAL',
    rationale: 'Web and mobile design-system boundary and migration authority',
    authority: 'Frontend and design system',
    owner: 'Platform',
    cadence: 'Each component or design-system change',
    action: 'REVIEW_AGAINST_PACKAGE_LAYOUT',
  },
  '02-frontend/SHELL_ARCHITECTURE.md': {
    proposedState: 'CANONICAL',
    rationale: 'Normative shell composition authority backed by implementation and contract tests',
    authority: 'Frontend and design system',
    owner: 'Platform',
    cadence: 'Each shell contract or visual change',
    action: 'REVIEW_AGAINST_SHELL_IMPLEMENTATION',
  },
  '02-frontend/UI_COMPLEX_READINESS_CHECKLIST.md': {
    proposedState: 'CANONICAL',
    rationale: 'Readiness gate for complex UI tied to discovery, contracts, tenant isolation, and phase governance',
    authority: 'Frontend and design system',
    owner: 'Platform',
    cadence: 'Each component or design-system change',
    action: 'UPDATE_ORGANIZATION_TERMINOLOGY',
  },
  '04-governance/AUDIT_INFRA_PROMPT.md': {
    proposedState: 'DEPRECATED',
    rationale: 'Legacy audit prompt superseded by QA skills and repository validation gates',
    authority: 'Governance and certification',
    owner: 'Governance',
    cadence: 'Each policy change and quarterly audit',
    action: 'ARCHIVE_AFTER_REFERENCE_MIGRATION',
  },
  '04-governance/AUDIT_UI_PROMPT.md': {
    proposedState: 'CANONICAL',
    rationale: 'Frontend audit authority aligned to tracks and Playwright visual evidence',
    authority: 'Governance and certification',
    owner: 'Governance',
    cadence: 'Each policy change and quarterly audit',
    action: 'ALIGNED_WITH_TRACKS_AND_PLAYWRIGHT',
  },
  '04-governance/COMPONENT_LIFECYCLE.md': {
    proposedState: 'CANONICAL',
    rationale: 'Component certification lifecycle and gate authority',
    authority: 'Governance and certification',
    owner: 'Governance',
    cadence: 'Each policy change and quarterly audit',
    action: 'ALIGNED_WITH_TRACKS_AND_PLAYWRIGHT',
  },
  '04-governance/FRONT_CERTIFICATION_CHECKLIST.md': {
    proposedState: 'CANONICAL',
    rationale: 'Frontend certification gate aligned to registry, tracks, and Playwright',
    authority: 'Governance and certification',
    owner: 'Governance',
    cadence: 'Each policy change and quarterly audit',
    action: 'ALIGNED_WITH_TRACKS_AND_PLAYWRIGHT',
  },
  '04-governance/INFRA_CERTIFICATION_CHECKLIST.md': {
    proposedState: 'DEPRECATED',
    rationale: 'Legacy certification checklist superseded by infrastructure skill gates and tracks',
    authority: 'Governance and certification',
    owner: 'Governance',
    cadence: 'Each policy change and quarterly audit',
    action: 'ARCHIVE_AFTER_REFERENCE_MIGRATION',
  },
  '04-governance/JSCPD_EXCEPTIONS.md': {
    proposedState: 'CANONICAL',
    rationale: 'Current duplication exceptions and review ownership',
    authority: 'Governance and certification',
    owner: 'Governance',
    cadence: 'Each quality baseline change',
    action: 'REVIEW_CURRENT_EXCEPTIONS',
  },
  '05-operations/BRAND_HUB_DOMAIN.md': {
    proposedState: 'DEPRECATED',
    rationale: 'Brand Hub domain document does not represent the current product direction',
    authority: 'Suite product documentation',
    owner: 'Domain owner',
    cadence: 'No new content',
    action: 'ARCHIVE_AND_REDEFINE_LATER',
  },
  '05-operations/ENGINEERING_LOG.md': {
    proposedState: 'ACTIVE',
    rationale: 'Operational engineering history and audit trail',
    authority: 'Operations and engineering history',
    owner: 'Platform',
    cadence: 'Each operational or execution change',
    action: 'REVIEW_RETENTION_POLICY',
  },
  '05-operations/FRONT_ENGINEERING_PROMPT.md': {
    proposedState: 'CANONICAL',
    rationale: 'Frontend execution authority aligned to tracks, registry JSON, and Playwright',
    authority: 'Operations and engineering history',
    owner: 'Platform',
    cadence: 'Each component or design-system change',
    action: 'ALIGNED_WITH_CONFIRMED_AUTHORITIES',
  },
  '05-operations/INFRA_ENGINEERING_PROMPT.md': {
    proposedState: 'DEPRECATED',
    rationale: 'Legacy infrastructure prompt superseded by the self-contained infrastructure skill',
    authority: 'Operations and engineering history',
    owner: 'Platform',
    cadence: 'Each architecture or contract change',
    action: 'ARCHIVE_AFTER_REFERENCE_MIGRATION',
  },
  '05-operations/OPERATIONAL_AI_TEMPLATES.md': {
    proposedState: 'CANONICAL',
    rationale: 'Operational AI templates aligned to tracks and current evidence sources',
    authority: 'Operations and engineering history',
    owner: 'Platform',
    cadence: 'Each operational or execution change',
    action: 'ALIGNED_WITH_TRACKS',
  },
  '05-operations/ORCHESTRATOR_COMMANDS.md': {
    proposedState: 'CANONICAL',
    rationale: 'Orchestrator command authority aligned to tracks and canonical registries',
    authority: 'Operations and engineering history',
    owner: 'Platform',
    cadence: 'Each operational or execution change',
    action: 'ALIGNED_WITH_TRACKS',
  },
  '05-operations/ROADMAP_BRAND_HUB.md': {
    proposedState: 'DEPRECATED',
    rationale: 'Execution roadmap superseded by tracks; migrate any current milestones before archiving',
    authority: 'Delivery execution and phase status',
    owner: 'Governance',
    cadence: 'No new content',
    action: 'ARCHIVE_WITHOUT_MIGRATING_MILESTONES',
  },
  '06-ai-skills/README.md': {
    proposedState: 'NAVIGATION',
    rationale: 'AI Skills framework index and routing overview',
    authority: 'AI skills and agent behavior',
    owner: 'AI Platform',
    cadence: 'Each skill or routing change',
    action: 'ALIGNED_WITH_CURRENT_SKILLS',
  },
  'archive/ai-skills/2026-08-13/ARCHITECTURE_REVIEW_SKILL.md': {
    proposedState: 'HISTORICAL',
    rationale: 'Superseded by repository operational Skills and retained for provenance',
    authority: 'AI skills and agent behavior',
    owner: 'AI Platform',
    cadence: 'No new content',
    action: 'ARCHIVE_WITHOUT_MIGRATING_MILESTONES',
  },
  'archive/ai-skills/2026-08-13/PERFORMANCE_OPTIMIZATION_SKILL.md': {
    proposedState: 'HISTORICAL',
    rationale: 'Superseded by validation-framework and retained for provenance',
    authority: 'AI skills and agent behavior',
    owner: 'AI Platform',
    cadence: 'No new content',
    action: 'ARCHIVE_WITHOUT_MIGRATING_MILESTONES',
  },
  'archive/ai-skills/2026-08-13/RELEASE_READINESS_SKILL.md': {
    proposedState: 'HISTORICAL',
    rationale: 'Superseded by git-workflow, track-governance, and validation-framework',
    authority: 'AI skills and agent behavior',
    owner: 'AI Platform',
    cadence: 'No new content',
    action: 'ARCHIVE_WITHOUT_MIGRATING_MILESTONES',
  },
  '06-ai-skills/tier-3-governance/SECURITY_AUDIT_SKILL.md': {
    proposedState: 'CANONICAL',
    rationale: 'Security and organization-isolation audit guidance; scanner commands require repository verification',
    authority: 'AI skills and agent behavior',
    owner: 'AI Platform',
    cadence: 'Each security or tenancy change',
    action: 'UPDATE_AND_VALIDATE_COMMANDS',
  },
};

const entries = walk(docsRoot)
  .map((filePath) => path.relative(docsRoot, filePath))
  .filter((relativePath) => relativePath !== '04-governance/DOCUMENTATION_REVIEW_INVENTORY.md')
  .filter((relativePath) => /\.(md|json)$/i.test(relativePath))
  .sort((left, right) => left.localeCompare(right))
  .map((relativePath) => {
    const normalizedPath = relativePath.replaceAll(path.sep, '/');
    const override = reviewedOverrides[normalizedPath];
    const [classifiedState, classifiedRationale] = classify(relativePath);
    const proposedState = override?.proposedState ?? classifiedState;
    const rationale = override?.rationale ?? classifiedRationale;
    const [classifiedAuthority, classifiedOwner, classifiedCadence] = ownershipFor(
      relativePath,
      proposedState,
    );
    const authority = override?.authority ?? classifiedAuthority;
    const owner = override?.owner ?? classifiedOwner;
    const cadence = override?.cadence ?? classifiedCadence;
    const action =
      override?.action ??
      (proposedState === 'HISTORICAL'
        ? 'RETAIN'
        : proposedState === 'FROZEN'
          ? 'VERIFY_REFERENCES_ONLY'
          : proposedState === 'NAVIGATION' || proposedState === 'CANONICAL'
            ? 'REVIEW'
            : 'REVIEW_AND_CLASSIFY');
    return {
      relativePath,
      proposedState,
      authority,
      owner,
      cadence,
      canonicalDestination:
        proposedState === 'DEPRECATED' || proposedState === 'DUPLICATE'
          ? 'tracks/ or docs/archive/'
          : `docs/${normalizedPath}`,
      action,
      rationale,
    };
  });

const pendingCount = entries.filter(
  ({ proposedState }) => proposedState === 'PENDING_REVIEW',
).length;
const lines = [
  '# Documentation Review Inventory',
  '',
  '> Generated by `scripts/docs/generate-documentation-review-inventory.mjs`.',
  '> `PENDING_REVIEW` entries require content, authority, ownership, and',
  '> reference review before the documentation migration track can close.',
  '',
  `- Total files inventoried: ${entries.length}`,
  `- Pending content review: ${pendingCount}`,
  '- Frozen strategic documents are listed for completeness and must not be edited.',
  '- Archived files are retained as historical evidence and are not candidates for content refresh.',
  '',
  '| Path | Proposed state | Review status | Authority | Owner | Review cadence | Canonical destination | Action | Rationale |',
  '| --- | --- | --- | --- | --- | --- | --- | --- | --- |',
  ...entries.map(
    ({
      relativePath,
      proposedState,
      authority,
      owner,
      cadence,
      canonicalDestination,
      action,
      rationale,
    }) =>
      `| \`docs/${relativePath.replaceAll(path.sep, '/')}\` | ${proposedState} | ${proposedState === 'PENDING_REVIEW' ? 'PENDING' : 'CLASSIFIED'} | ${authority} | ${owner} | ${cadence} | \`${canonicalDestination}\` | ${action} | ${rationale} |`,
  ),
  '',
];
const output = `${lines.join('\n')}`;

if (checkOnly) {
  const current = fs.existsSync(outputPath)
    ? fs.readFileSync(outputPath, 'utf8')
    : null;
  if (current !== output) {
    console.error('Documentation review inventory is out of date.');
    process.exitCode = 1;
  } else {
    console.log('Documentation review inventory is up to date.');
  }
} else {
  fs.writeFileSync(outputPath, output);
  console.log(`Generated ${path.relative(repositoryRoot, outputPath)}.`);
}
