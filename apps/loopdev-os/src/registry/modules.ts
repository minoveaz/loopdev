import { LayoutDashboard, ShieldCheck } from 'lucide-react';

export interface ModuleConfig {
  id: string;
  name: string;
  path: string;
  icon: any;
  description: string;
  adminPath?: string;
}

export const ACTIVE_MODULES: ModuleConfig[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    path: '/:tenantId/dashboard',
    icon: LayoutDashboard,
    description: 'Vista general del negocio.'
  },
  {
    id: 'architect',
    name: 'Architect',
    path: '/admin/architect',
    icon: ShieldCheck,
    description: 'Herramienta de auditoría de diseño.',
    adminPath: '/admin/architect'
  }
];
