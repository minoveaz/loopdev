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
  },
  forms: {
    identity: 'badge',
    person: 'person',
    contactChannels: 'contact_phone',
    email: 'mail',
    phone: 'phone',
    organization: 'domain',
    company: 'business'
  }
} as const;

type IconCategory = keyof typeof ICON_REGISTRY;
export type IconName = {
  [Category in IconCategory]:
    (typeof ICON_REGISTRY)[Category][keyof (typeof ICON_REGISTRY)[Category]];
}[IconCategory];
