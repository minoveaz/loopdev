import React from 'react';
import { useTenant } from '../../providers/tenant-provider';
import { TENANT_DATA } from '../../data/tenants';
import { cn } from '../../helpers/cn';
import { Inline, Stack, SafeArea, Box } from '../../components/layout';
import { Bell, User, Search, Menu } from 'lucide-react';

export interface TopBarProps {
  children?: React.ReactNode;
  className?: string;
  onMenuClick?: () => void;
}

export const TopBarLeft: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <Inline gap={4} wrap={false} className={cn("shrink-0", className)}>
    {children}
  </Inline>
);

export const TopBarCenter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <Box className={cn("hidden md:flex flex-1 max-w-md relative", className)}>
    {children}
  </Box>
);

export const TopBarRight: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <Inline gap={2} align="center" className={cn("shrink-0", className)}>
    {children}
  </Inline>
);

export const TopBar: React.FC<TopBarProps> & {
  Left: typeof TopBarLeft;
  Center: typeof TopBarCenter;
  Right: typeof TopBarRight;
} = ({ children, className, onMenuClick }) => {
  const { tenant, subbrand } = useTenant();
  const data = TENANT_DATA[tenant];
  
  const headerStyle = data?.settings?.layout?.headerStyle || 'base';
  const isBrandStyle = headerStyle === 'brand';

  if (!data) return null;

  // If children are provided, we render a flexible TopBar
  if (children) {
    return (
      <SafeArea top as="header" className={cn(
        "sticky top-0 z-40 w-full border-b transition-colors duration-300",
        isBrandStyle 
          ? "bg-[var(--lpd-color-brand-primary)] border-black/5 text-[var(--lpd-color-text-base)] shadow-sm" 
          : "bg-[var(--lpd-color-bg-base)] border-[var(--lpd-color-border-subtle)] text-[var(--lpd-color-text-base)]",
        className
      )}>
        {!isBrandStyle && <div className="absolute top-0 left-0 right-0 h-0.5 bg-[var(--lpd-color-brand-primary)] opacity-70" />}
        <Box className="h-16 px-4 md:px-6">
          <Inline justify="between" align="center" className="h-full" gap={4} wrap={false}>
            {children}
          </Inline>
        </Box>
      </SafeArea>
    );
  }

  // Default legacy behavior
  return (
    <SafeArea top as="header" className={cn(
      "sticky top-0 z-40 w-full border-b transition-colors duration-300",
      isBrandStyle 
        ? "bg-[var(--lpd-color-brand-primary)] border-black/5 text-[var(--lpd-color-text-base)] shadow-sm" 
        : "bg-[var(--lpd-color-bg-base)] border-[var(--lpd-color-border-subtle)] text-[var(--lpd-color-text-base)]"
    )}>
      {!isBrandStyle && <div className="absolute top-0 left-0 right-0 h-0.5 bg-[var(--lpd-color-brand-primary)] opacity-70" />}
      
      <Box className="h-16 px-4 md:px-6">
        <Inline justify="between" align="center" className="h-full" gap={4} wrap={false}>
          
          <TopBarLeft>
            <button 
              onClick={onMenuClick}
              className={cn(
                "p-2 rounded-lg transition-colors",
                isBrandStyle ? "hover:bg-black/5" : "hover:bg-[var(--lpd-color-bg-subtle)]"
              )}
            >
              <Menu className="w-5 h-5" />
            </button>

            <Inline gap={2} wrap={false}>
              <Box background={isBrandStyle ? 'inverse' : 'primary'} radius="md" className="w-8 h-8 flex items-center justify-center font-bold shrink-0">
                {data.name.charAt(0)}
              </Box>
              <Stack gap={0} className="hidden sm:flex shrink-0">
                <h2 className="font-bold text-sm leading-none">{data.name}</h2>
                {subbrand !== 'none' && (
                  <p className={cn(
                    "text-[10px] capitalize truncate max-w-[120px] font-medium",
                    isBrandStyle ? "opacity-70" : "text-[var(--lpd-color-text-muted)]"
                  )}>
                    {subbrand.replace(/-/g, ' ')}
                  </p>
                )}
              </Stack>
            </Inline>
          </TopBarLeft>

          <TopBarCenter>
            <Search className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4",
              isBrandStyle ? "opacity-40" : "text-[var(--lpd-color-text-muted)]"
            )} />
            <input 
              type="text" 
              placeholder="Search..." 
              className={cn(
                "w-full h-9 pl-10 pr-4 rounded-full border-none text-sm transition-all shadow-inner",
                isBrandStyle 
                  ? "bg-black/5 text-[var(--lpd-color-text-base)] placeholder:text-black/30 focus:ring-black/10" 
                  : "bg-[var(--lpd-color-bg-subtle)] text-[var(--lpd-color-text-base)] focus:ring-[var(--lpd-color-brand-primary)]"
              )}
            />
          </TopBarCenter>

          <TopBarRight>
            <button className={cn(
              "p-2 rounded-full transition-colors relative",
              isBrandStyle ? "hover:bg-black/5" : "hover:bg-[var(--lpd-color-bg-subtle)]"
            )}>
              <Bell className={cn("w-5 h-5", isBrandStyle ? "opacity-70" : "text-[var(--lpd-color-text-muted)]")} />
              <Box className={cn(
                "absolute top-2 right-2 w-2 h-2 rounded-full border-2",
                isBrandStyle ? "bg-red-500 border-[var(--lpd-color-brand-primary)]" : "bg-red-500 border-[var(--lpd-color-bg-base)]"
              )} />
            </button>
            <Inline gap={2} align="center" className={cn(
              "pl-2 border-l ml-2",
              isBrandStyle ? "border-black/5" : "border-[var(--lpd-color-border-subtle)]"
            )}>
              <Box background={isBrandStyle ? 'inverse' : 'subtle'} radius="full" className="w-8 h-8 flex items-center justify-center shrink-0">
                <User className={cn("w-4 h-4", isBrandStyle ? "text-[var(--lpd-color-brand-primary)]" : "text-[var(--lpd-color-text-base)]")} />
              </Box>
              <span className="hidden lg:block text-xs font-bold truncate max-w-[100px]">Admin User</span>
            </Inline>
          </TopBarRight>

        </Inline>
      </Box>
    </SafeArea>
  );
};

TopBar.Left = TopBarLeft;
TopBar.Center = TopBarCenter;
TopBar.Right = TopBarRight;