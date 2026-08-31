import { describe, expect, it } from 'vitest';
import {
  createActivityDeepLink,
  createChatDeepLink,
  createProfileDeepLink,
  createSquadDeepLink,
  isValidKebabSlug,
  isValidUserHandle,
  LOOPDEV_DEEP_LINK_PATTERNS,
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
});
