'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Block } from './Block';
import { useEditor } from '@/hooks/useEditor';
import { useSocket } from '@/hooks/useSocket';
import { useBlocks } from '@/hooks/useBlocks';
import type { Block as BlockType } from '@/types';

interface BlockEditorProps {
  pageId: string;
}

export function BlockEditor({ pageId }: BlockEditorProps) {
  const { blocks, addBlock, updateBlock, deleteBlock } = useBlocks(pageId);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const { socket, isConnected } = useSocket();

  // Sort blocks by position
  const sortedBlocks = [...blocks].sort((a, b) => a.position - b.position);

  const handleAddBlock = async (position?: number) => {
    const newPosition = position ?? blocks.length;
    await addBlock('TEXT', newPosition);
  };

  const handleUpdateBlock = async (blockId: string, data: Partial<BlockType>) => {
    await updateBlock(blockId, data);
  };

  const handleDeleteBlock = async (blockId: string) => {
    await deleteBlock(blockId);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-6">
      {/* Blocks List */}
      <div className="space-y-1">
        {sortedBlocks.map((block) => (
          <Block
            key={block.id}
            block={block}
            onUpdate={handleUpdateBlock}
            onDelete={handleDeleteBlock}
            onAddBlock={handleAddBlock}
            isSelected={selectedBlockId === block.id}
            onSelect={() => setSelectedBlockId(block.id)}
          />
        ))}
      </div>

      {/* Add Block Button (at the end) */}
      {blocks.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Start writing or type '/' for commands
          </p>
          <Button onClick={() => handleAddBlock()} variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Add a block
          </Button>
        </div>
      ) : (
        <button
          onClick={() => handleAddBlock()}
          className="w-full py-2 text-left text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md px-2 transition-colors"
        >
          <Plus className="inline-block mr-2 h-4 w-4" />
          Click to add a block
        </button>
      )}

      {/* Connection Status */}
      {isConnected && (
        <div className="fixed bottom-4 right-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2 bg-background border rounded-full px-3 py-1 shadow-sm">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span>Connected</span>
          </div>
        </div>
      )}
    </div>
  );
}
