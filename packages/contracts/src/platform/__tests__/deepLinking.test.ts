import { describe, expect, it } from 'vitest';
import {
  createActivityDeepLink,
  createActivitySemanticSlug,
  createChatDeepLink,
  createProfileDeepLink,
  createSquadDeepLink,
  extractActivityIdFromSlug,
  generateUniqueSlug,
  isValidKebabSlug,
  isValidUserHandle,
  LOOPDEV_DEEP_LINK_PATTERNS,
  slugifyText,
} from '../deepLinking';

describe('LoopDev Deep Linking Standard Contract', () => {
  it('validates user handles according to LoopDev standard', () => {
    expect(isValidUserHandle('alexrivera')).toBe(true);
    expect(isValidUserHandle('@sofiadiaz')).toBe(true);
    expect(isValidUserHandle('javi_padel35')).toBe(true);
    expect(isValidUserHandle('marta.soler-2026')).toBe(true);

    // Invalid handles
    expect(isValidUserHandle('')).toBe(false);
    expect(isValidUserHandle('ab')).toBe(false); // Too short (< 3)
    expect(isValidUserHandle('alex rivera')).toBe(false); // Spaces forbidden
    expect(isValidUserHandle('alex!#$')).toBe(false); // Special chars forbidden
  });

  it('validates kebab slugs for squads and communities', () => {
    expect(isValidKebabSlug('retiro-morning-runners')).toBe(true);
    expect(isValidKebabSlug('padel-chamartin')).toBe(true);
    expect(isValidKebabSlug('sierra-guadarrama-hikers')).toBe(true);

    // Invalid slugs
    expect(isValidKebabSlug('Retiro_Morning')).toBe(false);
    expect(isValidKebabSlug('-squad-')).toBe(false);
    expect(isValidKebabSlug('squad with spaces')).toBe(false);
  });

  it('generates canonical deep link URLs', () => {
    expect(createProfileDeepLink('alexrivera')).toBe('#/app/profile/alexrivera');
    expect(createProfileDeepLink('@sofiadiaz')).toBe('#/app/profile/sofiadiaz');
    expect(createActivityDeepLink('act_849201')).toBe('#/app/activity/act_849201');
    expect(createSquadDeepLink('retiro-morning-runners')).toBe('#/app/squad/retiro-morning-runners');
    expect(createChatDeepLink('chat_retiro_8k')).toBe('#/app/chats/chat_retiro_8k');
    expect(createChatDeepLink()).toBe('#/app/chats');
  });

  it('defines the standard deep link pattern dictionary', () => {
    expect(LOOPDEV_DEEP_LINK_PATTERNS.userProfile.idFormat).toBe('handle');
    expect(LOOPDEV_DEEP_LINK_PATTERNS.activityDetail.idFormat).toBe('prefixed-nanoid');
    expect(LOOPDEV_DEEP_LINK_PATTERNS.squadHub.idFormat).toBe('kebab-slug');
    expect(LOOPDEV_DEEP_LINK_PATTERNS.chatConversation.idFormat).toBe('prefixed-nanoid');
  });

  it('transforms plain titles with accents into clean kebab-case slugs', () => {
    expect(slugifyText('Retiro Morning Runners')).toBe('retiro-morning-runners');
    expect(slugifyText('Cuarteto Pádel Chamartín & Amigos!')).toBe('cuarteto-padel-chamartin-amigos');
    expect(slugifyText('  Ruta Sierra de Guadarrama  ')).toBe('ruta-sierra-de-guadarrama');
    expect(slugifyText('')).toBe('');
  });

  it('resolves duplicate squad slug collisions by appending a non-invasive unique suffix', () => {
    const existing = ['retiro-morning-runners', 'padel-chamartin'];

    // First time squad name -> clean slug
    expect(generateUniqueSlug('Sierra Hikers', existing)).toBe('sierra-hikers');

    // Duplicate squad name -> clean slug with custom or random unique suffix
    const duplicateSlug = generateUniqueSlug('Retiro Morning Runners', existing, '7k2p');
    expect(duplicateSlug).toBe('retiro-morning-runners-7k2p');

    // Automatic random suffix when colliding
    const autoSuffixSlug = generateUniqueSlug('Pádel Chamartín', existing);
    expect(autoSuffixSlug.startsWith('padel-chamartin-')).toBe(true);
    expect(autoSuffixSlug.length).toBeGreaterThan('padel-chamartin-'.length);
  });

  it('builds and parses SEO-friendly semantic activity slugs', () => {
    // Generate semantic slug with keywords
    const semanticSlug = createActivitySemanticSlug('Running 8K por Parque del Retiro', 'act_1');
    expect(semanticSlug).toBe('running-8k-por-parque-del-retiro-act_1');

    // Deep link with semantic slug
    expect(createActivityDeepLink('act_1', 'Running 8K por Parque del Retiro')).toBe('#/app/activity/running-8k-por-parque-del-retiro-act_1');

    // Extract raw activity ID from semantic slug
    expect(extractActivityIdFromSlug('running-8k-por-parque-del-retiro-act_1')).toBe('act_1');
    expect(extractActivityIdFromSlug('partida-padel-chamartin-act_9824')).toBe('act_9824');
    expect(extractActivityIdFromSlug('act_1')).toBe('act_1');
  });
});
