'use client';

import { useState } from 'react';
import {
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code,
  Image,
  Minus,
  MessageSquare,
  Search,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { BlockType } from '@/types';

interface BlockMenuProps {
  onSelectType: (type: BlockType) => void;
  onClose: () => void;
}

const blockTypes = [
  { type: 'TEXT' as BlockType, label: 'Text', icon: Type, description: 'Plain text' },
  { type: 'HEADING_1' as BlockType, label: 'Heading 1', icon: Heading1, description: 'Large heading' },
  { type: 'HEADING_2' as BlockType, label: 'Heading 2', icon: Heading2, description: 'Medium heading' },
  { type: 'HEADING_3' as BlockType, label: 'Heading 3', icon: Heading3, description: 'Small heading' },
  { type: 'BULLET_LIST' as BlockType, label: 'Bulleted List', icon: List, description: 'Simple bullet list' },
  { type: 'NUMBERED_LIST' as BlockType, label: 'Numbered List', icon: ListOrdered, description: 'Ordered list' },
  { type: 'TODO' as BlockType, label: 'To-do', icon: CheckSquare, description: 'Track tasks' },
  { type: 'QUOTE' as BlockType, label: 'Quote', icon: Quote, description: 'Capture a quote' },
  { type: 'DIVIDER' as BlockType, label: 'Divider', icon: Minus, description: 'Visual divider' },
  { type: 'CODE' as BlockType, label: 'Code', icon: Code, description: 'Code snippet' },
  { type: 'IMAGE' as BlockType, label: 'Image', icon: Image, description: 'Upload or embed' },
  { type: 'CALLOUT' as BlockType, label: 'Callout', icon: MessageSquare, description: 'Highlighted text' },
];

export function BlockMenu({ onSelectType, onClose }: BlockMenuProps) {
  const [search, setSearch] = useState('');

  const filteredTypes = blockTypes.filter((block) =>
    block.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="w-80 p-2">
      <div className="mb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search blocks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            autoFocus
          />
        </div>
      </div>

      <ScrollArea className="h-80">
        <div className="space-y-1">
          {filteredTypes.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No blocks found
            </div>
          ) : (
            filteredTypes.map((block) => {
              const Icon = block.icon;
              return (
                <button
                  key={block.type}
                  onClick={() => onSelectType(block.type)}
                  className={cn(
                    'flex w-full items-start gap-3 rounded-md p-2 text-left transition-colors',
                    'hover:bg-accent'
                  )}
                >
                  <Icon className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="font-medium">{block.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {block.description}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
