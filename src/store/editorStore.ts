import { create } from 'zustand';
import { blockApi } from '@/lib/api/block';
import type { Block, BlockType } from '@/types';

interface EditorState {
  blocks: Block[];
  selectedBlockId: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchBlocks: (pageId: string) => Promise<void>;
  createBlock: (data: {
    pageId: string;
    type: BlockType;
    content: Record<string, any>;
    position: number;
    parentId?: string;
  }) => Promise<Block>;
  updateBlock: (id: string, data: Partial<Block>) => Promise<void>;
  deleteBlock: (id: string) => Promise<void>;
  reorderBlocks: (updates: Array<{ id: string; position: number }>) => Promise<void>;
  setSelectedBlock: (id: string | null) => void;
  clearBlocks: () => void;
  clearError: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  blocks: [],
  selectedBlockId: null,
  isLoading: false,
  error: null,

  fetchBlocks: async (pageId) => {
    try {
      set({ isLoading: true, error: null });
      const response = await blockApi.getBlocks(pageId);
      set({ blocks: response.data?.blocks || [], isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch blocks',
        isLoading: false,
      });
    }
  },

  createBlock: async (data) => {
    try {
      const response = await blockApi.createBlock(data);
      const newBlock = response.data?.block;

      if (newBlock) {
        set((state) => ({
          blocks: [...state.blocks, newBlock],
        }));
      }

      return newBlock!;
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to create block' });
      throw error;
    }
  },

  updateBlock: async (id, data) => {
    try {
      const response = await blockApi.updateBlock(id, data);
      const updated = response.data?.block;

      set((state) => ({
        blocks: state.blocks.map((b) => (b.id === id ? updated! : b)),
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to update block' });
      throw error;
    }
  },

  deleteBlock: async (id) => {
    try {
      await blockApi.deleteBlock(id);
      set((state) => ({
        blocks: state.blocks.filter((b) => b.id !== id),
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to delete block' });
      throw error;
    }
  },

  reorderBlocks: async (updates) => {
    try {
      const { blocks } = get();
      const pageId = blocks[0]?.pageId;

      if (!pageId) return;

      await blockApi.bulkUpdateBlocks(pageId, updates);

      // Update local state
      set((state) => ({
        blocks: state.blocks.map((block) => {
          const update = updates.find((u) => u.id === block.id);
          return update ? { ...block, position: update.position } : block;
        }),
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to reorder blocks' });
      throw error;
    }
  },

  setSelectedBlock: (id) => set({ selectedBlockId: id }),

  clearBlocks: () => set({ blocks: [], selectedBlockId: null }),

  clearError: () => set({ error: null }),
}));
