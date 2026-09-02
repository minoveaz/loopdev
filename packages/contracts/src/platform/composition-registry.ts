import type { CompositionRecipe, ViewComposition } from './composition';

export interface CompositionRecipeDefinition {
  allowedSlots: readonly string[];
  allowedComponents: readonly string[];
  maxRowSpan: number;
}

export const COMPOSITION_RECIPE_REGISTRY: Record<CompositionRecipe, CompositionRecipeDefinition> = {
  SuiteOverview: {
    allowedSlots: ['header', 'summary', 'visual-canvas', 'metrics', 'activity'],
    allowedComponents: ['StatusCardGroup', 'TechnicalCanvas', 'MetricCardGrid', 'ActivityFeed'],
    maxRowSpan: 3,
  },
  DataWorkspace: {
    allowedSlots: ['header', 'filters', 'content', 'pagination'],
    allowedComponents: ['FilterBar', 'DataTable', 'Pagination', 'EmptyState'],
    maxRowSpan: 1,
  },
  SplitWorkspace: {
    allowedSlots: ['header', 'list', 'detail', 'toolbar'],
    allowedComponents: ['DataTable', 'RecordPanel', 'ModuleToolbar'],
    maxRowSpan: 2,
  },
  RecordWorkspace: {
    allowedSlots: ['header', 'tabs', 'record', 'inspector', 'activity'],
    allowedComponents: ['RecordPanel', 'InspectorPanel', 'ActivityFeed'],
    maxRowSpan: 3,
  },
  BoardWorkspace: {
    allowedSlots: ['header', 'toolbar', 'board', 'metrics'],
    allowedComponents: ['ModuleToolbar', 'KanbanBoard', 'MetricCardGrid'],
    maxRowSpan: 4,
  },
  ImmersiveWorkflow: {
    allowedSlots: ['header', 'workflow', 'actions', 'status'],
    allowedComponents: ['WorkflowPanel', 'ActionBar', 'StatusCard'],
    maxRowSpan: 4,
  },
  CreativeEditor: {
    allowedSlots: ['stage', 'timeline', 'transport'],
    allowedComponents: ['VideoStage', 'Timeline', 'TransportControls'],
    maxRowSpan: 64,
  },
};

export interface CompositionValidationIssue {
  regionId: string;
  message: string;
}

export const validateCompositionAgainstRegistry = (
  composition: ViewComposition,
): CompositionValidationIssue[] => {
  const definition = COMPOSITION_RECIPE_REGISTRY[composition.recipe];
  const issues: CompositionValidationIssue[] = [];

  composition.regions.forEach((region) => {
    if (!definition.allowedSlots.includes(region.slot)) {
      issues.push({ regionId: region.id, message: `Slot "${region.slot}" is not allowed` });
    }
    if (!definition.allowedComponents.includes(region.component)) {
      issues.push({
        regionId: region.id,
        message: `Component "${region.component}" is not allowed`,
      });
    }
    if (region.rowSpan && region.rowSpan > definition.maxRowSpan) {
      issues.push({
        regionId: region.id,
        message: `rowSpan exceeds recipe maximum of ${definition.maxRowSpan}`,
      });
    }
  });

  return issues;
};
