import { api } from './client';
import type { Block, BlockType, ApiResponse } from '@/types';

export const blockApi = {
  // Get all blocks in page
  async getBlocks(pageId: string): Promise<ApiResponse<{ blocks: Block[] }>> {
    return api.get(`/blocks?pageId=${pageId}`);
  },

  // Get block by ID
  async getBlock(id: string): Promise<ApiResponse<{ block: Block }>> {
    return api.get(`/blocks/${id}`);
  },

  // Create block
  async createBlock(data: {
    pageId: string;
    type: BlockType;
    content: Record<string, any>;
    position: number;
    parentId?: string;
  }): Promise<ApiResponse<{ block: Block }>> {
    return api.post('/blocks', data);
  },

  // Update block
  async updateBlock(
    id: string,
    data: Partial<Block>
  ): Promise<ApiResponse<{ block: Block }>> {
    return api.patch(`/blocks/${id}`, data);
  },

  // Delete block
  async deleteBlock(id: string): Promise<ApiResponse> {
    return api.delete(`/blocks/${id}`);
  },

  // Bulk update blocks
  async bulkUpdateBlocks(
    pageId: string,
    updates: Array<{ id: string; position?: number; content?: any; type?: BlockType }>
  ): Promise<ApiResponse<{ blocks: Block[] }>> {
    return api.post('/blocks/bulk-update', { pageId, updates });
  },
};
