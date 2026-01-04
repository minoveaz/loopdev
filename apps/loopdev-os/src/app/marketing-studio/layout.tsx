'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon, Text, Heading } from '@loopdev/ui';
import { useAuth } from '@/hooks/useAuth';

const NavItem = ({ href, icon, label, active }: { href: string, icon: string, label: string, active: boolean }) => (
  <Link href={href}>
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      active 
        ? 'bg-primary/10 text-primary border border-primary/20' 
        : 'text-text-muted hover:bg-white/5 hover:text-white border border-transparent'
    }`}>
      <Icon name={icon} size="sm" className={active ? 'text-primary' : 'group-hover:text-white'} />
      <span className="font-medium text-sm">{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(19,91,236,0.6)]" />}
    </div>
  </Link>
);

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const menuItems = [
    { href: '/marketing-studio', icon: 'dashboard', label: 'Overview' },
    { href: '/marketing-studio/brands', icon: 'auto_awesome_motion', label: 'Brand Hub' },
    { href: '/marketing-studio/content', icon: 'edit_note', label: 'Content Engine' },
    { href: '/marketing-studio/dam', icon: 'inventory_2', label: 'Digital Assets' },
  ];

  return (
    <div className="flex h-screen bg-background-dark overflow-hidden font-sans">
      
      {/* Sidebar de Suite */}
      <aside className="w-64 border-r border-white/5 flex flex-col bg-surface-dark/50 backdrop-blur-xl">
        <div className="p-6 border-b border-white/5">
          <Link href="/launchpad" className="flex items-center gap-2 group mb-6">
            <Icon name="arrow_back" size="sm" className="text-text-muted group-hover:text-primary transition-colors" />
            <Text size="nano" weight="black" className="text-text-muted uppercase tracking-widest group-hover:text-white">Back to OS</Text>
          </Link>
          <Heading size="lg" weight="bold" className="text-white flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Icon name="hub" size="sm" className="text-white" />
            </div>
            <span>Marketing</span>
          </Heading>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="px-4 mb-4">
            <Text size="nano" weight="black" className="text-text-muted uppercase tracking-[0.2em]">Modules</Text>
          </div>
          {menuItems.map((item) => (
            <NavItem 
              key={item.href}
              {...item}
              active={pathname === item.href || (item.href !== '/marketing-studio' && pathname.startsWith(item.href))}
            />
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-white/5 bg-black/20">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent-purple flex items-center justify-center text-[10px] font-bold text-white uppercase">
              {user?.email?.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <Text size="xs" weight="bold" className="text-white truncate block">{user?.email?.split('@')[0]}</Text>
              <Text size="nano" className="text-text-muted truncate block uppercase tracking-tighter">Tenant_Admin</Text>
            </div>
            <button 
              onClick={() => signOut()}
              className="p-2 text-text-muted hover:text-danger transition-colors"
              title="Sign Out"
            >
              <Icon name="logout" size="sm" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative bg-[radial-gradient(circle_at_50%_0%,_rgba(19,91,236,0.05),_transparent)]">
        {children}
      </main>
    </div>
  );
}
