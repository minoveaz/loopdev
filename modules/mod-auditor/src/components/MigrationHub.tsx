import React, { useState } from 'react';
import { 
  AppShell, 
  LeftSidebar, 
  RightSidebar, 
  PageHeader, 
  Stack, 
  Box, 
  Inline, 
  Grid,
  Button,
  Badge,
  Divider,
  Center
} from '@loopdev/ui';
import { 
  FileCode, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ArrowRightLeft,
  ChevronRight,
  Eye
} from 'lucide-react';

export const MigrationHub: React.FC = () => {
  const [activeBlueprint, setActiveBlueprint] = useState('Foundations');
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);

  // Mock data for sidebars
  const blueprints = [
    { id: 'foundations', label: 'Foundations', icon: FileCode },
    { id: 'forms', label: 'Forms', icon: FileCode },
    { id: 'overlays', label: 'Overlays', icon: FileCode },
  ];

  return (
    <AppShell
      leftSidebar={
        <LeftSidebar 
          items={blueprints.map(b => ({
            id: b.id,
            label: b.label,
            icon: b.icon,
            active: activeBlueprint === b.id
          }))}
          onItemClick={setActiveBlueprint}
        />
      }
      header={
        <PageHeader 
          title="LoopDev Migration Auditor"
          description="Validate and approve automated component atomization."
          breadcrumbs={<span>System / DesignOps / Auditor</span>}
          actions={
            <Button variant="primary" leftIcon={<RefreshCw size={16} />}>Sync Blueprints</Button>
          }
        />
      }
      rightSidebar={
        <RightSidebar
          isOpen={isInspectorOpen}
          onClose={() => setIsInspectorOpen(false)}
          title="Approval Inspector"
        >
          <Stack gap={6}>
            <Box padding={4} background="subtle" radius="xl" border>
              <Stack gap={2}>
                <p className="text-xs font-black uppercase tracking-widest opacity-40">Active Component</p>
                <h4 className="text-lg font-bold">Checkbox Atom</h4>
                <Badge variant="warning">Awaiting Approval</Badge>
              </Stack>
            </Box>

            <Stack gap={4}>
              <h5 className="text-xs font-bold uppercase opacity-40">Validation Checklist</h5>
              <Stack gap={2}>
                <Inline gap={2} align="center" className="text-sm opacity-60">
                  <CheckCircle2 size={14} className="text-green-500" /> Matches Proportions
                </Inline>
                <Inline gap={2} align="center" className="text-sm opacity-60">
                  <CheckCircle2 size={14} className="text-green-500" /> Reacts to Tenant Tokens
                </Inline>
                <Inline gap={2} align="center" className="text-sm opacity-60">
                  <AlertCircle size={14} className="text-amber-500" /> Accessibility check pending
                </Inline>
              </Stack>
            </Stack>

            <Divider />

            <Stack gap={3}>
              <Button variant="primary" className="w-full">Approve & Move to UI</Button>
              <Button variant="outline" className="w-full">Request Refactor</Button>
            </Stack>
          </Stack>
        </RightSidebar>
      }
    >
      {/* A/B COMPARISON AREA */}
      <Grid cols={2} gap={8} className="h-full">
        <Stack gap={4}>
          <Inline justify="between" align="center">
            <h3 className="text-sm font-black uppercase tracking-widest opacity-40">Original Designer Blueprint</h3>
            <Badge variant="neutral">HTML/Static</Badge>
          </Inline>
          <Box padding={8} background="base" radius="3xl" border className="min-h-[400px] flex items-center justify-center bg-slate-50 border-dashed">
             <div className="text-center opacity-30 italic">
                <Eye size={48} className="mx-auto mb-4" />
                <p>Designer Mockup Viewport</p>
             </div>
          </Box>
        </Stack>

        <Stack gap={4}>
          <Inline justify="between" align="center">
            <h3 className="text-sm font-black uppercase tracking-widest opacity-40">LoopDev Atomized Version</h3>
            <Badge variant="brand">Agnostic Component</Badge>
          </Inline>
          <Box padding={8} background="base" radius="3xl" border className="min-h-[400px] flex items-center justify-center shadow-xl">
             <div className="text-center opacity-30 italic">
                <ArrowRightLeft size={48} className="mx-auto mb-4" />
                <p>Live Component Render</p>
             </div>
          </Box>
        </Stack>
      </Grid>
    </AppShell>
  );
};
