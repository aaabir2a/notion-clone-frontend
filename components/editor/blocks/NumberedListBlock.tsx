'use client';

import { cn } from '@/lib/utils';

interface NumberedListBlockProps {
  content: { text?: string; number?: number };
  onChange: (content: any) => void;
  onMenuToggle: () => void;
}

export function NumberedListBlock({ content, onChange, onMenuToggle }: NumberedListBlockProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === '/') {
      e.preventDefault();
      onMenuToggle();
    }
  };

  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 text-muted-foreground">{content.number || 1}.</span>
      <input
        type="text"
        value={content.text || ''}
        onChange={(e) => onChange({ ...content, text: e.target.value })}
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
