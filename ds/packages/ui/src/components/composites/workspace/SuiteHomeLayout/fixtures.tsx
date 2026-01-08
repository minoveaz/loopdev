import { SuiteHomeLayoutProps } from './types';

export const SUITE_HOME_MOCK_PROPS: SuiteHomeLayoutProps = {
  title: 'Marketing Studio',
  subtitle: 'The control center for your brand identity and intelligent content generation.',
  contextLine: 'Working on brand: Loop Health · Last activity: 2h',
  userState: 'active',
  notices: [
    {
      id: 'n1',
      message: 'You have 8 unclassified assets in the Brand Hub.',
      tone: 'info',
      action: { label: 'Classify Now', onClick: () => console.log('Classify') }
    },
    {
      id: 'n2',
      message: 'AI Credits are running low (15% remaining).',
      tone: 'warning',
      action: { label: 'Top Up', onClick: () => console.log('Top up') }
    }
  ],
  quickActions: [
    {
      id: 'qa1',
      label: 'New Brand',
      description: 'Define identity rules',
      icon: 'add_business',
      onClick: () => console.log('New Brand')
    },
    {
      id: 'qa2',
      label: 'Generate Post',
      description: 'AI-powered content',
      icon: 'auto_awesome',
      onClick: () => console.log('Generate Post')
    },
    {
      id: 'qa3',
      label: 'Upload Assets',
      description: 'DAM Centralized',
      icon: 'cloud_upload',
      onClick: () => console.log('Upload')
    },
    {
      id: 'qa4',
      label: 'Campaign',
      description: 'Orchestrate launch',
      icon: 'rocket_launch',
      onClick: () => console.log('Campaign')
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
    { id: 'a1', action: 'Edited Brand Guidelines', module: 'Brand Hub', timestamp: '3h ago', href: '#' },
    { id: 'a2', action: 'Generated 3 Social Posts', module: 'Content Engine', timestamp: 'Yesterday', href: '#' },
    { id: 'a3', action: 'Uploaded 12 assets', module: 'Asset Manager', timestamp: '2d ago', href: '#' },
    { id: 'a4', action: 'Created Summer Campaign', module: 'Orchestrator', timestamp: '5d ago', href: '#' },
    { id: 'a5', action: 'Archived legacy logo', module: 'Brand Hub', timestamp: '1w ago', href: '#' }
  ]
};
