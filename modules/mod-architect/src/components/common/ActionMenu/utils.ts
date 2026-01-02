/**
 * @file utils.ts
 * @description Semantic style mappers for ActionMenu.
 * Uses CSS variables to ensure compatibility with Tenant branding.
 */

export const getItemStyles = (variant: string = 'neutral') => {
  const base = "transition-colors duration-200";
  
  switch (variant) {
    case 'danger':
      return `${base} text-[var(--lpd-color-brand-danger,#ef4444)] hover:bg-red-50 dark:hover:bg-red-900/20`;
    case 'primary':
      return `${base} text-[var(--lpd-color-brand-primary,#135bec)] hover:bg-[var(--lpd-color-brand-primary)]/5`;
    case 'success':
      return `${base} text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20`;
    default:
      return `${base} text-[var(--lpd-color-text-base)] hover:bg-[var(--lpd-color-bg-subtle)]`;
  }
};