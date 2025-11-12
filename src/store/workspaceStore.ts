import { create } from 'zustand';
import { workspaceApi } from '@/lib/api/workspace';
import type { Workspace, WorkspaceMember } from '@/types';

interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  members: WorkspaceMember[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchWorkspaces: () => Promise<void>;
  fetchWorkspace: (id: string) => Promise<void>;
  createWorkspace: (data: {
    name: string;
    description?: string;
    icon?: string;
  }) => Promise<Workspace>;
  updateWorkspace: (id: string, data: Partial<Workspace>) => Promise<void>;
  deleteWorkspace: (id: string) => Promise<void>;
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  addMember: (workspaceId: string, email: string, role?: string) => Promise<void>;
  removeMember: (workspaceId: string, memberId: string) => Promise<void>;
  clearError: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  workspaces: [],
  currentWorkspace: null,
  members: [],
  isLoading: false,
  error: null,

  fetchWorkspaces: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await workspaceApi.getWorkspaces();
      set({ workspaces: response.data?.workspaces || [], isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch workspaces',
        isLoading: false,
      });
    }
  },

  fetchWorkspace: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const response = await workspaceApi.getWorkspace(id);
      set({
        currentWorkspace: response.data?.workspace || null,
        members: response.data?.workspace?.members || [],
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch workspace',
        isLoading: false,
      });
    }
  },

  createWorkspace: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const response = await workspaceApi.createWorkspace(data);
      const newWorkspace = response.data?.workspace;

      if (newWorkspace) {
        set((state) => ({
          workspaces: [...state.workspaces, newWorkspace],
          isLoading: false,
        }));
      }

      return newWorkspace!;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create workspace',
        isLoading: false,
      });
      throw error;
    }
  },

  updateWorkspace: async (id, data) => {
    try {
      const response = await workspaceApi.updateWorkspace(id, data);
      const updated = response.data?.workspace;

      set((state) => ({
        workspaces: state.workspaces.map((w) => (w.id === id ? updated! : w)),
        currentWorkspace:
          state.currentWorkspace?.id === id ? updated! : state.currentWorkspace,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to update workspace' });
      throw error;
    }
  },

  deleteWorkspace: async (id) => {
    try {
      await workspaceApi.deleteWorkspace(id);
      set((state) => ({
        workspaces: state.workspaces.filter((w) => w.id !== id),
        currentWorkspace: state.currentWorkspace?.id === id ? null : state.currentWorkspace,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to delete workspace' });
      throw error;
    }
  },

  setCurrentWorkspace: (workspace) => {
    set({ currentWorkspace: workspace });
  },

  addMember: async (workspaceId, email, role) => {
    try {
      const response = await workspaceApi.addMember(workspaceId, { email, role });
      const newMember = response.data?.member;

      if (newMember) {
        set((state) => ({
          members: [...state.members, newMember],
        }));
      }
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to add member' });
      throw error;
    }
  },

  removeMember: async (workspaceId, memberId) => {
    try {
      await workspaceApi.removeMember(workspaceId, memberId);
      set((state) => ({
        members: state.members.filter((m) => m.id !== memberId),
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to remove member' });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
