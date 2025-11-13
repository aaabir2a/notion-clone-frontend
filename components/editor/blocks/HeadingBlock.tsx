'use client';

import { cn } from '@/lib/utils';

interface HeadingBlockProps {
  level: 1 | 2 | 3;
  content: { text?: string };
  onChange: (content: any) => void;
  onMenuToggle: () => void;
}

export function HeadingBlock({ level, content, onChange, onMenuToggle }: HeadingBlockProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === '/') {
      e.preventDefault();
      onMenuToggle();
    }
  };

  const sizes = {
    1: 'text-4xl',
    2: 'text-3xl',
    3: 'text-2xl',
  };

  return (
    <input
      type="text"
      value={content.text || ''}
      onChange={(e) => onChange({ text: e.target.value })}
      onKeyDown={handleKeyDown}
      placeholder={`Heading ${level}`}
      className={cn(
        'w-full border-none bg-transparent font-bold outline-none',
        sizes[level],
        'placeholder:text-muted-foreground/50'
      )}
    />
  );
}
