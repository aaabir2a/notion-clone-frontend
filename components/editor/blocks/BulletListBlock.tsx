'use client';

import { cn } from '@/lib/utils';

interface BulletListBlockProps {
  content: { text?: string };
  onChange: (content: any) => void;
  onMenuToggle: () => void;
}

export function BulletListBlock({ content, onChange, onMenuToggle }: BulletListBlockProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === '/') {
      e.preventDefault();
      onMenuToggle();
    }
  };

  return (
    <div className="flex items-start gap-2">
      <span className="mt-1.5 text-muted-foreground">•</span>
      <input
        type="text"
        value={content.text || ''}
        onChange={(e) => onChange({ text: e.target.value })}
        onKeyDown={handleKeyDown}
        placeholder="List item"
        className={cn(
          'flex-1 border-none bg-transparent outline-none',
          'placeholder:text-muted-foreground/50'
        )}
      />
    </div>
  );
}
