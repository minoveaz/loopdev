import { RuleDefinition } from '@loopdev/contracts';

export interface RuleRowProps {
  rule: RuleDefinition;
  isSelected?: boolean;
  onClick?: () => void;
}
