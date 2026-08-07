import { useContext } from 'react';
import { WorkspaceContext, type WorkspaceContextType } from '@/providers/WorkspaceProvider';

export const useWorkspace = (): WorkspaceContextType => {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error('useWorkspace must be used within a WorkspaceProvider');
  return context;
};
