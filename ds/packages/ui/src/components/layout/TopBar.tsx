import React from 'react';
import { useTenant } from '@/providers/tenant-provider';
import { TENANT_DATA } from '@/data/tenants';
import { Inline, Stack, SafeArea, Box } from './foundations';
import { Bell, User, Search, Menu } from 'lucide-react';

export interface TopBarProps {
  onMenuClick?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  const { tenant, subbrand } = useTenant();
  const data = TENANT_DATA[tenant];

  return (
    <SafeArea top as="header" className="sticky top-0 z-40 w-full border-b bg-[var(--lpd-color-bg-base)] border-[var(--lpd-color-border-subtle)]">
      <Box className="h-16 px-4 md:px-6">
        <Inline justify="between" align="center" className="h-full" gap={4} wrap={false}>
          
          {/* LEFT: Identity & Mobile Toggle */}
          <Inline gap={4} wrap={false} className="shrink-0">
            <button 
              onClick={onMenuClick}
              className="p-2 md:hidden hover:bg-[var(--lpd-color-bg-subtle)] rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Inline gap={2} wrap={false}>
              <Box background="primary" radius="md" className="w-8 h-8 flex items-center justify-center text-white font-bold shrink-0">
                {data.name.charAt(0)}
              </Box>
              <Stack gap={0} className="hidden sm:flex shrink-0">
                <h2 className="font-bold text-sm leading-none">{data.name}</h2>
                {subbrand !== 'none' && (
                  <p className="text-[10px] text-[var(--lpd-color-text-muted)] capitalize truncate max-w-[120px]">
                    {subbrand.replace(/-/g, ' ')}
                  </p>
                )}
              </Stack>
            </Inline>
          </Inline>

          {/* CENTER: Global Search (Agnostic) */}
          <Box className="hidden md:flex flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--lpd-color-text-muted)]" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full h-9 pl-10 pr-4 rounded-full bg-[var(--lpd-color-bg-subtle)] border-none text-sm focus:ring-2 focus:ring-[var(--lpd-color-primary)] transition-all"
            />
          </Box>

          {/* RIGHT: User Actions */}
          <Inline gap={2} align="center" className="shrink-0">
            <button className="p-2 hover:bg-[var(--lpd-color-bg-subtle)] rounded-full transition-colors relative">
              <Bell className="w-5 h-5 text-[var(--lpd-color-text-muted)]" />
              <Box className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--lpd-color-bg-base)]" />
            </button>
            <Inline gap={2} align="center" className="pl-2 border-l ml-2">
              <Box background="subtle" radius="full" className="w-8 h-8 flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </Box>
              <span className="hidden lg:block text-xs font-medium truncate max-w-[100px]">Admin User</span>
            </Inline>
          </Inline>

        </Inline>
      </Box>
    </SafeArea>
  );
};
