'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface TodoBlockProps {
  content: { text?: string; checked?: boolean };
  onChange: (content: any) => void;
  onMenuToggle: () => void;
}

export function TodoBlock({ content, onChange, onMenuToggle }: TodoBlockProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === '/') {
      e.preventDefault();
      onMenuToggle();
    }
  };

  return (
    <div className="flex items-start gap-2">
      <Checkbox
        checked={content.checked || false}
        onCheckedChange={(checked) => onChange({ ...content, checked })}
        className="mt-1"
      />
      <input
        type="text"
        value={content.text || ''}
        onChange={(e) => onChange({ ...content, text: e.target.value })}
        onKeyDown={handleKeyDown}
        placeholder="To-do"
        className={cn(
          'flex-1 border-none bg-transparent outline-none',
          content.checked && 'line-through text-muted-foreground',
          'placeholder:text-muted-foreground/50'
        )}
      />
    </div>
  );
}
