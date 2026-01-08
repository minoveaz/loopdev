import { SuiteHomeLayoutProps } from '@loopdev/ui';

/**
 * @config MarketingStudioHomeConfig
 * @description Definición de acciones, métricas y módulos para el Home de Marketing.
 */
export const getMarketingStudioHomeConfig = (router: any): Omit<SuiteHomeLayoutProps, 'userState'> => ({
  title: 'Marketing Studio',
  subtitle: 'The control center for your brand identity and intelligent content generation.',
  contextLine: 'Working on brand: Loop Health · Last activity: 2h',
  
  notices: [
    {
      id: 'n1',
      message: 'You have 8 unclassified assets in the Brand Hub.',
      tone: 'info',
      action: { label: 'Classify Now', onClick: () => router.push('/marketing-studio/brands') }
    }
  ],

  quickActions: [
    {
      id: 'qa1',
      label: 'New Brand',
      description: 'Define identity rules',
      icon: 'add_business',
      onClick: () => router.push('/marketing-studio/brands/new')
    },
    {
      id: 'qa2',
      label: 'Generate Post',
      description: 'AI-powered content',
      icon: 'auto_awesome',
      onClick: () => router.push('/marketing-studio/content/new')
    },
    {
      id: 'qa3',
      label: 'Upload Assets',
      description: 'DAM Centralized',
      icon: 'cloud_upload',
      onClick: () => router.push('/marketing-studio/assets/upload')
    }
  ],

  metrics: [
    { id: 'm1', label: 'Brands Managed', value: 12, tone: 'success' },
    { id: 'm2', label: 'Assets Stored', value: '1.2k', trend: 'up', tone: 'neutral' },
    { id: 'm3', label: 'Active Campaigns', value: 3, trend: 'down', tone: 'warning' },
    { id: 'm4', label: 'AI Credits', value: '84%', tone: 'warning' }
  ],

  modules: [
    {
      id: 'mod1',
      name: 'Brand Hub',
      description: 'Manage logos, colors, typography and brand guidelines in one place.',
      status: 'active',
      lastActivity: '3h ago',
      ctaLabel: 'Continue',
      onOpen: () => router.push('/marketing-studio/brands')
    },
    {
      id: 'mod2',
      name: 'Content Engine',
      description: 'Generative AI for copy, social posts and marketing automation.',
      status: 'coming_soon',
      lastActivity: '--',
      ctaLabel: 'Notify Me',
      onOpen: () => console.log('Open Content Engine')
    },
    {
      id: 'mod3',
      name: 'Asset Manager',
      description: 'Centralized Digital Asset Management with smart tagging.',
      status: 'coming_soon',
      ctaLabel: 'Open',
      onOpen: () => console.log('Open Assets')
    }
  ],

  activity: [
    { id: 'a1', action: 'Edited Brand Guidelines', module: 'Brand Hub', timestamp: '3h ago', href: '/marketing-studio/brands', icon: 'edit_document', tone: 'neutral', description: 'Updated primary color palette for' },
    { id: 'a2', action: 'Generated 3 Social Posts', module: 'Content Engine', timestamp: 'Yesterday', href: '#', icon: 'auto_awesome', tone: 'primary', description: 'AI generated new campaign copy for' },
    { id: 'a3', action: 'Uploaded 12 assets', module: 'Asset Manager', timestamp: '2d ago', href: '#', icon: 'cloud_upload', tone: 'success', description: 'New icons and logos added to' }
  ],

  onViewActivityAll: () => console.log('Viewing all activity...')
});
