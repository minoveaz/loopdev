import { describe, it, expect } from 'vitest';
import { RulesEngineSchema, RuleDefinitionSchema } from '../rules.schema';

describe('Rules Engine Schema Contracts', () => {
  describe('RuleDefinitionSchema', () => {
    it('accepts a visual contrast rule with enforcement and approval metadata', () => {
      const validRule = {
        id: 'r1',
        name: 'Contrast Check',
        domain: 'visual',
        status: 'active',
        scope: { target: 'colorToken', filter: 'role == "bg"' },
        logic: { metric: 'contrastRatio', operator: '<', threshold: 4.5 },
        enforcement: { severity: 'BLOCK', blockPublish: true, requiresAck: true },
        approval: { required: true, approverRole: 'design' },
        explain: {
          why: 'Reason',
          risk: 'Risk',
          howToFix: 'Fix',
        },
        updatedAt: new Date().toISOString(),
      };

      const result = RuleDefinitionSchema.safeParse(validRule);
      expect(result.success).toBe(true);
    });

    it('rejects rule definitions with unsupported logic operators', () => {
      const invalidRule = {
        id: 'r2',
        name: 'Bad Rule',
        domain: 'identity',
        scope: { target: 'claim' },
        logic: { metric: 'words', operator: 'INVALID_OP', threshold: 10 }, // Invalid op
        enforcement: { severity: 'WARN' },
        explain: { why: 'W', risk: 'R', howToFix: 'F' },
        updatedAt: new Date().toISOString(),
      };
      const result = RuleDefinitionSchema.safeParse(invalidRule);
      expect(result.success).toBe(false);
    });
  });

  describe('RulesEngineSchema', () => {
    it('applies default publish-blocking and acknowledgment policies', () => {
      const minimalEngine = {
        rules: [],
      };
      const result = RulesEngineSchema.parse(minimalEngine);
      expect(result.globalPolicy.blockAlwaysPreventsPublish).toBe(true);
      expect(result.globalPolicy.warnRequiresAcknowledgment).toBe(true);
    });

    it('accepts a rules engine containing configured rule definitions', () => {
      const engine = {
        rules: [
          {
            id: 'r1',
            name: 'Rule 1',
            domain: 'visual',
            status: 'active',
            scope: { target: 't' },
            logic: { metric: 'm', operator: '==', threshold: 1 },
            enforcement: { severity: 'BLOCK', blockPublish: true, requiresAck: true },
            approval: { required: false },
            explain: { why: 'y', risk: 'r', howToFix: 'h' },
            updatedAt: new Date().toISOString(),
          },
        ],
      };
      const result = RulesEngineSchema.safeParse(engine);
      expect(result.success).toBe(true);
    });
  });
});
