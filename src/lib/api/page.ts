import { api } from './client';
import type { Page, ApiResponse } from '@/types';

export const pageApi = {
  // Get all pages in workspace
  async getPages(workspaceId: string): Promise<ApiResponse<{ pages: Page[] }>> {
    return api.get(`/pages?workspaceId=${workspaceId}`);
  },

  // Get page by ID
  async getPage(id: string): Promise<ApiResponse<{ page: Page }>> {
    return api.get(`/pages/${id}`);
  },

  // Create page
  async createPage(data: {
    title: string;
    workspaceId: string;
    parentId?: string;
    icon?: string;
    coverImage?: string;
  }): Promise<ApiResponse<{ page: Page }>> {
    return api.post('/pages', data);
  },

  // Update page
  async updatePage(
    id: string,
    data: Partial<Page>
  ): Promise<ApiResponse<{ page: Page }>> {
    return api.patch(`/pages/${id}`, data);
  },

  // Delete page (archive)
  async deletePage(id: string): Promise<ApiResponse> {
    return api.delete(`/pages/${id}`);
  },

  // Restore page
  async restorePage(id: string): Promise<ApiResponse<{ page: Page }>> {
    return api.post(`/pages/${id}/restore`);
  },

  // Duplicate page
  async duplicatePage(id: string): Promise<ApiResponse<{ page: Page }>> {
    return api.post(`/pages/${id}/duplicate`);
  },
};
