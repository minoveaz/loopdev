'use client';

import React from 'react';
import { 
  TechnicalDropdown, 
  TechnicalMenuItem, 
  TechnicalDropdownSeparator, 
  TechnicalDropdownGroup,
  UserAvatar,
  TechnicalLabel,
  LpdText
} from '../../atoms';
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
  const { userSrc, onLogout, onProfileClick, onSettingsClick, onBillingClick } = props;
  const { 
    userName, 
    displayEmail, 
    formattedRole, 
    headerClasses 
  } = useUserMenu(props);

  return (
    <TechnicalDropdown 
      align="end" 
      trigger={
        <button className="rounded-full hover:ring-4 hover:ring-primary/5 transition-all duration-500">
          <UserAvatar 
            name={userName} 
            src={userSrc} 
            size="sm" 
            withStatus 
            status="online" 
          />
        </button>
      }
    >
      <div className="flex flex-col w-[240px] bg-white dark:bg-surface-elevated">
        {/* Identidad Estructural */}
        <div className="px-4 py-4 border-b border-border-technical bg-white dark:bg-surface-elevated">
          <LpdText size="xs" weight="bold" className="text-text-main dark:text-white">
            {userName.split('@')[0]}
          </LpdText>
          
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-micro font-mono text-text-muted truncate flex-1">
              {displayEmail}
            </span>
            <span className="flex items-center text-[10px] font-bold text-primary px-1.5 py-0.5 rounded bg-primary/5 border border-primary/10">
              {formattedRole}
            </span>
          </div>
        </div>

        {/* Acciones de Cuenta */}
        <div className="flex flex-col py-1">
          <TechnicalMenuItem 
            icon="User" 
            label="Profile" 
            shortcut="⌘P" 
            onClick={onProfileClick} 
          />
          <TechnicalMenuItem 
            icon="Settings" 
            label="Account Settings" 
            onClick={onSettingsClick} 
          />
          <TechnicalMenuItem 
            icon="CreditCard" 
            label="Billing" 
            onClick={onBillingClick} 
          />
        </div>

        <div className="border-t border-border-technical">
          <TechnicalMenuItem 
            icon="LogOut" 
            label="Sign Out" 
            variant="danger" 
            onClick={onLogout} 
          />
        </div>
      </div>
    </TechnicalDropdown>
  );
};
