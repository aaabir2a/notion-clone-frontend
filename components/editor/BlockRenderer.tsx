'use client';

import type { Block } from '@/types';
import { TextBlock } from './blocks/TextBlock';
import { HeadingBlock } from './blocks/HeadingBlock';
import { BulletListBlock } from './blocks/BulletListBlock';
import { NumberedListBlock } from './blocks/NumberedListBlock';
import { TodoBlock } from './blocks/TodoBlock';
import { QuoteBlock } from './blocks/QuoteBlock';
import { DividerBlock } from './blocks/DividerBlock';
import { CodeBlock } from './blocks/CodeBlock';
import { ImageBlock } from './blocks/ImageBlock';
import { CalloutBlock } from './blocks/CalloutBlock';

interface BlockRendererProps {
  block: Block;
  onChange: (content: any) => void;
  onMenuToggle: () => void;
}

export function BlockRenderer({ block, onChange, onMenuToggle }: BlockRendererProps) {
  const commonProps = {
    content: block.content,
    onChange,
    onMenuToggle,
  };

  switch (block.type) {
    case 'TEXT':
      return <TextBlock {...commonProps} />;
    
    case 'HEADING_1':
      return <HeadingBlock level={1} {...commonProps} />;
    
    case 'HEADING_2':
      return <HeadingBlock level={2} {...commonProps} />;
    
    case 'HEADING_3':
      return <HeadingBlock level={3} {...commonProps} />;
    
    case 'BULLET_LIST':
      return <BulletListBlock {...commonProps} />;
    
    case 'NUMBERED_LIST':
      return <NumberedListBlock {...commonProps} />;
    
    case 'TODO':
      return <TodoBlock {...commonProps} />;
    
    case 'QUOTE':
      return <QuoteBlock {...commonProps} />;
    
    case 'DIVIDER':
      return <DividerBlock />;
    
    case 'CODE':
      return <CodeBlock {...commonProps} />;
    
    case 'IMAGE':
      return <ImageBlock {...commonProps} />;
    
    case 'CALLOUT':
      return <CalloutBlock {...commonProps} />;
    
    default:
      return <TextBlock {...commonProps} />;
  }
}
