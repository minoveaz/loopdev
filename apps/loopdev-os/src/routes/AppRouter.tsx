import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from '@/pages/public/LandingPage';
import { TenantDashboard } from '@/pages/workspace/TenantDashboard';
import { StudioLayout } from '@/layouts/studio/StudioLayout';
import BlueprintPreview from '@/pages/admin/BlueprintPreview';
import { ArchitectDashboard } from '@loopdev/mod-architect';

/**
 * @file AppRouter.tsx
 * @description Defines the root navigation hierarchy enforcing strict SaaS routing.
 * - / -> Public Landing
 * - /admin -> LoopDev Internal Ops
 * - /:tenantId -> Client Workspace
 */
const AppRouter = () => {
  return (
    <Routes>
      {/* 1. Public Scope */}
      <Route path="/" element={<LandingPage />} />
      
      {/* 2. Admin Scope - Uses Studio Layout */}
      <Route path="/admin" element={<StudioLayout />}>
        <Route index element={<div>Admin Dashboard (WIP)</div>} />
        <Route path="architect" element={<ArchitectDashboard />} />
      </Route>

      {/* 2.1 Isolated Preview Route (Iframe Sandbox) */}
      <Route path="/admin/preview/:componentName" element={<BlueprintPreview />} />

      {/* 3. Tenant Scope (The Workspace) */}
      <Route path="/:tenantId">
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<TenantDashboard />} />
        
        {/* Future Modules will be injected here */}
        {/* <Route path="crm/*" element={<CrmModule />} /> */}
      </Route>

      {/* 404 Catch-all */}
      <Route path="*" element={<div>404 - Página no encontrada</div>} />
    </Routes>
  );
};

export default AppRouter;
