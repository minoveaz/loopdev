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
 * Genera un slug semántico enriquecido con SEO y palabras clave para una actividad:
 * Ejemplo: "Running 8K por Parque del Retiro", "act_1" ➔ "running-8k-por-parque-del-retiro-act_1"
 */
export function createActivitySemanticSlug(title: string, activityId: string): string {
  const baseSlug = slugifyText(title);
  if (!baseSlug) return activityId;
  if (baseSlug.endsWith(activityId.toLowerCase())) return baseSlug;
  return `${baseSlug}-${activityId}`;
}

/**
 * Extrae el ID canónico de una actividad a partir de su slug o parámetro de ruta:
 * - "running-8k-por-parque-del-retiro-act_1" ➔ "act_1"
 * - "act_1" ➔ "act_1"
 */
export function extractActivityIdFromSlug(slugOrId: string): string {
  if (!slugOrId) return '';
  const lower = slugOrId.toLowerCase();
  const idx = lower.lastIndexOf('act_');
  if (idx !== -1) {
    const candidate = slugOrId.slice(idx);
    // Safe deterministic O(k) validation of ID characters (avoiding polynomial regex backtracking)
    let isValid = true;
    for (let i = 4; i < candidate.length; i++) {
      const code = candidate.charCodeAt(i);
      const isAlphaNum =
        (code >= 48 && code <= 57) || // 0-9
        (code >= 65 && code <= 90) || // A-Z
        (code >= 97 && code <= 122) || // a-z
        code === 45 || // -
        code === 95; // _
      if (!isAlphaNum) {
        isValid = false;
        break;
      }
    }
    if (isValid && candidate.length > 4) {
      return candidate;
    }
  }
  return slugOrId;
}

/**
 * Genera la URL canónica de Deep Link para una actividad / entreno.
 */
export function createActivityDeepLink(activityId: string, title?: string, basePath = '#/app/activity'): string {
  const slug = title ? createActivitySemanticSlug(title, activityId) : activityId;
  return `${basePath}/${slug}`;
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

/**
 * Convierte cualquier texto en un slug kebab-case limpio:
 * - Normaliza acentos y caracteres especiales (Retiró ➔ retiro, Pádel ➔ padel)
 * - Elimina caracteres no alfanuméricos
 * - Colapsa espacios y guiones
 */
export function slugifyText(text: string): string {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Genera un slug garantizado único para Squads y Comunidades:
 * Si el slug base ya existe en `existingSlugs`, genera automáticamente un sufijo corto no invasivo (ej: retiro-morning-runners-7k2p).
 */
export function generateUniqueSlug(title: string, existingSlugs: string[] = [], customSuffix?: string): string {
  const base = slugifyText(title) || 'squad';
  if (!existingSlugs.includes(base)) {
    return base;
  }
  const suffix = customSuffix || Math.random().toString(36).substring(2, 6);
  return `${base}-${suffix}`;
}
