import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AppShell } from './AppShell';
import { PageHeader } from '@/components/organisms/PageHeader';
import { LeftSidebar, type SidebarItem } from '@/components/organisms/LeftSidebar';
import { RightSidebar } from '@/components/organisms/RightSidebar';
import { BrandIdentityView } from './brand-identity-view';
import { Button } from '@/components/atoms/button';
import { useTenant } from '@/providers/tenant-provider';
import { TENANT_DATA } from '@/data/tenants';
import { Save, Share2, LayoutDashboard, Target, Briefcase, BarChart3, Activity, Plus, Bell, Sparkles, MessageSquare, Home, Search, User } from 'lucide-react';
import { TenantProvider } from '@/providers/tenant-provider';
import { Stack, Inline, Box, Container, Grid } from '@/components/layout/foundations';
import { SaaSFooter, MobileNav } from '@/components/organisms/footers';
import { cn } from '@/helpers/cn';

const meta: Meta<typeof AppShell> = {
  title: '🖥️ Templates/AppShell (Master)',
  component: AppShell,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof AppShell>;

const sidebarItems: SidebarItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'dash', label: 'Dashboard', icon: LayoutDashboard, active: true },
  { 
    id: 'marketing', 
    label: 'Marketing', 
    icon: Target,
    flyoutContent: (
      <Stack gap={2}>
        <button className="text-left p-2 hover:bg-black/5 rounded text-sm">Campaign Orchestrator</button>
        <button className="text-left p-2 hover:bg-black/5 rounded text-sm">Content Engine</button>
        <button className="text-left p-2 hover:bg-black/5 rounded text-sm">Growth Ops</button>
      </Stack>
    )
  },
  { 
    id: 'brand', 
    label: 'Brand', 
    icon: Briefcase,
    flyoutContent: (
      <Stack gap={2}>
        <p className="text-[10px] uppercase font-bold opacity-30 px-2">Design System</p>
        <button className="text-left p-2 hover:bg-black/5 rounded text-sm">Foundations</button>
        <button className="text-left p-2 hover:bg-black/5 rounded text-sm">Components</button>
        <p className="text-[10px] uppercase font-bold opacity-30 px-2 mt-4">Guidelines</p>
        <button className="text-left p-2 hover:bg-black/5 rounded text-sm">Voice & Tone</button>
      </Stack>
    )
  },
  { id: 'analytics', label: 'Insights', icon: BarChart3 },
];

