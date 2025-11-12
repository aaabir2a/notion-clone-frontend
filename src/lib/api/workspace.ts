import { api } from './client';
import type { Workspace, WorkspaceMember, ApiResponse, WorkspaceRole } from '@/types';

export const workspaceApi = {
  // Get all workspaces
  async getWorkspaces(): Promise<ApiResponse<{ workspaces: Workspace[] }>> {
    return api.get('/workspaces');
  },

  // Get workspace by ID
  async getWorkspace(id: string): Promise<ApiResponse<{ workspace: Workspace }>> {
    return api.get(`/workspaces/${id}`);
  },

  // Create workspace
  async createWorkspace(data: {
    name: string;
    description?: string;
    icon?: string;
  }): Promise<ApiResponse<{ workspace: Workspace }>> {
    return api.post('/workspaces', data);
  },

  // Update workspace
  async updateWorkspace(
    id: string,
    data: Partial<Workspace>
  ): Promise<ApiResponse<{ workspace: Workspace }>> {
    return api.patch(`/workspaces/${id}`, data);
  },

  // Delete workspace
  async deleteWorkspace(id: string): Promise<ApiResponse> {
    return api.delete(`/workspaces/${id}`);
  },

  // Add member to workspace
  async addMember(
    workspaceId: string,
    data: { email: string; role?: WorkspaceRole }
  ): Promise<ApiResponse<{ member: WorkspaceMember }>> {
    return api.post(`/workspaces/${workspaceId}/members`, data);
  },

  // Update member role
  async updateMemberRole(
    workspaceId: string,
    memberId: string,
    role: WorkspaceRole
  ): Promise<ApiResponse<{ member: WorkspaceMember }>> {
    return api.patch(`/workspaces/${workspaceId}/members/${memberId}`, { role });
  },

  // Remove member
  async removeMember(workspaceId: string, memberId: string): Promise<ApiResponse> {
    return api.delete(`/workspaces/${workspaceId}/members/${memberId}`);
  },
};
