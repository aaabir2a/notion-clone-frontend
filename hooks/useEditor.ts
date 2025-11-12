import { useEffect } from 'react';
import { useEditorStore } from '@/store/editorStore';
import type { BlockType } from '@/types';

export function useEditor(pageId?: string) {
  const {
    blocks,
    selectedBlockId,
    isLoading,
    error,
    fetchBlocks,
    createBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
    setSelectedBlock,
    clearBlocks,
    clearError,
  } = useEditorStore();

  useEffect(() => {
    if (pageId) {
      fetchBlocks(pageId);
    }

    return () => {
      clearBlocks();
    };
  }, [pageId]);

  const addBlock = async (
    type: BlockType = 'TEXT',
    position?: number,
    parentId?: string
  ) => {
    if (!pageId) return;

    const newPosition = position ?? blocks.length;

    return createBlock({
      pageId,
      type,
      content: { text: '' },
      position: newPosition,
      parentId,
    });
  };

  return {
    blocks,
    selectedBlockId,
    isLoading,
    error,
    addBlock,
    createBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
    setSelectedBlock,
    clearError,
  };
}
