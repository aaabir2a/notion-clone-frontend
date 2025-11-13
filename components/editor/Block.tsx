'use client';

import { useState } from 'react';
import { GripVertical, Plus, MoreHorizontal, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { BlockRenderer } from './BlockRenderer';
import { BlockMenu } from './BlockMenu';
import type { Block as BlockType } from '@/types';

interface BlockProps {
  block: BlockType;
  onUpdate: (blockId: string, data: Partial<BlockType>) => void;
  onDelete: (blockId: string) => void;
  onAddBlock: (position: number) => void;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function Block({
  block,
  onUpdate,
  onDelete,
  onAddBlock,
  isSelected,
  onSelect,
}: BlockProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showBlockMenu, setShowBlockMenu] = useState(false);

  const handleContentChange = (content: any) => {
    onUpdate(block.id, { content });
  };

  const handleTypeChange = (type: BlockType['type']) => {
    onUpdate(block.id, { type, content: {} });
    setShowBlockMenu(false);
  };

  return (
    <div
      className={cn(
        'group relative py-1',
        isSelected && 'bg-accent/50'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
    >
      {/* Left Controls */}
      {isHovered && (
        <div className="absolute left-0 top-0 flex items-center gap-1 -translate-x-full pr-1">
          {/* Add Block Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              onAddBlock(block.position + 1);
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>

          {/* Drag Handle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 cursor-grab opacity-0 group-hover:opacity-100"
          >
            <GripVertical className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Block Content */}
      <div className="min-h-[1.5rem]">
        <BlockRenderer
          block={block}
          onChange={handleContentChange}
          onMenuToggle={() => setShowBlockMenu(!showBlockMenu)}
        />
      </div>

      {/* Block Type Menu */}
      {showBlockMenu && (
        <div className="absolute left-0 top-full z-50 mt-1">
          <BlockMenu onSelectType={handleTypeChange} onClose={() => setShowBlockMenu(false)} />
        </div>
      )}

      {/* Right Controls */}
      {isHovered && (
        <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onDelete(block.id)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
