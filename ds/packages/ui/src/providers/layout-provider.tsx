import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTenant } from './tenant-provider';
import { TENANT_DATA } from '../data/tenants';

interface LayoutContextType {
  sidebarVariant: 'expanded' | 'collapsed';
  toggleSidebar: () => void;
  setSidebarVariant: (v: 'expanded' | 'collapsed') => void;
  isRightSidebarOpen: boolean;
  toggleRightSidebar: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { tenant } = useTenant();
  const config = TENANT_DATA[tenant];
  
  const [sidebarVariant, setSidebarVariant] = useState<'expanded' | 'collapsed'>(
    config?.settings.layout.sidebarDefaultVariant || 'expanded'
  );
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);

  // Sync with tenant changes
  useEffect(() => {
    setSidebarVariant(config?.settings.layout.sidebarDefaultVariant || 'expanded');
  }, [tenant, config]);

  const toggleSidebar = () => {
    setSidebarVariant(prev => prev === 'expanded' ? 'collapsed' : 'expanded');
  };

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(prev => !prev);
  };

  return (
    <LayoutContext.Provider value={{ 
      sidebarVariant, 
      toggleSidebar, 
      setSidebarVariant,
      isRightSidebarOpen,
      toggleRightSidebar
    }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};
