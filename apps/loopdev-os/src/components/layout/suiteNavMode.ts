import type { NavMode } from '@loopdev/contracts';

export interface SuiteNavModePolicy {
  /** Rutas relativas a la suite que representan trabajo operativo profundo. */
  railPrefixes: string[];
}

/**
 * Determina el modo del sidebar a partir de una política explícita de suite.
 * La raíz siempre muestra la navegación completa; los módulos operativos usan Rail.
 */
export function getSuiteNavMode(pathname: string, policy: SuiteNavModePolicy): NavMode {
  const normalizedPath = pathname.replace(/\/$/, '') || '/';
  const isOperationalRoute = policy.railPrefixes.some((prefix) => {
    const normalizedPrefix = prefix.replace(/\/$/, '');
    return normalizedPath === normalizedPrefix || normalizedPath.startsWith(`${normalizedPrefix}/`);
  });

  return isOperationalRoute ? 'rail' : 'expanded';
}
