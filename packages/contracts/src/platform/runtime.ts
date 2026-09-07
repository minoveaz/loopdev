import { z } from 'zod';
import type { SuiteKey } from './tenancy';

export const PlatformEnvironmentModeSchema = z.enum(['real', 'sandbox', 'preview']);
export type PlatformEnvironmentMode = z.infer<typeof PlatformEnvironmentModeSchema>;

export const PlatformNetworkPolicySchema = z.object({
  reads: z.enum(['remote', 'local']),
  writes: z.enum(['remote', 'local', 'blocked']),
});
export type PlatformNetworkPolicy = z.infer<typeof PlatformNetworkPolicySchema>;

export const PlatformPersistencePolicySchema = z.enum(['remote', 'local', 'none']);
export type PlatformPersistencePolicy = z.infer<typeof PlatformPersistencePolicySchema>;

export interface PlatformRuntimeContext {
  mode: PlatformEnvironmentMode;
  organizationId: string | null;
  workspaceId: string | null;
  permissions: readonly string[];
  network: PlatformNetworkPolicy;
  persistence: PlatformPersistencePolicy;
  reset: () => void | Promise<void>;
}

export interface PlatformDataAdapter<TEntity, TQuery = void> {
  list: (query: TQuery) => Promise<readonly TEntity[]>;
  get: (id: string) => Promise<TEntity | null>;
}

export interface PlatformCommandAdapter<TCommand, TResult> {
  execute: (command: TCommand) => Promise<TResult>;
}

export interface PlatformSeedPack<TState = unknown> {
  suiteKey: SuiteKey;
  version: string;
  create: () => TState;
}
