/**
 * @file IconRegistry
 * @description Centralized inventory of approved icons for the LoopDev ecosystem.
 * @category Foundations
 * @status stable
 */

export const ICON_REGISTRY = {
  navigation: {
    home: 'home',
    dashboard: 'dashboard',
    settings: 'settings',
    user: 'person',
    science: 'science',
    lab: 'biotech'
  },
  actions: {
    add: 'add',
    edit: 'edit',
    delete: 'delete',
    save: 'save',
    search: 'search',
    close: 'close',
    share: 'share',
    copy: 'content_copy',
    more_vert: 'more_vert'
  },
  status: {
    success: 'check_circle',
    error: 'error',
    warning: 'warning',
    info: 'info',
    bolt: 'bolt',
    ai: 'auto_awesome'
  }
} as const;

export type IconName = string; // Future: extract from ICON_REGISTRY keys