export const FullSaaSLayout: Story = {
  render: () => {
    const { tenant } = useTenant();
    const config = TENANT_DATA[tenant];
    const [isRightOpen, setIsRightOpen] = React.useState(true);
    const [activeTab, setActiveTab] = React.useState('activity');

    const rightTabs = config.settings.layout.rightSidebarHasRail ? [
      { id: 'activity', icon: Activity, label: 'Activity' },
      { id: 'notifications', icon: Bell, label: 'Inbox' },
      { id: 'ai', icon: Sparkles, label: 'Intelligence' },
      { id: 'chat', icon: MessageSquare, label: 'Support' },
    ] : [];

    const mobileNavItems = [
      { id: 'home', label: 'Home', icon: Home, active: true },
      { id: 'marketing', label: 'Market', icon: Target },
      { id: 'brand', label: 'Brand', icon: Briefcase },
      { id: 'activity', label: 'Pulse', icon: Activity },
      { id: 'profile', label: 'Account', icon: User },
    ];

    const isBrandHeader = config.settings.layout.headerStyle === 'brand';

    return (
      <>
        <AppShell
          leftSidebar={
            <LeftSidebar 
              items={sidebarItems} 
            />
          }
          rightSidebar={
            <RightSidebar 
              isOpen={isRightOpen} 
              onClose={() => setIsRightOpen(false)}
              title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              tabs={rightTabs}
              activeTabId={activeTab}
              onTabChange={setActiveTab}
            >
              <Stack gap={4}>
                <Box padding={4} background="subtle" radius="xl" border className="italic text-xs text-center opacity-50">
                  Displaying content for tab: {activeTab}
                </Box>
                {[1, 2, 3].map(i => (
                  <Box key={i} padding={3} background="base" radius="lg" border>
                    <Inline gap={3} align="start" wrap={false}>
                      <div className="w-8 h-8 rounded-full bg-[var(--lpd-color-brand-primary)]/20 flex items-center justify-center shrink-0">
                        <Activity size={14} className="text-[var(--lpd-color-brand-primary)]" />
                      </div>
                      <Stack gap={1}>
                        <p className="text-xs font-bold leading-tight">System Event {i}</p>
                        <p className="text-[10px] text-[var(--lpd-color-text-muted)] leading-tight">Action performed in {config.name}.</p>
                      </Stack>
                    </Inline>
                  </Box>
                ))}
              </Stack>
            </RightSidebar>
          }
          header={
            <PageHeader
              title={`${config.name} Dashboard`}
              description={`Experience the layout configured for ${config.name}.`}
              breadcrumbs={<span>Home / Dashboard</span>}
              actions={<Button variant="primary" leftIcon={<Plus size={16} />}>Action</Button>}
            />
          }
          footer={
            <SaaSFooter 
              version="v2.4.0-agnostic" 
              links={[
                { label: 'System Status', href: '#' },
                { label: 'Privacy Policy', href: '#' },
                { label: 'Support', href: '#' },
              ]} 
            />
          }
        >
          <Stack gap={8}>
            {/* Brand Welcome Banner */}
            <Box padding={8} background="primary" radius="3xl" className="relative overflow-hidden shadow-2xl shadow-[var(--lpd-color-brand-primary)]/20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
              <div className="relative z-10">
                <h2 className={cn("text-3xl font-bold mb-2", isBrandHeader ? "text-[var(--lpd-color-text-base)]" : "text-white")}>
                  Welcome to {config.name}
                </h2>
                <p className={cn("opacity-90 max-w-xl text-lg", isBrandHeader ? "text-[var(--lpd-color-text-base)]" : "text-white")}>
                  Your brand ecosystem is synchronized and ready for the next campaign.
                </p>
              </div>
            </Box>

            {/* KPI Grid */}
            <Grid responsive="cards" gap={6}>
              <Box padding={6} background="base" radius="2xl" border className="hover:border-[var(--lpd-color-brand-primary)] transition-colors group">
                <Stack gap={4}>
                  <Inline justify="between">
                    <div className="w-10 h-10 rounded-xl bg-[var(--lpd-color-brand-primary)]/10 flex items-center justify-center text-[var(--lpd-color-brand-primary)]">
                      <Activity size={20} />
                    </div>
                    <span className="text-xs font-bold text-green-500">+12.5%</span>
                  </Inline>
                  <Stack gap={1}>
                    <p className="text-sm font-medium text-[var(--lpd-color-text-muted)]">Global Engagement</p>
                    <p className="text-3xl font-bold">84.2k</p>
                  </Stack>
                </Stack>
              </Box>

              <Box padding={6} background="base" radius="2xl" border className="hover:border-[var(--lpd-color-brand-secondary)] transition-colors">
                <Stack gap={4}>
                  <Inline justify="between">
                    <div className="w-10 h-10 rounded-xl bg-[var(--lpd-color-brand-secondary)]/10 flex items-center justify-center text-[var(--lpd-color-brand-secondary)]">
                      <Target size={20} />
                    </div>
                    <span className="text-xs font-bold text-blue-500">Active</span>
                  </Inline>
                  <Stack gap={1}>
                    <p className="text-sm font-medium text-[var(--lpd-color-text-muted)]">Active Campaigns</p>
                    <p className="text-3xl font-bold">24</p>
                  </Stack>
                </Stack>
              </Box>

              <Box padding={6} background="base" radius="2xl" border>
                <Stack gap={4}>
                  <Inline justify="between">
                    <div className="w-10 h-10 rounded-xl bg-[var(--lpd-color-brand-primary)]/10 flex items-center justify-center text-[var(--lpd-color-brand-primary)]">
                      <Sparkles size={20} />
                    </div>
                  </Inline>
                  <Stack gap={1}>
                    <p className="text-sm font-medium text-[var(--lpd-color-text-muted)]">AI Suggestions</p>
                    <p className="text-3xl font-bold text-[var(--lpd-color-brand-primary)]">15</p>
                  </Stack>
                </Stack>
              </Box>

              <Box padding={6} background="secondary" radius="2xl" className="shadow-xl shadow-[var(--lpd-color-brand-secondary)]/10">
                <Stack gap={4}>
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
                    <MessageSquare size={20} />
                  </div>
                  <Stack gap={1}>
                    <p className="text-sm font-medium text-white/80">Pending Reviews</p>
                    <p className="text-3xl font-bold text-white">08</p>
                  </Stack>
                </Stack>
              </Box>
            </Grid>

            {/* Secondary Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Box className="lg:col-span-2" padding={8} background="subtle" radius="3xl" border>
                <h3 className="font-bold text-xl mb-4 text-[var(--lpd-color-brand-primary)]">Strategy Pulse</h3>
                <div className="h-48 flex items-end gap-2">
                  {[40, 70, 45, 90, 65, 80, 30, 95, 50].map((h, i) => (
                    <div key={i} className="flex-1 bg-[var(--lpd-color-brand-primary)] rounded-t-lg opacity-40 hover:opacity-100 transition-opacity" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </Box>
              <Box padding={8} background="base" radius="3xl" border>
                <h3 className="font-bold text-xl mb-4">Quick Stats</h3>
                <Stack gap={4}>
                  {[1, 2, 3].map(i => (
                    <Stack key={i} gap={2}>
                      <Inline justify="between" className="text-sm font-medium">
                        <span>Brand Consistency</span>
                        <span>9{i}%</span>
                      </Inline>
                      <div className="h-2 bg-[var(--lpd-color-bg-subtle)] rounded-full overflow-hidden">
                        <div className="h-full bg-[var(--lpd-color-brand-primary)]" style={{ width: `9${i}%` }} />
                      </div>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </div>
          </Stack>
        </AppShell>
        
        {/* Mobile Navigation Bar */}
        <MobileNav items={mobileNavItems} />
      </>
    );
  }
};

