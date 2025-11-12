import { useEffect } from 'react';
import { useWorkspaceStore } from '@/store/workspaceStore';

export function useWorkspace(workspaceId?: string) {
  const {
    workspaces,
    currentWorkspace,
    members,
    isLoading,
    error,
    fetchWorkspaces,
    fetchWorkspace,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    setCurrentWorkspace,
    addMember,
    removeMember,
    clearError,
  } = useWorkspaceStore();

  useEffect(() => {
    if (workspaceId && workspaceId !== currentWorkspace?.id) {
      fetchWorkspace(workspaceId);
    }
  }, [workspaceId]);

  return {
    workspaces,
    currentWorkspace,
    members,
    isLoading,
    error,
    fetchWorkspaces,
    fetchWorkspace,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    setCurrentWorkspace,
    addMember,
    removeMember,
    clearError,
  };
}
