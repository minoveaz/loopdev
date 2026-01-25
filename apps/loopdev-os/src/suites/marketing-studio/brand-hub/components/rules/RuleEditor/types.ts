import { RuleDefinition } from '@loopdev/contracts';

export interface RuleEditorProps {
  /** The rule data to edit/view */
  rule: RuleDefinition;
  /** Whether the editor is in an editable state (Draft mode) */
  isEditable?: boolean;
  /** Callback triggered when a field changes */
  onChange?: (updatedRule: RuleDefinition) => void;
  /** Callback triggered when the rule is saved */
  onSave?: (updatedRule: RuleDefinition) => void;
}
