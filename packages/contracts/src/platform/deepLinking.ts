/**
 * @file deepLinking.ts
 * @description Estándar Canónico de LoopDev para Deep Linking, Slugs y Convenciones de URLs.
 *
 * Define la estructura y validación de URLs e identificadores para todas las aplicaciones
 * de producto (CIMO, ProtegeTuSalud, CRM, Marketing Studio).
 *
 * Reglas del Estándar LoopDev:
 * 1. Perfiles de Usuario / Atletas: Handles memorables (@username / slug) o fallback `usr_[nanoid]`.
 * 2. Entrenos / Actividades / Eventos: Prefijo semántico + identificador anti-scraping (`act_[nanoid]`).
 * 3. Micro-comunidades / Squads / Clubs: Slugs en kebab-case (`retiro-morning-runners`) o `sq_[nanoid]`.
 * 4. Chats / Canales: `chat_[id]` o `dm_[userA]_[userB]`.
 */

export interface DeepLinkPattern {
  entityType: 'user' | 'activity' | 'squad' | 'chat' | 'event';
  urlPrefix: string;
  idFormat: 'handle' | 'prefixed-nanoid' | 'kebab-slug' | 'uuid';
  example: string;
}

export const LOOPDEV_DEEP_LINK_PATTERNS: Record<string, DeepLinkPattern> = {
  userProfile: {
    entityType: 'user',
    urlPrefix: '/app/profile/',
    idFormat: 'handle',
    example: '/app/profile/alexrivera',
  },
  activityDetail: {
    entityType: 'activity',
    urlPrefix: '/app/activity/',
    idFormat: 'prefixed-nanoid',
    example: '/app/activity/act_849201',
  },
  squadHub: {
    entityType: 'squad',
    urlPrefix: '/app/squad/',
    idFormat: 'kebab-slug',
    example: '/app/squad/retiro-morning-runners',
  },
  chatConversation: {
    entityType: 'chat',
    urlPrefix: '/app/chats/',
    idFormat: 'prefixed-nanoid',
    example: '/app/chats/chat_retiro_8k',
  },
};

/**
 * Valida si un handle de usuario cumple las normas estándar de LoopDev:
 * - 3 a 30 caracteres
 * - Alfanumérico, guiones bajos o puntos
 * - Cero espacios ni caracteres especiales inseguros
 */
export function isValidUserHandle(handle: string): boolean {
  if (!handle) return false;
  const clean = handle.startsWith('@') ? handle.slice(1) : handle;
  return /^[a-zA-Z0-9._-]{3,30}$/.test(clean);
}

/**
 * Valida si un slug de squad/comunidad cumple el formato kebab-case estándar:
 */
export function isValidKebabSlug(slug: string): boolean {
  if (!slug) return false;
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug);
}

/**
 * Genera la URL canónica de Deep Link para un perfil de usuario.
 */
export function createProfileDeepLink(handleOrId: string, basePath = '#/app/profile'): string {
  const clean = handleOrId.replace(/^@/, '');
  return `${basePath}/${clean}`;
}

/**
 * Genera la URL canónica de Deep Link para una actividad / entreno.
 */
export function createActivityDeepLink(activityId: string, basePath = '#/app/activity'): string {
  return `${basePath}/${activityId}`;
}

/**
 * Genera la URL canónica de Deep Link para un Squad Hub.
 */
export function createSquadDeepLink(squadSlugOrId: string, basePath = '#/app/squad'): string {
  return `${basePath}/${squadSlugOrId}`;
}

/**
 * Genera la URL canónica de Deep Link para un Chat.
 */
export function createChatDeepLink(chatId?: string, basePath = '#/app/chats'): string {
  return chatId ? `${basePath}/${chatId}` : basePath;
}
