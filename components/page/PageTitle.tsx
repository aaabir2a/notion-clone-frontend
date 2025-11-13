'use client';

import { useState, useRef, useEffect } from 'react';
import { Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';

interface PageTitleProps {
  title: string;
  icon?: string | null;
  onTitleChange?: (title: string) => void;
  onIconChange?: (icon: string | null) => void;
  editable?: boolean;
}

export function PageTitle({
  title,
  icon,
  onTitleChange,
  onIconChange,
  editable = true,
}: PageTitleProps) {
  const [localTitle, setLocalTitle] = useState(title);
  const [isEditingIcon, setIsEditingIcon] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const debouncedTitle = useDebounce(localTitle, 500);

  useEffect(() => {
    if (debouncedTitle !== title && debouncedTitle.trim()) {
      onTitleChange?.(debouncedTitle);
    }
  }, [debouncedTitle]);

  useEffect(() => {
    setLocalTitle(title);
  }, [title]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [localTitle]);

  const handleAddIcon = () => {
    const emoji = prompt('Enter an emoji:');
    if (emoji) {
      onIconChange?.(emoji.slice(0, 2));
    }
  };

  const handleRemoveIcon = () => {
    onIconChange?.(null);
  };

  return (
    <div className="space-y-4">
      {/* Icon Section */}
      <div className="flex items-center gap-2">
        {icon ? (
          <div className="group relative">
            <div className="text-6xl">{icon}</div>
            {editable && (
              <div className="absolute -bottom-2 left-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAddIcon}
                  className="h-6 text-xs"
                >
                  Change
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveIcon}
                  className="h-6 text-xs"
                >
                  Remove
                </Button>
              </div>
            )}
          </div>
        ) : editable ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAddIcon}
            className="text-muted-foreground"
          >
            <Smile className="mr-2 h-4 w-4" />
            Add icon
          </Button>
        ) : null}
      </div>

      {/* Title Input */}
      {editable ? (
        <textarea
          ref={textareaRef}
          value={localTitle}
          onChange={(e) => {
            setLocalTitle(e.target.value);
            adjustTextareaHeight();
          }}
          placeholder="Untitled"
          className={cn(
            'w-full resize-none border-none bg-transparent text-5xl font-bold outline-none',
            'placeholder:text-muted-foreground/50'
          )}
          rows={1}
        />
      ) : (
        <h1 className="text-5xl font-bold">{title || 'Untitled'}</h1>
      )}
    </div>
  );
}
