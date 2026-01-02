
import React from 'react';
import { createPortal } from 'react-dom';
import { DrawerOverlay, DrawerPanel, DrawerFooter } from '@blueprints/components/functional/Drawer/components';
import { useDrawer } from '@blueprints/components/functional/Drawer/useDrawer';

interface DrawerComposition {
  Footer: typeof DrawerFooter;
}

interface DrawerMainProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  actions?: React.ReactNode;
  portalTarget?: HTMLElement | null;
}

const DrawerMain: React.FC<DrawerMainProps> = ({ 
  isOpen, 
  onClose, 
  children = <div className="p-6">This is the default content of the drawer. You can put any component or text here.</div>, 
  title = "Blueprint Drawer", 
  size = 'md',
  actions,
  portalTarget
}) => {
  // Use Portal to render outside the DOM hierarchy if needed (defaults to document.body)
  const target = portalTarget || (typeof document !== 'undefined' ? document.body : null);

  if (!target) return null;

  return createPortal(
    <>
      <DrawerOverlay isOpen={isOpen} onClose={onClose} />
      <DrawerPanel 
        isOpen={isOpen} 
        onClose={onClose} 
        title={title} 
        size={size} 
        actions={actions}
      >
        {children}
      </DrawerPanel>
    </>,
    target
  );
};

// Compound Component Pattern
export const Drawer = Object.assign(DrawerMain, {
  Footer: DrawerFooter
}) as React.FC<DrawerMainProps> & DrawerComposition;

export { useDrawer };
