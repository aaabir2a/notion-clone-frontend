import { useEffect, useState } from 'react';
import { useEditor } from './useEditor';
import { useSocket } from './useSocket';
import type { Block } from '@/types';

export function useBlocks(pageId?: string) {
  const { blocks, addBlock, updateBlock, deleteBlock, reorderBlocks } = useEditor(pageId);
  const { socket, socketClient } = useSocket();
  const [localBlocks, setLocalBlocks] = useState<Block[]>(blocks);

  useEffect(() => {
    setLocalBlocks(blocks);
  }, [blocks]);

  // Listen for real-time block updates
  useEffect(() => {
    if (!socket || !pageId) return;

    const handleBlockCreated = (data: { block: Block; userId: string }) => {
      const currentUserId = JSON.parse(
        localStorage.getItem('auth-storage') || '{}'
      ).state?.user?.id;

      if (data.userId !== currentUserId) {
        setLocalBlocks((prev) => [...prev, data.block]);
      }
    };

    const handleBlockUpdated = (data: {
      blockId: string;
      content: any;
      type?: string;
      userId: string;
    }) => {
      const currentUserId = JSON.parse(
        localStorage.getItem('auth-storage') || '{}'
      ).state?.user?.id;

      if (data.userId !== currentUserId) {
        setLocalBlocks((prev) =>
          prev.map((block) =>
            block.id === data.blockId
              ? { ...block, content: data.content, ...(data.type && { type: data.type }) }
              : block
          )
        );
      }
    };

    const handleBlockDeleted = (data: { blockId: string; userId: string }) => {
      const currentUserId = JSON.parse(
        localStorage.getItem('auth-storage') || '{}'
      ).state?.user?.id;

      if (data.userId !== currentUserId) {
        setLocalBlocks((prev) => prev.filter((block) => block.id !== data.blockId));
      }
    };

    const handleBlockMoved = (data: {
      blockId: string;
      newPosition: number;
      parentId?: string;
      userId: string;
    }) => {
      const currentUserId = JSON.parse(
        localStorage.getItem('auth-storage') || '{}'
      ).state?.user?.id;

      if (data.userId !== currentUserId) {
        setLocalBlocks((prev) =>
          prev.map((block) =>
            block.id === data.blockId
              ? {
                  ...block,
                  position: data.newPosition,
                  ...(data.parentId !== undefined && { parentId: data.parentId }),
                }
              : block
          )
        );
      }
    };

    socketClient.onBlockCreated(handleBlockCreated);
    socketClient.onBlockUpdated(handleBlockUpdated);
    socketClient.onBlockDeleted(handleBlockDeleted);
    socketClient.onBlockMoved(handleBlockMoved);

    return () => {
      socketClient.offBlockCreated(handleBlockCreated);
      socketClient.offBlockUpdated(handleBlockUpdated);
      socketClient.offBlockDeleted(handleBlockDeleted);
      socket.off('block:moved', handleBlockMoved);
    };
  }, [socket, pageId]);

  // Emit block updates
  const updateBlockWithSocket = async (blockId: string, data: Partial<Block>) => {
    if (pageId) {
      socketClient.emitBlockUpdate(pageId, blockId, data.content, data.type);
    }
    await updateBlock(blockId, data);
  };

  const deleteBlockWithSocket = async (blockId: string) => {
    if (pageId) {
      socketClient.emitBlockDeleted(pageId, blockId);
    }
    await deleteBlock(blockId);
  };

  return {
    blocks: localBlocks,
    addBlock,
    updateBlock: updateBlockWithSocket,
    deleteBlock: deleteBlockWithSocket,
    reorderBlocks,
  };
}