export const FocusMode: Story = {
  render: () => {
    return (
      <AppShell
        leftSidebar={<LeftSidebar items={sidebarItems} />}
        header={
          <PageHeader
            title="Focus Mode"
            description="Sidebar is collapsed to icons-only for maximum productivity."
            breadcrumbs={<span>Home / Examples / Focus</span>}
          />
        }
      >
        <Box padding={12} background="subtle" radius="3xl" border className="flex items-center justify-center">
          <p className="text-xl font-medium opacity-50">Content area is wider now.</p>
        </Box>
      </AppShell>
    );
  }
};

export const ImmersiveMode: Story = {
  render: () => {
    return (
      <AppShell
        isImmersive={true}
        header={
          <PageHeader
            title="Immersive Wizard"
            description="All sidebars are hidden to focus on a single task."
            actions={<Button variant="primary">Finish Process</Button>}
          />
        }
      >
        <Container size="md">
          <Stack gap={8}>
            <Box padding={12} background="base" radius="3xl" border className="min-h-[400px] flex items-center justify-center">
              <p className="text-xl font-medium opacity-50">Step 1 of 5: General Setup</p>
            </Box>
            <Inline justify="between">
              <Button variant="outline">Back</Button>
              <Button variant="primary">Next Step</Button>
            </Inline>
          </Stack>
        </Container>
      </AppShell>
    );
  }
};

export const Default: Story = {
  render: () => (
    <AppShell leftSidebar={<LeftSidebar items={sidebarItems} />}>
      <BrandIdentityView />
    </AppShell>
  ),
};

export const DualLevelHeader: Story = {
  render: () => {
    const header = (
      <div className="relative group">
        <PageHeader
          title="Brand Identity DNA"
          description="Core strategic assets and visual identity guidelines for the current tenant."
          breadcrumbs={<span>Marketing Studio / Brand Center</span>}
          actions={
            <>
              <Button variant="outline" leftIcon={<Share2 size={16} />}>Share</Button>
              <Button variant="primary" leftIcon={<Save size={16} />}>Save Changes</Button>
            </>
          }
          tabs={
            <div className="flex gap-8 border-b">
              {['Overview', 'Foundations', 'Assets', 'Guidelines'].map((tab, i) => (
                <button 
                  key={tab} 
                  className={`pb-4 text-sm font-medium transition-colors border-b-2 ${i === 0 ? 'border-[var(--lpd-color-brand-primary)] text-[var(--lpd-color-brand-primary)]' : 'border-transparent text-[var(--lpd-color-text-muted)] hover:text-[var(--lpd-color-text-base)]'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          }
        />
      </div>
    );

    return (
      <AppShell header={header} hideSidebar={true}>
        <BrandIdentityView />
      </AppShell>
    );
  },
};

export const Headers: Story = {
  render: () => (
    <AppShell 
      hideSidebar={true}
      header={
        <PageHeader
          title="Brand Identity DNA"
          description="Strategic assets for the current tenant."
          breadcrumbs={<span>Marketing Studio / Brand Center</span>}
          actions={
            <>
              <Button variant="outline" leftIcon={<Share2 size={16} />}>Share</Button>
              <Button variant="primary" leftIcon={<Save size={16} />}>Save</Button>
            </>
          }
        />
      }
    >
      <BrandIdentityView />
    </AppShell>
  ),
};