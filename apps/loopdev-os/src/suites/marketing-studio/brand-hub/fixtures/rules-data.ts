import { RulesEngine } from '@loopdev/contracts';

/**
 * Official LoopDev Governance Rules.
 * Built for machine-executable brand safety.
 */
export const LOOPDEV_RULES_ENGINE: RulesEngine = {
  rules: [
    {
      id: 'r1',
      name: 'WCAG Contrast — Body Text',
      domain: 'visual',
      status: 'active',
      scope: { target: 'colorToken', filter: "role == 'bg'" },
      logic: { metric: 'contrastRatio', operator: '<', threshold: 4.5 },
      enforcement: { severity: 'BLOCK', blockPublish: true, requiresAck: true, allowOverride: false },
      approval: { required: true, approverRole: 'design' },
      explain: {
        why: "Low contrast reduces readability for users with visual impairments.",
        risk: "WCAG 2.1 AA failure. High bounce rate from mobile users.",
        howToFix: "Increase the contrast ratio above 4.5:1 or use the standard surface.canvas background.",
        doExample: "White text over Loop Blue (#135BEC)",
        dontExample: "Light Grey text over White background"
      },
      updatedAt: new Date().toISOString(),
      updatedBy: 'System'
    },
    {
      id: 'r2',
      name: 'Forbidden Language — Absolute Claims',
      domain: 'identity',
      status: 'active',
      scope: { target: 'claim', filter: 'context == "marketing"' },
      logic: { metric: 'forbiddenWords', operator: 'contains', threshold: ['guaranteed', 'perfect', 'never'] },
      enforcement: { severity: 'BLOCK', blockPublish: true, requiresAck: true, allowOverride: true },
      approval: { required: true, approverRole: 'legal' },
      explain: {
        why: "Absolute claims create legal liability and reduce brand trust through hyperbole.",
        risk: "FTC/EU compliance audit failure. Brand perceived as 'marketing-heavy' rather than 'engineering-first'.",
        howToFix: "Use soft indicators like 'Optimized', 'Designed for', or 'Consistent'.",
        doExample: "Designed for 99.9% uptime",
        dontExample: "Guaranteed 100% success"
      },
      updatedAt: new Date().toISOString(),
      updatedBy: 'Legal_Bot'
    },
    {
      id: 'r3',
      name: 'Minimum Font Size (Mobile)',
      domain: 'typography',
      status: 'active',
      scope: { target: 'fontScale', filter: 'device == "mobile"' },
      logic: { metric: 'fontSize', operator: '<', threshold: 14 },
      enforcement: { severity: 'WARN', blockPublish: false, requiresAck: true, allowOverride: true },
      approval: { required: false },
      explain: {
        why: "Small font sizes significantly impact mobile accessibility.",
        risk: "Poor user experience on small screens. Accessibility score reduction.",
        howToFix: "Ensure the base font size for body text is at least 14px (ideally 16px).",
        doExample: "Body text at 16px",
        dontExample: "Captions at 10px for main content"
      },
      updatedAt: new Date().toISOString(),
      updatedBy: 'System'
    }
  ],
  globalPolicy: {
    blockAlwaysPreventsPublish: true,
    warnRequiresAcknowledgment: true
  }
};
