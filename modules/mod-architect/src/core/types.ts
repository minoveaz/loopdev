/**
 * @file types.ts
 * @description Core definitions for the Architect Module.
 * Defines the contract between Legacy Code (Blueprints) and the Design System.
 */

export type BlueprintStatus = 'pending' | 'in-review' | 'approved' | 'rejected';

export interface Blueprint {
  id: string;
  name: string;
  sourcePath: string; // e.g., "mock-loopdev/pages/Dashboard.tsx"
  category: 'layout' | 'component' | 'page';
  status: BlueprintStatus;
  detectedPatterns: string[]; // e.g., ["hardcoded-color", "inline-style"]
  snapshotUrl?: string; // URL to the visual capture
}

export interface MigrationStats {
  totalBlueprints: number;
  migratedCount: number;
  complianceScore: number; // 0-100%
}
