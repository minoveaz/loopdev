import { useState, useEffect } from 'react';
import type { Blueprint, MigrationStats } from '../core/types';

/**
 * @file useArchitectRegistry.ts
 * @description The "Brain" of the Architect.
 * Manages the list of legacy blueprints detected in the system.
 */

const MOCK_BLUEPRINTS: Blueprint[] = [
  {
    id: 'bp-001',
    name: 'Old Dashboard Card',
    sourcePath: 'mock-loopdev/components/Card.tsx',
    category: 'component',
    status: 'pending',
    detectedPatterns: ['hardcoded-color', 'flex-box-mess'],
  },
  {
    id: 'bp-002',
    name: 'Legacy Sidebar',
    sourcePath: 'mock-loopdev/components/Sidebar.tsx',
    category: 'layout',
    status: 'in-review',
    detectedPatterns: ['inline-style', 'missing-accessibility'],
  },
  {
    id: 'bp-003',
    name: 'Login Form V1',
    sourcePath: 'mock-loopdev/pages/Login.tsx',
    category: 'page',
    status: 'approved',
    detectedPatterns: [],
  }
];

export const useArchitectRegistry = () => {
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<MigrationStats>({
    totalBlueprints: 0,
    migratedCount: 0,
    complianceScore: 0,
  });

  useEffect(() => {
    // Simulate async file system scanning
    const loadRegistry = async () => {
      await new Promise(resolve => setTimeout(resolve, 800)); // Fake latency
      
      setBlueprints(MOCK_BLUEPRINTS);
      
      // Calculate stats logic
      const approved = MOCK_BLUEPRINTS.filter(b => b.status === 'approved').length;
      setStats({
        totalBlueprints: MOCK_BLUEPRINTS.length,
        migratedCount: approved,
        complianceScore: Math.round((approved / MOCK_BLUEPRINTS.length) * 100) || 0,
      });
      
      setIsLoading(false);
    };

    loadRegistry();
  }, []);

  return { blueprints, stats, isLoading };
};
