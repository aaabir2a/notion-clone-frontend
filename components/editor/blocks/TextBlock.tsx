'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface TextBlockProps {
  content: { text?: string };
  onChange: (content: any) => void;
  onMenuToggle: () => void;
}

export function TextBlock({ content, onChange, onMenuToggle }: TextBlockProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === '/') {
      e.preventDefault();
      onMenuToggle();
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={content.text || ''}
      onChange={(e) => onChange({ text: e.target.value })}
      onKeyDown={handleKeyDown}
      placeholder="Type '/' for commands"
      className={cn(
        'w-full border-none bg-transparent outline-none',
        'placeholder:text-muted-foreground/50'
      )}
    />
  );
}
