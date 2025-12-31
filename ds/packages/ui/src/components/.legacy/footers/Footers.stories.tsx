import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SaaSFooter } from './SaaSFooter';
import { MarketingFooter } from './MarketingFooter';
import { MobileNav } from './MobileNav';
import { Home, Search, Bell, User, Plus } from 'lucide-react';
import { TenantProvider } from '../../../providers/tenant-provider';

const meta: Meta<typeof SaaSFooter> = {
  title: '🏗️ Organisms/Global/Footers',
  component: SaaSFooter,
  decorators: [
    (Story) => (
      <TenantProvider tenant="loopdev">
        <div className="w-full min-h-[200px] flex items-end">
          <Story />
        </div>
      </TenantProvider>
    ),
  ],
};

export default meta;

export const SaaS: StoryObj<typeof SaaSFooter> = {
  args: {
    version: 'v1.2.4',
    links: [
      { label: 'System Status', href: '#' },
      { label: 'Support', href: '#' },
      { label: 'Feedback', href: '#' },
    ],
  },
};

export const Marketing: StoryObj<typeof MarketingFooter> = {
  render: () => (
    <div className="w-full">
      <MarketingFooter 
        description="The modern brand system for engineering and design excellence. Built for scale, consistency and speed."
        sections={[
          {
            title: 'Product',
            links: [
              { label: 'Components', href: '#' },
              { label: 'Foundations', href: '#' },
              { label: 'Templates', href: '#' },
              { label: 'Showcase', href: '#' },
            ]
          },
          {
            title: 'Resources',
            links: [
              { label: 'Documentation', href: '#' },
              { label: 'Release Notes', href: '#' },
              { label: 'Community', href: '#' },
              { label: 'Tutorials', href: '#' },
            ]
          },
          {
            title: 'Company',
            links: [
              { label: 'About Us', href: '#' },
              { label: 'Careers', href: '#' },
              { label: 'Privacy Policy', href: '#' },
              { label: 'Contact', href: '#' },
            ]
          }
        ]}
      />
    </div>
  )
};

export const Mobile: StoryObj<typeof MobileNav> = {
  args: {
    items: [
      { id: 'home', label: 'Home', icon: Home, active: true },
      { id: 'search', label: 'Search', icon: Search },
      { id: 'add', label: 'Create', icon: Plus },
      { id: 'inbox', label: 'Inbox', icon: Bell },
      { id: 'profile', label: 'Account', icon: User },
    ],
  },
};
