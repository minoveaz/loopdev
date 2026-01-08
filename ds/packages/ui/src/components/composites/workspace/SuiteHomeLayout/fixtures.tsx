import React from 'react';
import { SuiteHomeLayoutProps } from './types';

export const SUITE_HOME_MOCK_PROPS: SuiteHomeLayoutProps = {
  title: 'Marketing Studio',
  subtitle: 'The control center for your brand identity and intelligent content generation.',
  contextLine: 'Working on brand: Loop Health · Last activity: 2h',
  userState: 'active',
  notices: [
    {
      id: 'n1',
      severity: 'info',
      title: 'Unclassified Assets',
      description: 'You have 8 new files in the Brand Hub.',
      primaryAction: { label: 'Classify Now', onClick: () => console.log('Classify') }
    },
    {
      id: 'n2',
      severity: 'warning',
      title: 'AI Credits Low',
      description: 'System-wide credits are at 15%.',
      primaryAction: { label: 'Top Up', onClick: () => console.log('Top up') }
    }
  ],
  quickActions: [
    {
      id: 'qa1',
      label: 'New Brand',
      description: 'Setup identity',
      icon: 'verified_user',
      onClick: () => console.log('New Brand')
    },
    {
      id: 'qa2',
      label: 'Generate Post',
      description: 'AI Content',
      icon: 'auto_awesome',
      onClick: () => console.log('Generate Post')
    },
    {
      id: 'qa3',
      label: 'Upload Assets',
      description: 'Feed system',
      icon: 'cloud_upload',
      onClick: () => console.log('Upload')
    }
  ],
  metrics: [
    { id: 'm1', label: 'Brands Managed', value: 12, tone: 'success' },
    { id: 'm2', label: 'Assets Stored', value: '1.2k', trend: 'up', tone: 'neutral' },
    { id: 'm3', label: 'Active Campaigns', value: 3, trend: 'down', tone: 'warning' },
    { id: 'm4', label: 'AI Health', value: '98%', tone: 'success' }
  ],
  modules: [
    {
      id: 'mod1',
      name: 'Brand Hub',
      description: 'Manage logos, colors, typography and brand guidelines in one place.',
      status: 'active',
      lastActivity: '3h ago',
      ctaLabel: 'Continue',
      onOpen: () => console.log('Open Brand Hub')
    },
    {
      id: 'mod2',
      name: 'Content Engine',
      description: 'Generative AI for copy, social posts and marketing automation.',
      status: 'deploying',
      lastActivity: 'Yesterday',
      ctaLabel: 'Open',
      onOpen: () => console.log('Open Content Engine')
    },
    {
      id: 'mod3',
      name: 'Asset Manager',
      description: 'Centralized Digital Asset Management with smart tagging.',
      status: 'coming_soon',
      ctaLabel: 'Notify Me',
      onOpen: () => console.log('Open Assets')
    }
  ],
  activity: [
    { id: 'a1', action: 'Edited Brand Guidelines', module: 'Brand Hub', timestamp: '3h ago', href: '#', icon: 'edit_document', tone: 'neutral' },
    { id: 'a2', action: 'Generated 3 Social Posts', module: 'Content Engine', timestamp: 'Yesterday', href: '#', icon: 'auto_awesome', tone: 'primary' },
    { id: 'a3', action: 'Uploaded 12 assets', module: 'Asset Manager', timestamp: '2d ago', href: '#', icon: 'cloud_upload', tone: 'success' }
  ]
};