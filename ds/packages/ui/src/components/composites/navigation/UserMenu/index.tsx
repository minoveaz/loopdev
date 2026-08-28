'use client';

import React, { useState } from 'react';
import {
  TechnicalDropdown,
  TechnicalMenuItem,
  TechnicalDropdownItem,
  TechnicalDropdownSeparator,
  TechnicalDropdownSubmenu,
  UserAvatar,
  LpdText,
} from '../../../atoms';
import { UserMenuProps } from './types';
import { useUserMenu } from './useUserMenu';

/**
 * @component UserMenu
 * @description Centro de gestión de perfil y sesión.
 * Integra identidad de usuario con controles de plataforma.
 * @category Composites
 * @phase 1
 */
export const UserMenu: React.FC<UserMenuProps> = (props) => {
  const {
    userSrc,
    tenantName,
    onLogout,
    onAvatarClick,
    onProfileClick,
    onSettingsClick,
    onBillingClick,
    onOpenChange,
    timezoneOptions,
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const { userName, displayEmail, formattedRole, headerClasses } = useUserMenu(props);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange?.(open);
  };

  const avatarTrigger = (
    <button
      type="button"
      className="hover:border-accent/50 hover:ring-accent/5 dark:hover:border-accent/50 dark:hover:ring-accent/10 flex h-9 w-9 items-center justify-center rounded-full border border-black/10 p-0.5 transition-all duration-500 hover:ring-4 dark:border-white/10"
      aria-label={onAvatarClick ? 'Open profile' : 'Abrir menú de usuario'}
      onClick={onAvatarClick}
    >
      <UserAvatar name={userName} src={userSrc} size="sm" withStatus status="online" />
    </button>
  );

  if (onAvatarClick) return avatarTrigger;

  return (
    <TechnicalDropdown
      align="end"
      open={isOpen}
      onOpenChange={handleOpenChange}
      trigger={avatarTrigger}
    >
      <div className="dark:bg-surface-elevated flex flex-col bg-white">
        <div className={`${headerClasses} dark:bg-surface-elevated bg-white`}>
          <LpdText size="sm" weight="bold" className="text-text-main block dark:text-white">
            {userName.split('@')[0]}
          </LpdText>

          {tenantName && (
            <span className="text-text-muted truncate text-xs dark:text-slate-300">
              {tenantName}
            </span>
          )}

          <div className="mt-1 flex items-center gap-2">
            <span className="text-micro text-text-muted min-w-0 flex-1 truncate font-sans">
              {displayEmail}
            </span>
            <span className="border-primary/10 bg-primary/5 text-primary flex shrink-0 items-center rounded border px-1.5 py-0.5 text-[10px] font-bold">
              {formattedRole}
            </span>
          </div>
        </div>

        <div className="flex flex-col py-1">
          <TechnicalMenuItem icon="User" label="Profile" shortcut="⌘P" onClick={onProfileClick} />
          <TechnicalMenuItem icon="Settings" label="Account Settings" onClick={onSettingsClick} />
          <TechnicalMenuItem icon="CreditCard" label="Billing" onClick={onBillingClick} />
        </div>

        {timezoneOptions && timezoneOptions.length > 0 && (
          <>
            <TechnicalDropdownSeparator />
            <TechnicalDropdownSubmenu label="Timezone">
              {timezoneOptions.map((option) => (
                <TechnicalDropdownItem
                  key={option.label}
                  isActive={option.isActive}
                  onClick={option.onSelect}
                >
                  {option.label}
                </TechnicalDropdownItem>
              ))}
            </TechnicalDropdownSubmenu>
          </>
        )}

        <div className="border-border-technical border-t pt-1">
          <TechnicalMenuItem icon="LogOut" label="Sign Out" variant="danger" onClick={onLogout} />
        </div>
      </div>
    </TechnicalDropdown>
  );
};
