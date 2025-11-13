'use client';

import { cn } from '@/lib/utils';

interface QuoteBlockProps {
  content: { text?: string };
  onChange: (content: any) => void;
  onMenuToggle: () => void;
}

export function QuoteBlock({ content, onChange, onMenuToggle }: QuoteBlockProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === '/') {
      e.preventDefault();
      onMenuToggle();
    }
  };

  return (
    <div className="border-l-4 border-primary pl-4">
      <input
        type="text"
        value={content.text || ''}
        onChange={(e) => onChange({ text: e.target.value })}
        onKeyDown={handleKeyDown}
        placeholder="Quote"
        className={cn(
          'w-full border-none bg-transparent italic outline-none',
          'placeholder:text-muted-foreground/50'
        )}
      />
    </div>
  );
}
